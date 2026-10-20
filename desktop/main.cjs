/* The Windows (desktop) edition: the same game, served from an app:// origin so modules, fetch
   and saves work as they do on the web. Adds real updates (electron-updater, from GitHub
   Releases) and installs DLC packs listed in the official catalog. */
const { app, BrowserWindow, ipcMain, net, protocol, shell } = require("electron");
const path = require("node:path");
const fs = require("node:fs");
const { pathToFileURL } = require("node:url");
const AdmZip = require("adm-zip");
const { autoUpdater } = require("electron-updater");
const D = require("./dlc.cjs");

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true } }]);
if (!app.requestSingleInstanceLock()) app.quit();

const GAME = app.getAppPath();
// For trying the DLC flow from source: STILLWATER_DLC_BASE=http://127.0.0.1:8000/dist/ serves
// catalog.json and packs locally. Installed builds always use the official catalog.
const DEV_BASE = !app.isPackaged && /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//.test(process.env.STILLWATER_DLC_BASE ?? "") ? process.env.STILLWATER_DLC_BASE : null;
const DLC = path.join(app.getPath("userData"), "dlc");
let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    title: "Advanced Settings",
    backgroundColor: "#eef0f8",
    autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, "preload.cjs"), contextIsolation: true, sandbox: true, nodeIntegration: false },
  });
  win.removeMenu();
  // Links to GitHub and elsewhere open in the real browser; the game never navigates away.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://")) shell.openExternal(url);
    return { action: "deny" };
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (!url.startsWith("app://game/")) e.preventDefault();
  });
  win.loadURL("app://game/index.html");
}

function serve() {
  protocol.handle("app", (req) => {
    // Installed DLC is served from the game's own origin, under /__dlc/, so packs can load
    // modules and media without cross-origin trouble.
    const url = new URL(req.url);
    const rel = decodeURIComponent(url.pathname).replace(/^\/+/, "");
    const dlc = rel.startsWith("__dlc/");
    const file = url.host === "game" ? D.safeJoin(dlc ? DLC : GAME, dlc ? rel.slice(6) : rel) : null;
    if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return new Response("Not found", { status: 404 });
    return net.fetch(pathToFileURL(file).toString());
  });
}

/* ---------- updates ---------- */
let update = { state: app.isPackaged ? "idle" : "dev" };
function send(next) {
  update = next;
  win?.webContents.send("update:state", update);
}
const notes = (n) =>
  (Array.isArray(n) ? n.map((x) => x.note).join("\n\n") : String(n ?? ""))
    .replace(/<\/(p|li|h\d)>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim()
    .slice(0, 4000);
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;
autoUpdater.on("checking-for-update", () => send({ state: "checking" }));
autoUpdater.on("update-available", (i) => send({ state: "available", version: i.version, notes: notes(i.releaseNotes) }));
autoUpdater.on("update-not-available", (i) => send({ state: "current", version: i.version }));
autoUpdater.on("download-progress", (p) => send({ ...update, state: "downloading", percent: Math.round(p.percent) }));
autoUpdater.on("update-downloaded", (i) => send({ ...update, state: "ready", version: i.version }));
autoUpdater.on("error", (e) => send({ state: "error", error: String(e?.message ?? e).split("\n")[0].slice(0, 300) }));
ipcMain.handle("update:get", () => update);
ipcMain.handle("update:check", () => {
  if (!app.isPackaged) return send({ state: "dev" });
  autoUpdater.checkForUpdates().catch(() => {});
});
ipcMain.handle("update:download", () => {
  if (update.state === "available") autoUpdater.downloadUpdate().catch(() => {});
});
ipcMain.handle("update:install", () => {
  if (update.state === "ready") setImmediate(() => autoUpdater.quitAndInstall());
});

/* ---------- DLC ---------- */
let catalog = [];
ipcMain.handle("dlc:catalog", async () => {
  const res = await net.fetch(DEV_BASE ? DEV_BASE + "catalog.json" : D.CATALOG_URL, { cache: "no-cache" });
  if (!res.ok) throw Error(`The DLC catalog is unavailable (${res.status}).`);
  catalog = D.validCatalog(await res.json(), DEV_BASE ?? D.DOWNLOADS);
  return catalog;
});
ipcMain.handle("dlc:installed", () => D.installed(DLC));
ipcMain.handle("dlc:install", async (e, id) => {
  const entry = catalog.find((x) => x.id === id);
  if (!entry) throw Error("That pack isn’t in the catalog.");
  if (entry.minGame && D.compare(app.getVersion(), entry.minGame) < 0) throw Error(`This pack needs Advanced Settings ${entry.minGame} or newer. Update the game first.`);
  const res = await net.fetch(entry.url);
  if (!res.ok) throw Error(`Download failed (${res.status}).`);
  const reader = res.body.getReader();
  const chunks = [];
  let got = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    got += value.length;
    if (got > D.MAX_PACK) throw Error("The download is larger than the catalog says.");
    chunks.push(Buffer.from(value));
    win?.webContents.send("dlc:progress", { id, percent: Math.min(100, Math.round((got / entry.size) * 100)) });
  }
  const buf = Buffer.concat(chunks);
  if (D.sha256(buf) !== entry.sha256) throw Error("The download doesn’t match the catalog’s checksum, so it wasn’t installed.");
  const zip = new AdmZip(buf);
  const entries = zip.getEntries().map((z) => ({ name: z.entryName, dir: z.isDirectory, data: z.isDirectory ? Buffer.alloc(0) : z.getData() }));
  const dest = D.safeJoin(DLC, id);
  if (!dest) throw Error("Bad pack id.");
  return D.extract(entries, dest, id);
});
ipcMain.handle("dlc:remove", (e, id) => {
  const dest = D.ID.test(id) && D.safeJoin(DLC, id);
  if (!dest) return false;
  fs.rmSync(dest, { recursive: true, force: true });
  return true;
});

app.on("second-instance", () => {
  if (win) win.isMinimized() ? win.restore() : win.focus();
});
app.whenReady().then(() => {
  serve();
  createWindow();
});
app.on("window-all-closed", () => app.quit());
