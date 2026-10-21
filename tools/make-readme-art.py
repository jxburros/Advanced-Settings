"""Paint the Stillwater marketing art used in README.md (docs/art/*.png) with Vixl.

    PYTHONPATH=/path/to/Vixl/src python3 tools/make-readme-art.py [banner badge hearth notice]
"""
import random, sys
from pathlib import Path
from vixl import Project
OUT = Path(__file__).resolve().parents[1] / "docs" / "art"
OUT.mkdir(exist_ok=True)
INK, MUTED, BLUE, PINK = "#2b2f55", "#5d6390", "#5b7fd6", "#d9779f"


def washes(w, h, bg, spec, seed):
    """A watercolor field, as in tools/make-wallpapers.py."""
    rnd = random.Random(seed)
    p = Project(w, h, background=bg)
    ops = []
    for i, (color, alpha, size, n) in enumerate(spec):
        ops.append({"type": "paint-layer", "name": f"wash{i}"})
        for k in range(n):
            cx, cy = rnd.randint(0, w), rnd.randint(0, h)
            ang = rnd.uniform(-0.4, 0.4)
            pts = [[cx + d, cy + d * ang + rnd.randint(-70, 70)]
                   for d in (t * rnd.randint(120, 200) for t in range(-3, 4))]
            ops.append({"type": "paint", "target": f"wash{i}", "brush": "watercolor", "points": pts,
                        "size": size, "color": color, "opacity": alpha, "seed": seed * 31 + i * 7 + k})
    p.apply(ops)
    p.apply([{"type": "flatten", "name": "field"}])
    p.apply([{"type": "watercolor", "target": "field", "amount": 55, "seed": seed},
             {"type": "blur", "target": "field", "amount": 4}])
    return p


def text(name, s, size, color=INK, x="center", y=0, **kw):
    if "within" in kw:
        x = y = None
    x = int(x) if isinstance(x, str) and x.isdigit() else x
    op = {"type": "text", "name": name, "text": s, "size": size, "color": color, "x": x, "y": y, **kw}
    return {k: v for k, v in op.items() if v is not None}


def card(p, x, y, w, h, radius=36, opacity=.62):
    p.apply([{"type": "shape", "name": "card", "shape": "rounded-rectangle", "x": x, "y": y, "width": w, "height": h,
              "radius": radius, "fill": "#ffffff", "opacity": opacity}])


def banner():
    p = washes(1600, 520, "#f5f2f7", [("#bcd4f2", .9, 420, 3), ("#f4c4d6", .85, 360, 3), ("#8db6e8", .7, 240, 3),
                                      ("#eba3be", .6, 200, 2), ("#d9cff0", .7, 300, 2)], 8)
    card(p, 90, 70, 1420, 380, 56, .55)
    p.apply([
        {"type": "shape", "name": "drop", "shape": "teardrop", "x": 150, "y": 140, "width": 170, "height": 170, "rotation": -45,
         "fill_gradient": {"start": "#9db8ec", "end": BLUE, "direction": "angled", "angle": 90}},
        text("kicker", "STILLWATER SYSTEMS  ·  PRESS KIT  ·  FOR IMMEDIATE RELEASE", 22, MUTED, "380", 128, tracking=3),
        text("title", "Stillwater OS", 120, INK, "380", 182, font="heading"),
        text("tag", "Advanced Settings. For people who like things calm.", 38, MUTED, "384", 318),
        text("fine", "*Calm Index may vary. It does vary. Please do not look at it.", 22, "#8a8fb3", "384", 384),
    ])
    p.export(str(OUT / "banner.png"), overwrite=True)


def badge():
    p = washes(560, 560, "#f5f2f7", [("#bcd4f2", .9, 300, 2), ("#f4c4d6", .85, 260, 2), ("#d9cff0", .7, 200, 2)], 21)
    p.apply([
        {"type": "shape", "name": "seal", "shape": "seal", "x": 40, "y": 40, "width": 480, "height": 480,
         "fill": "#ffffff", "opacity": .85, "stroke": BLUE, "stroke_width": 6},
        {"type": "shape", "name": "ring", "shape": "ring", "x": 90, "y": 90, "width": 380, "height": 380,
         "fill": "#e4ebfa", "opacity": .9},
        text("a", "STILLWATER ASSURE™", 26, MUTED, "center", 140, tracking=3),
        text("b", "CERTIFIED", 56, INK, "center", 190, font="heading"),
        text("c", "CALM*", 96, BLUE, "center", 240, font="heading"),
        text("d", "Calm Index: 99%", 30, INK, "center", 350),
        text("e", "*as of this morning", 22, "#8a8fb3", "center", 395),
    ])
    p.export(str(OUT / "badge.png"), overwrite=True)


def hearth():
    p = washes(1400, 480, "#f6eee9", [("#f6cdb8", .9, 380, 3), ("#f4c4d6", .85, 320, 3), ("#fbe1cf", .7, 260, 3),
                                      ("#d9cff0", .5, 200, 2)], 33)
    card(p, 70, 60, 1260, 360, 56, .5)
    p.apply([
        {"type": "shape", "name": "dial", "shape": "ring", "x": 130, "y": 110, "width": 260, "height": 260,
         "fill": "#e9a6b6", "opacity": .95},
        {"type": "shape", "name": "dialcore", "shape": "ellipse", "x": 175, "y": 155, "width": 170, "height": 170,
         "fill_gradient": {"start": "#fbe1cf", "end": "#e5819f", "direction": "radial"}},
        {"type": "shape", "name": "tick", "shape": "rounded-rectangle", "x": 253, "y": 128, "width": 14, "height": 54,
         "radius": 7, "fill": INK},
        text("kicker", "NEW  ·  CONSUMER PILOTS", 22, "#a35a76", "460", 112, tracking=3),
        text("title", "Stillwater Hearth™", 78, INK, "460", 150, font="heading"),
        text("tag", "One dial. Zero feelings. Ideal for the whole family.", 34, MUTED, "464", 262),
        text("fine", "Hearth is not a heater. Please do not hold the dial. Please stop holding the dial.", 21, "#8a8fb3", "464", 330),
    ])
    p.export(str(OUT / "hearth.png"), overwrite=True)


def notice():
    p = washes(1400, 300, "#eef5f6", [("#b6dbe8", .9, 300, 3), ("#cfe0f6", .85, 260, 3), ("#cfeadb", .6, 200, 2)], 44)
    card(p, 60, 40, 1280, 220, 44, .55)
    p.apply([
        {"type": "shape", "name": "burst", "shape": "starburst", "x": 100, "y": 70, "width": 160, "height": 160,
         "fill": "#f1c3d3", "opacity": .95, "stroke": INK, "stroke_width": 4},
        text("q", "!", 100, INK, within="burst", font="heading"),
        text("kicker", "FACILITIES NOTICE  ·  BREAK ROOM  ·  WEEKLY", 20, MUTED, "310", 84, tracking=3),
        text("title", "There is no duck.", 70, INK, "310", 118, font="heading"),
        text("fine", "Reports of a duck are unfounded and have been forwarded to the duck.", 26, MUTED, "314", 204),
    ])
    p.export(str(OUT / "notice.png"), overwrite=True)


ALL = {"banner": banner, "badge": badge, "hearth": hearth, "notice": notice}
for n in sys.argv[1:] or ALL:
    ALL[n]()
