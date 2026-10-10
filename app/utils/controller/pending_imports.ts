// Local imports
import { ControllerError } from "@vease/utils/controller/errors";

// The back announces saved data on its own event stream, so an import runs outside the command queue
const imports = new Map<string, Promise<unknown>>();
const waiters = new Map<string, (imported: Promise<unknown>) => void>();

function trackImport(id: string, imported: Promise<unknown>): void {
  imports.set(id, imported);
  waiters.get(id)?.(imported);
  waiters.delete(id);
}

// oxlint-disable-next-line promise-function-async -- the promise is settled by trackImport, not by awaiting
function nextImport(id: string): Promise<unknown> {
  // oxlint-disable-next-line promise/avoid-new -- the promise is settled later by trackImport
  return new Promise((resolve) => {
    waiters.set(id, resolve);
  });
}

async function waitForImport(id: string, timeout: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined = undefined;
  // oxlint-disable-next-line promise/avoid-new -- the promise is settled later by the timer
  const expired = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new ControllerError(`Data "${id}" was not imported in time`));
    }, timeout);
  });
  try {
    await Promise.race([imports.get(id) ?? nextImport(id), expired]);
  } finally {
    clearTimeout(timer);
    imports.delete(id);
    waiters.delete(id);
  }
}

export { trackImport, waitForImport };
