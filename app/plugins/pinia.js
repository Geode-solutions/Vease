import { BroadcastChannel, createLeaderElection } from "broadcast-channel"

function serialize(obj, keysToUpdate) {
  const object = Object.fromEntries(
    Object.entries(obj).filter(([key]) => keysToUpdate.includes(key)),
  )
  return JSON.parse(JSON.stringify(object))
}

function stateHasKey(key, $state) {
  return Object.keys($state).includes(key)
}

function piniaSharedState() {
  return async ({ store, options }) => {
    const omittedKeys = options?.share?.omit ?? []
    store.is_sync = false
    const channel = new BroadcastChannel(store.$id)
    const election = createLeaderElection(channel)
    let timestamp = 0
    let externalUpdate = false
    const keysToUpdate = Object.keys(store.$state).filter(
      (key) => !omittedKeys.includes(key) && stateHasKey(key, store.$state),
    )
    channel.addEventListener("message", (newState) => {
      if (newState === undefined) {
        channel.postMessage({
          timestamp,
          state: serialize(store.$state, keysToUpdate),
        })
        return
      }

      const { timestamp: incomingTimestamp, state: incomingState } = newState
      if (incomingTimestamp <= timestamp) {
        return
      }

      externalUpdate = true
      timestamp = incomingTimestamp
      store.$patch((state) => {
        for (const key of keysToUpdate) {
          state[key] = incomingState[key]
        }
      })
      store.is_sync = true
    })
    if (await election.hasLeader()) {
      channel.postMessage()
    } else {
      await election.awaitLeadership()
      store.is_sync = true
    }
    store.$subscribe((mutation, state) => {
      if (!externalUpdate) {
        timestamp = Date.now()
        channel.postMessage({
          timestamp,
          state: serialize(state, keysToUpdate),
        })
      }
      externalUpdate = false
    })
  }
}

const piniaPlugin = defineNuxtPlugin((nuxtApp) => {
  const { $pinia } = nuxtApp
  if (!$pinia) {
    console.warn("Pinia instance not available; skipping shared state plugin.")
    return
  }
  $pinia.use(piniaSharedState())
})

console.log("PINIA PLUGIN")

export default piniaPlugin
