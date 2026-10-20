/* Software Update and DLC for the page. In the Windows edition everything goes through the
   desktop app (window.stillwater), which downloads and installs. On the web the game can only
   look: it checks GitHub for a newer release and lists the DLC catalog. */
import { VERSION, REPO } from "./version.js";
export { VERSION, REPO };
export const desktop = typeof window !== "undefined" && window.stillwater?.desktop ? window.stillwater : null;
const CATALOG = `https://raw.githubusercontent.com/${REPO}/main/dlc/catalog.json`;
export function compare(a, b) {
  const x = String(a).split(".").map(Number), y = String(b).split(".").map(Number);
  for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0) ? 1 : -1;
  return 0;
}
export const state = {
  update: { state: "idle" },
  dlc: { catalog: null, installed: [], busy: "", percent: 0, error: "" },
};
let onChange = () => {};
export function onUpdates(fn) {
  onChange = fn;
}
if (desktop) {
  desktop.update.onState((u) => {
    state.update = u;
    onChange("update");
  });
  desktop.update.get().then((u) => ((state.update = u), onChange("update")));
  desktop.dlc.onProgress((p) => {
    state.dlc.percent = p.percent;
    onChange("dlc");
  });
}

export async function checkForUpdate() {
  if (desktop) return desktop.update.check();
  state.update = { state: "checking" };
  onChange("update");
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: "application/vnd.github+json" } });
    if (res.status === 404) state.update = { state: "current", version: VERSION };
    else if (!res.ok) throw Error(String(res.status));
    else {
      const r = await res.json();
      const version = String(r.tag_name || "").replace(/^v/, "");
      const exe = (r.assets || []).find((a) => /\.exe$/i.test(a.name));
      const web = (r.assets || []).find((a) => /web.*\.zip$/i.test(a.name));
      state.update =
        compare(version, VERSION) > 0
          ? { state: "available", version, notes: String(r.body || "").slice(0, 4000), page: r.html_url, installer: exe?.browser_download_url, web: web?.browser_download_url }
          : { state: "current", version };
    }
  } catch {
    state.update = { state: "error", error: "GitHub couldn’t be reached. Check your connection and try again." };
  }
  onChange("update");
}
export const downloadUpdate = () => desktop?.update.download();
export const installUpdate = () => desktop?.update.install();

export async function loadCatalog() {
  state.dlc.error = "";
  try {
    if (desktop) state.dlc.catalog = await desktop.dlc.catalog();
    else {
      const res = await fetch(CATALOG, { cache: "no-cache" });
      if (!res.ok) throw Error(String(res.status));
      const list = await res.json();
      state.dlc.catalog = Array.isArray(list) ? list.filter((e) => e && typeof e.id === "string" && typeof e.name === "string").slice(0, 200) : [];
    }
  } catch (e) {
    state.dlc.catalog = state.dlc.catalog ?? [];
    state.dlc.error = "The DLC catalog couldn’t be loaded. " + (desktop ? String(e?.message ?? "") : "Check your connection.");
  }
  onChange("dlc");
}
/* Installed packs, each with `base`: the URL its files are served from. On the web, packs can
   be previewed from dlc/packs/<id>/ by adding ?dlc=<id> to the address. */
export async function installedPacks() {
  try {
    if (desktop) {
      state.dlc.installed = (await desktop.dlc.installed()).map((m) => ({ ...m, base: `./__dlc/${m.id}/` }));
    } else {
      const ids = (new URLSearchParams(location.search).get("dlc") || "").split(",").filter((x) => /^[a-z0-9][a-z0-9-]{0,39}$/.test(x));
      const out = [];
      for (const id of ids) {
        const res = await fetch(`dlc/packs/${id}/manifest.json`);
        if (res.ok) out.push({ ...(await res.json()), base: `./dlc/packs/${id}/`, preview: true });
      }
      state.dlc.installed = out.filter((m) => typeof m.id === "string" && typeof m.name === "string");
    }
  } catch {
    state.dlc.installed = [];
  }
  return state.dlc.installed;
}
async function busy(id, fn) {
  state.dlc.busy = id;
  state.dlc.percent = 0;
  state.dlc.error = "";
  onChange("dlc");
  try {
    await fn();
    await installedPacks();
  } catch (e) {
    state.dlc.error = String(e?.message ?? e).replace(/^Error invoking remote method '[^']+': (Error: )?/, "");
  }
  state.dlc.busy = "";
  onChange("dlc-installed");
}
export const installDlc = (id) => desktop && busy(id, () => desktop.dlc.install(id));
export const removeDlc = (id) => desktop && busy(id, () => desktop.dlc.remove(id));
