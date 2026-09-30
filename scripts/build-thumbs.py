#!/usr/bin/env python3
"""把 assets/thumbs/ 的原图（多半是 1440px 截图 PNG）转成首页用的轻量 WebP。

首页卡片只显示约 300px 宽，却下载原图——25 张封面加起来 8MB+，学校 Wi-Fi 要等十几秒。
这里统一缩到最长边 960px（卡片 2x 屏、详情弹窗都够清楚），输出到 assets/thumbs-web/，
路径与档名对应原图，只换副档名。原图保留给灯箱放大看。

新增或更换缩略图后跑一次：python3 scripts/build-thumbs.py
只会重做「原图比 webp 新」的档案；app.js 找不到 webp 时会自动退回原图，不会破图。
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "thumbs"
DST = ROOT / "assets" / "thumbs-web"
MAX_SIDE = 960
QUALITY = 80

total_in = total_out = made = 0
for src in sorted(SRC.rglob("*")):
    if src.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}:
        continue
    dst = (DST / src.relative_to(SRC)).with_suffix(".webp")
    total_in += src.stat().st_size
    if not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime:
        dst.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(src) as im:
            im = im.convert("RGBA") if im.mode in ("P", "LA") else im
            im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
            im.save(dst, "WEBP", quality=QUALITY, method=6)
        made += 1
    total_out += dst.stat().st_size

print(f"新产生 {made} 张；原图 {total_in / 1048576:.1f}MB → WebP {total_out / 1048576:.1f}MB")
