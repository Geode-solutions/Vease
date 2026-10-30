// Local imports
import { ControllerError } from "@vease/utils/controller/errors";

type ImportWaiter = (imported: Promise<unknown>) => void;

// The load route asks for the import right after saving it: a settled import is kept that long, then forgotten
const SETTLED_IMPORT_RETENTION_MS = 120_000;

// The back announces saved data on its own event stream, so an import runs outside the command queue
const imports = new Map<string, Promise<unknown>>();
const waiters = new Map<string, Set<ImportWaiter>>();

async function forgetWhenSettled(id: string, imported: Promise<unknown>): Promise<void> {
  await Promise.allSettled([imported]);
  setTimeout(() => {
    if (imports.get(id) === imported) {
      imports.delete(id);
    }
  }, SETTLED_IMPORT_RETENTION_MS);
}

function trackImport(id: string, imported: Promise<unknown>): void {
  imports.set(id, imported);
  for (const waiter of waiters.get(id) ?? []) {
    waiter(imported);
  }
  waiters.delete(id);
  void forgetWhenSettled(id, imported);
}

function nextImport(id: string): { imported: Promise<unknown>; cancel: () => void } {
  const { promise: imported, resolve: waiter } = Promise.withResolvers<unknown>();
  const idWaiters = waiters.get(id) ?? new Set<ImportWaiter>();
  idWaiters.add(waiter);
  waiters.set(id, idWaiters);
  function cancel(): void {
    idWaiters.delete(waiter);
    if (idWaiters.size === 0 && waiters.get(id) === idWaiters) {
      waiters.delete(id);
    }
  }
  return { imported, cancel };
}

async function waitForImport(id: string, timeout: number): Promise<void> {
  let timer: ReturnType<typeof setTimeout> | undefined = undefined;
  // oxlint-disable-next-line promise/avoid-new -- the promise is settled later by the timer
  const expired = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(new ControllerError(`Data "${id}" was not imported in time`));
    }, timeout);
  });
  const tracked = imports.get(id);
  const next = tracked === undefined ? nextImport(id) : undefined;
  try {
    await Promise.race([tracked ?? next?.imported, expired]);
  } finally {
    clearTimeout(timer);
    next?.cancel();
  }
}

export { trackImport, waitForImport };
