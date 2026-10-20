/* A pack's optional program. The game imports this module and calls the default export with a
   small API: addApp(id, { title, glyph, tone, size, render }), notify(text), esc(text), version.
   render() returns HTML and is called whenever the window redraws; escape anything dynamic. */
export default function install(api) {
  let opened = 0;
  api.addApp("hello", {
    title: "Example",
    tone: "mint",
    size: [420, 300],
    glyph: '<circle cx="12" cy="12" r="8"/><path d="M8.5 13.5a4 4 0 0 0 7 0"/>',
    render: () => `<div class="pane"><h2>Hello from a DLC pack.</h2><p class="lede">Rendered ${++opened} time${opened === 1 ? "" : "s"} on Advanced Settings ${api.esc(api.version)}.</p></div>`,
  });
}
