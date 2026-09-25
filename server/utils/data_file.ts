// Third party imports
import { CHUNK_SIZE_BYTES } from "@ogw_shared/utils/file";
import type { MultiPartData } from "h3";
import back_schemas from "@geode/opengeodeweb-back/opengeodeweb_back_schemas.json";
import { fetchRaw } from "@ogw_shared/utils/fetch_raw";
import { fetchSchema } from "@ogw_shared/utils/fetch_schema";
import { getBackBaseUrl } from "@ogw_server/utils/server_config";
import { resolveAllowedObjects } from "@ogw_shared/utils/response_handlers/load";

// Local imports

interface AllowedFilesResponse {
  extensions: string[];
}

interface AllowedObjectsResponse {
  allowed_objects: Parameters<typeof resolveAllowedObjects>[1][number];
}

function isAllowedFilesResponse(value: unknown): value is AllowedFilesResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "extensions" in value &&
    Array.isArray(value.extensions) &&
    value.extensions.every((extension) => typeof extension === "string")
  );
}

function isAllowedObjectsResponse(value: unknown): value is AllowedObjectsResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "allowed_objects" in value &&
    typeof value.allowed_objects === "object" &&
    value.allowed_objects !== null
  );
}

async function getAllowedFileExtensions(): Promise<string[]> {
  const backBaseUrl = getBackBaseUrl();
  console.log(`Fetching allowed file extensions from ${backBaseUrl}`);
  const schema = back_schemas.opengeodeweb_back.allowed_files;
  const response = await fetchSchema({
    schema,
    baseURL: backBaseUrl,
    headers: undefined,
    timeout: undefined,
  });
  if (!isAllowedFilesResponse(response)) {
    throw new Error(`${schema.$id}: unexpected response shape`);
  }
  return response.extensions;
}

async function getAllowedGeodeObjectTypes(filename: string): Promise<string | undefined> {
  const backBaseUrl = getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.allowed_objects;
  const params = { filename };
  const response = await fetchSchema({
    schema,
    params,
    baseURL: backBaseUrl,
    headers: undefined,
    timeout: undefined,
  });
  if (!isAllowedObjectsResponse(response)) {
    throw new Error(`${schema.$id}: unexpected response shape`);
  }
  const { selectedGeodeObject } = resolveAllowedObjects([filename], [response.allowed_objects]);
  return selectedGeodeObject === "" ? undefined : selectedGeodeObject;
}

async function uploadFile(file: MultiPartData): Promise<unknown> {
  const backBaseUrl = getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.upload_file;
  const { filename, type, data } = file;
  console.log(`Received file: ${filename}, type: ${type}, size: ${data.length} bytes`);

  const safeFilename = encodeURIComponent(filename ?? "");
  const method = schema.methods.find((candidate) => candidate !== "OPTIONS");
  const totalChunks = Math.max(1, Math.ceil(data.length / CHUNK_SIZE_BYTES));

  let response: unknown = undefined;
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
    const start = chunkIndex * CHUNK_SIZE_BYTES;
    const chunk = data.subarray(start, start + CHUNK_SIZE_BYTES);
    const route =
      `${schema.$id}?filename=${safeFilename}` +
      `&chunk_index=${chunkIndex}&total_chunks=${totalChunks}`;
    const params = new Blob([new Uint8Array(chunk)], { type });

    // oxlint-disable-next-line no-await-in-loop
    response = await fetchRaw({
      route,
      method,
      params,
      baseURL: backBaseUrl,
      headers: undefined,
      max_retry: undefined,
      timeout: undefined,
    });
  }

  return response;
}

async function saveViewableFile(filename: string, geode_object_type: string): Promise<unknown> {
  const backBaseUrl = getBackBaseUrl();
  const schema = back_schemas.opengeodeweb_back.save_viewable_file;
  const params = { filename, geode_object_type };
  const response = await fetchSchema({
    schema,
    params,
    baseURL: backBaseUrl,
    expectEvent: true,
    headers: undefined,
    timeout: undefined,
  });
  return response;
}

export { getAllowedFileExtensions, getAllowedGeodeObjectTypes, uploadFile, saveViewableFile };
