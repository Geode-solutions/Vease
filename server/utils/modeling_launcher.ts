// Node imports
import child_process from "node:child_process";
import path from "node:path";

// Third party imports
import { getAvailablePort } from "@ogw_server/utils/scripts";

const VEASE_MODELING_DIR_NAME = "Vease-Modeling";
const LISTENING_LOG_PATTERN = /^Listening on https?:\/\/.+:\d+\/?\s*$/mu;

function veaseModelingDir(nuxtRootPath: string): string {
  return path.resolve(nuxtRootPath, "..", VEASE_MODELING_DIR_NAME);
}

async function waitUntilListening(child: child_process.ChildProcessWithoutNullStreams): Promise<void> {
  child.stderr.on("data", (data: Buffer) => {
    console.log("[vease-modeling] STDERR:", data.toString().trim());
  });
  child.on("close", (code) => {
    console.log(`[vease-modeling] process closed with code ${code}`);
  });
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  for await (const chunk of child.stdout) {
    const output = String(chunk);
    console.log("[vease-modeling] STDOUT:", output.trim());
    if (LISTENING_LOG_PATTERN.test(output)) {
      child.stdout.on("data", (data: Buffer) => {
        console.log("[vease-modeling] STDOUT:", data.toString().trim());
      });
      return;
    }
  }
  throw new Error("vease-modeling process closed before listening");
}

export async function runVeaseModeling(nuxtRootPath: string): Promise<number> {
  const port = await getAvailablePort();
  const child = child_process.spawn("npm", ["run", "nuxt:preview"], {
    cwd: veaseModelingDir(nuxtRootPath),
    shell: true,
    env: {
      ...process.env,
      PORT: String(port),
    },
  });
  await waitUntilListening(child);
  return port;
}
