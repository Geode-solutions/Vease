// Local imports
import type { CommandContext } from "@vease/utils/controller/index";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";
import { waitForImport } from "@vease/utils/controller/pending_imports";

async function awaitData(params: unknown, context?: CommandContext): Promise<{ id: DataId }> {
  // oxlint-disable-next-line no-unsafe-type-assertion -- params are built by the load route
  const { id } = params as { id: DataId };
  const deadline = context?.deadline ?? Date.now();
  await waitForImport(id, deadline - Date.now());
  return { id };
}

export { awaitData };
