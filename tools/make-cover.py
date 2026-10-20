"""Paint Murmur's album cover, assets/music/cover.jpg, with Vixl.

    PYTHONPATH=/path/to/Vixl/src python3 tools/make-cover.py
"""
import random
from pathlib import Path
from vixl import Project
S = 640
OUT = Path(__file__).resolve().parents[1] / "assets" / "music" / "cover.jpg"
rnd = random.Random(417)
p = Project(S, S, background="#eae6f6")
ops = []
washes = [("#9db8ec", .9, 300, 3), ("#e9a6c4", .85, 260, 3), ("#b9a7ea", .7, 200, 3), ("#f6cdb8", .5, 160, 2)]
for i, (color, alpha, size, n) in enumerate(washes):
    ops.append({"type": "paint-layer", "name": f"wash{i}"})
    for k in range(n):
        y = rnd.randint(80, S - 80)
        # Long horizontal strokes, like ripples on still water.
        pts = [[x, y + rnd.randint(-30, 30)] for x in range(-80, S + 120, 120)]
        ops.append({"type": "paint", "target": f"wash{i}", "brush": "watercolor", "points": pts,
                    "size": size, "color": color, "opacity": alpha, "seed": 417 + i * 11 + k})
p.apply(ops)
p.apply([{"type": "flatten", "name": "all"}])
p.apply([{"type": "watercolor", "target": "all", "amount": 50, "seed": 4},
         {"type": "blur", "target": "all", "amount": 3}])
p.export(str(OUT), quality=86, overwrite=True)
print(OUT)
