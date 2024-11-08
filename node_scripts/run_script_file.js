const { spawn } = require("node:child_process");

console.log("process.argv", process.argv);

var script_name = process.argv[2]
console.log("script_name", script_name);

var child;
if (process.platform === "win32") {
  child = spawn("powershell.exe", [`./electron-server/${script_name}.ps1`, process.argv[3]]);
} else if (process.platform === "linux") {
  child = spawn(`./electron-server/${script_name}.sh`, [process.argv[3]]);
}

child.stdout.on("data", function (data) {
  console.log("" + data);
});
child.stderr.on("data", function (data) {
  console.log("" + data);
});
child.on("exit", function () {
  console.log("Exit script");
});
child.stdin.end(); //end input
