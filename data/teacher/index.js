// 有老师后台的工具登记表（teacher.html?tool={slug} 靠它认工具；Hub 首页靠它显示「老师后台」链接）。
// 新工具要后台 = 在这里加 slug，再加一份 data/teacher/{slug}.js 设定（照抄同类工具的设定改表名、题库网址即可）。
const TEACHER_TOOLS = ["tahun1-bc-fuxi-oktober", "tahun1-bc-fuxi-oktober-2", "tahun1-mt-latihan-oktober", "tahun2-mt-latihan-oktober", "tahun2-mt-fuxi-oktober", "tahun1-mt-fuxi-oktober", "tahun1-mt-fuxi-pecahan-masa"];
// 各工具设定的注册处：每份 data/teacher/{slug}.js 用 TEACHER_CONFIGS[slug] = {...} 登记。
var TEACHER_CONFIGS = window.TEACHER_CONFIGS = window.TEACHER_CONFIGS || {};
