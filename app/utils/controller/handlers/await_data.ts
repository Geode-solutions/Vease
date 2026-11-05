// Local imports
import type { CommandContext } from "@vease/utils/controller/index";
import { waitForImport } from "@vease/utils/controller/pending_imports";

async function awaitData(params: unknown, context?: CommandContext): Promise<{ id: string }> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are built by the load route
  const { id } = params as { id: string };
  const deadline = context?.deadline ?? Date.now();
  await waitForImport(id, deadline - Date.now());
  return { id };
}

export { awaitData };
