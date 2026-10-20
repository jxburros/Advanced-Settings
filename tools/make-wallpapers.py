"""Regenerate the watercolor wallpapers in assets/wallpapers with Vixl.

    PYTHONPATH=/path/to/Vixl/src python3 tools/make-wallpapers.py [stillwater dusk shallows]
"""
import random, sys
from pathlib import Path
from vixl import Project
W, H = 1920, 1200
OUT = Path(__file__).resolve().parents[1] / "assets" / "wallpapers"
def make(name, bg, washes, seed):
    rnd = random.Random(seed)
    p = Project(W, H, background=bg)
    ops = []
    for i, (color, alpha, size, n) in enumerate(washes):
        ops.append({"type": "paint-layer", "name": f"wash{i}"})
        for k in range(n):
            cx, cy = rnd.randint(0, W), rnd.randint(0, H)
            ang = rnd.uniform(-0.5, 0.5)
            pts = []
            for t in range(-3, 4):
                d = t * rnd.randint(180, 260)
                pts.append([cx + d, cy + d * ang + rnd.randint(-140, 140)])
            ops.append({"type": "paint", "target": f"wash{i}", "brush": "watercolor", "points": pts,
                        "size": size, "color": color, "opacity": alpha, "seed": seed * 31 + i * 7 + k})
    p.apply(ops)
    p.apply([{"type": "flatten", "name": "all"}])
    p.apply([{"type": "watercolor", "target": "all", "amount": 55, "seed": seed},
             {"type": "blur", "target": "all", "amount": 5}])
    p.export(str(OUT / f"{name}.jpg"), quality=86, overwrite=True)

cfg = {
 "stillwater": ("#f5f2f7", [("#bcd4f2", .9, 560, 3), ("#f4c4d6", .85, 460, 3), ("#8db6e8", .7, 300, 3),
                ("#eba3be", .6, 240, 3), ("#d9cff0", .7, 380, 2), ("#fbe1cf", .55, 260, 2)], 4),
 "dusk": ("#ece6f3", [("#b9c0ec", .9, 560, 3), ("#e6b3cf", .85, 460, 3), ("#7f9ddb", .65, 300, 3),
                ("#df93b6", .6, 230, 3), ("#f2d2c2", .55, 300, 2)], 11),
 "shallows": ("#eef5f6", [("#b6dbe8", .9, 560, 3), ("#cfe0f6", .85, 440, 3), ("#86bcd8", .65, 300, 3),
                ("#f1c3d3", .6, 260, 3), ("#cfeadb", .55, 300, 2)], 23),
}
for n in sys.argv[1:] or cfg:
    make(n, *cfg[n])
