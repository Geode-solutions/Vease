import { exec } from "node:child_process"
import { promisify } from "node:util"

const execAsync = promisify(exec)

async function execRun(cmd) {
  const promise = execAsync(cmd)
  const { child } = promise

  child.stdout.on("data", (data) => {
    console.log(data)
  })
  child.stderr.on("data", (data) => {
    console.log(data)
  })
  child.on("exit", () => {
    console.log("Exit script")
  })
  child.stdin.end()

  try {
    const { stdout } = await promise
    return stdout
  } catch (error) {
    if (error.code === 1) {
      return error.stdout
    }
    throw error
  }
}

console.log("process.argv", process.argv)

const args = process.argv.slice(2)
const [script_name, last_arg] = args
const command =
  process.platform === "win32"
    ? `powershell.exe ./microservices/${script_name}.ps1 ${last_arg}`
    : `bash ./microservices/${script_name}.sh ${last_arg}`

execRun(command)
