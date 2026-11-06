// Local imports
import { ControllerError } from "@vease/utils/controller/errors";
import type { DataId } from "@ogw_front/types/identifiers";

type ImportWaiter = (imported: Promise<unknown>) => void;

// The load route asks for the import right after saving it: a settled import is kept that long, then forgotten
const SETTLED_IMPORT_RETENTION_MS = 120_000;

// The back announces saved data on its own event stream, so an import runs outside the command queue
const imports = new Map<string, Promise<unknown>>();
const waiters = new Map<string, Set<ImportWaiter>>();

async function forgetWhenSettled(dataId: DataId, imported: Promise<unknown>): Promise<void> {
  await Promise.allSettled([imported]);
  setTimeout(() => {
    if (imports.get(dataId) === imported) {
      imports.delete(dataId);
    }
  }, SETTLED_IMPORT_RETENTION_MS);
}

function trackImport(dataId: DataId, imported: Promise<unknown>): void {
  imports.set(dataId, imported);
  for (const waiter of waiters.get(dataId) ?? []) {
    waiter(imported);
  }
  waiters.delete(dataId);
  void forgetWhenSettled(dataId, imported);
}

function nextImport(dataId: DataId): { imported: Promise<unknown>; cancel: () => void } {
  const { promise: imported, resolve: waiter } = Promise.withResolvers<unknown>();
  const idWaiters = waiters.get(dataId) ?? new Set<ImportWaiter>();
  idWaiters.add(waiter);
  waiters.set(dataId, idWaiters);
  function cancel(): void {
    idWaiters.delete(waiter);
    if (idWaiters.size === 0 && waiters.get(dataId) === idWaiters) {
      waiters.delete(dataId);
    }
  }
  return { imported, cancel };
}

async function waitForImport(dataId: DataId, timeout: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined = undefined;
  // oxlint-disable-next-line promise/avoid-new -- the promise is settled later by the timer
  const expired = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new ControllerError(`Data "${dataId}" was not imported in time`));
    }, timeout);
  });
  const tracked = imports.get(dataId);
  let next: ReturnType<typeof nextImport> | undefined = undefined;
  if (tracked === undefined) {
    next = nextImport(dataId);
  }
  try {
    await Promise.race([tracked ?? next?.imported, expired]);
  } finally {
    clearTimeout(timer);
    next?.cancel();
  }
}

export { trackImport, waitForImport };
