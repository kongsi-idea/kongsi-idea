// class-code-client.js —— 各教学工具用来读取 kelasku 班级名单的共用小工具
// 使用方式：工具页面依序引入 supabase-client.js（先，负责连线）→ 这份档案，
// 再用 ClassCode.load() 拿名单，不用自己重新写 Supabase 查询逻辑。
//
// 网址参数一律用 ?code=，可以放一个或多个（逗号分隔），例如：
//   ?code=JH0042-1I                  单一班级
//   ?code=JH0042-1I,JH0042-2A        多班合并（完整代码）
//   ?code=JH0042-1I,2A               同校简写：没有 "-" 的那段自动沿用前一段的学校代码
//
// 没有 code 参数、或代码查无资料时，load() 回传空阵列，工具应该照旧走「手动输入名字」模式。

const ClassCode = (() => {
  function expand(rawParam) {
    if (!rawParam) return [];
    const tokens = rawParam.split(",").map((t) => t.trim()).filter(Boolean);
    const codes = [];
    let lastSchoolCode = null;
    for (const token of tokens) {
      const upper = token.toUpperCase();
      if (upper.includes("-")) {
        const [schoolCode] = upper.split("-");
        lastSchoolCode = schoolCode;
        codes.push(upper);
      } else if (lastSchoolCode) {
        codes.push(`${lastSchoolCode}-${upper}`);
      }
      // 没有 "-" 又没有前一段学校代码可沿用的孤立 token，直接忽略（格式不合法）
    }
    return codes;
  }

  function codesFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return expand(params.get("code"));
  }

  // 回传合并后的学生名单：
  //   [{ name, nameZh, nameEn, seatNo, className, schoolName, playCode }, ...]
  // name 是给旧工具用的显示名 fallback（优先中文名，没有就用英文名）；
  // 新工具想分语言显示，直接用 nameZh / nameEn。
  // 多个班级会依 codes 出现顺序合并，同代码/同名字不去重（同班不该重复输入，交给老师自己管理）。
  // 每班内部按座号排序（没座号的排最后）。
  async function load(rawParam) {
    const codes = rawParam !== undefined ? expand(rawParam) : codesFromUrl();
    if (codes.length === 0) return [];

    const { data: classes, error } = await supabaseClient
      .from("classes")
      .select("id, class_name, play_code, schools(full_name), students(name, name_zh, name_en, seat_no)")
      .in("play_code", codes);

    if (error || !classes) {
      console.error("ClassCode.load failed:", error);
      return [];
    }

    const roster = [];
    for (const cls of classes) {
      const students = (cls.students || []).slice().sort((a, b) => {
        if (a.seat_no == null && b.seat_no == null) return 0;
        if (a.seat_no == null) return 1;
        if (b.seat_no == null) return -1;
        return a.seat_no - b.seat_no;
      });
      for (const student of students) {
        const nameZh = student.name_zh || null;
        const nameEn = student.name_en || null;
        roster.push({
          name: nameZh || nameEn || student.name,
          nameZh,
          nameEn,
          seatNo: student.seat_no,
          className: cls.class_name,
          schoolName: cls.schools ? cls.schools.full_name : "",
          playCode: cls.play_code,
        });
      }
    }
    return roster;
  }

  return { expand, codesFromUrl, load };
})();
