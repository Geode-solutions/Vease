const { spawn } = require('node:child_process')

var child
if (process.platform === "win32"){
    child = spawn("powershell.exe", ["electron-server/install_back.ps1"]);
} else if (process.platform === "linux"){
    child = spawn("./electron-server/install_back.sh", []);
}

child.stdout.on("data",function(data){
    console.log("Data: " + data);
});
child.stderr.on("data",function(data){
    console.log("error:  " + data);
});
child.on("exit",function(){
    console.log("Exit script");
});
child.stdin.end(); //end input