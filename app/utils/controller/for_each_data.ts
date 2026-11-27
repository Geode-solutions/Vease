// Local imports
import { ControllerError, errorMessage } from "@vease/utils/controller/errors";
import type { Index, Message } from "@ogw_front/types/ui";
import type { DataId } from "@geode/opengeodeweb-microservice/schema_types";

interface FailedData {
  id: DataId;
  error: Message;
}

interface EachDataResult<Result> {
  ids: DataId[];
  results: Result[];
  failed: FailedData[];
}

// One failing data must not undo the others: report it and keep going; fail only when none succeeded
async function forEachData<Result>(
  ids: DataId[],
  apply: (dataId: DataId, index: Index) => Promise<Result>,
): Promise<EachDataResult<Result>> {
  const settled = await Promise.allSettled(
    ids.map(async (dataId, index) => {
      const result = await apply(dataId, index);
      return result;
    }),
  );
  const done: { id: DataId; result: Result }[] = [];
  const failed: FailedData[] = [];
  for (const [index, outcome] of settled.entries()) {
    const dataId = ids[index] ?? "";
    if (outcome.status === "fulfilled") {
      done.push({ id: dataId, result: outcome.value });
    } else {
      failed.push({ id: dataId, error: errorMessage(outcome.reason) });
    }
  }
  if (done.length === 0) {
    throw new ControllerError([...new Set(failed.map(({ error }) => error))].join("; "));
  }
  return { ids: done.map(({ id }) => id), results: done.map(({ result }) => result), failed };
}

function withFailed<Response extends object>(
  response: Response,
  failed: FailedData[],
): Response & { failed?: FailedData[] } {
  if (failed.length === 0) {
    return response;
  }
  return { ...response, failed };
}

export { type FailedData, forEachData, withFailed };
