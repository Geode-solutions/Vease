const { app, BrowserWindow } = require("electron");

app.whenReady().then(() => {
  const win = new BrowserWindow({
    title: "Pragmatic",
    icon: "logo_color.svg",
    center: true,
  });
  win.removeMenu();

  // if (process.env.VITE_DEV_SERVER_URL) {
  win.loadURL(process.env.VITE_DEV_SERVER_URL);
  win.webContents.openDevTools();
  // } else {
  //   win.loadFile("index.html");
  // }
});
