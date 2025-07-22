const { exec } = require("child_process");

function execRun(cmd) {
  return new Promise((resolve, reject) => {
    const child = exec(cmd, (error, stdout) => {
      if (error) {
        if (error.code === 1) {
          resolve(stdout);
        } else {
          reject(error);
        }
      } else {
        resolve(stdout);
      }
    });

    child.stdout.on("data", function (data) {
      console.log(data);
    });
    child.stderr.on("data", function (data) {
      console.log(data);
    });
    child.on("exit", function () {
      console.log("Exit script");
    });
    child.stdin.end();
  });
}

console.log("process.argv", process.argv);

var script_name = process.argv[2];
console.log("script_name", script_name);

var command;
if (process.platform === "win32") {
  command =
    `powershell.exe ./electron-server/${script_name}.ps1 ` + process.argv[3];
} else if (process.platform === "linux") {
  command = `bash ./electron-server/${script_name}.sh ` + process.argv[3];
}
execRun(command);
