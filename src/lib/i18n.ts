export type Locale = "ja" | "en" | "zh" | "ko";

export const LOCALES: { code: Locale; label: string }[] = [
  { code: "ja", label: "日本語" },
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
  { code: "ko", label: "한국어" },
];

type Translations = Record<string, Record<Locale, string>>;

const translations: Translations = {
  // App
  "app.name":    { ja: "ENSO TASK", en: "ENSO TASK", zh: "ENSO TASK", ko: "ENSO TASK" },
  "app.tagline": { ja: "目標を、行動に変える", en: "Turn goals into action", zh: "将目标转化为行动", ko: "목표를 행동으로" },
  "app.description": { ja: "ENSOの目標からタスクを生成し、完了を記録するアプリ", en: "Generate tasks from ENSO goals and track completions", zh: "从ENSO目标生成任务并记录完成", ko: "ENSO 목표에서 작업을 생성하고 완료를 기록" },
  "app.credit":  { ja: "by CreativeStudio SHOTO.", en: "by CreativeStudio SHOTO.", zh: "by CreativeStudio SHOTO.", ko: "by CreativeStudio SHOTO." },

  // Tabs
  "tabs.tasks":    { ja: "タスク",     en: "Tasks",    zh: "任务",   ko: "작업" },
  "tabs.goals":    { ja: "目標",       en: "Goals",    zh: "目标",   ko: "목표" },
  "tabs.settings": { ja: "設定",       en: "Settings", zh: "设置",   ko: "설정" },
  "tabs.menu":     { ja: "メニュー",   en: "Menu",     zh: "菜单",   ko: "메뉴" },

  // Tasks
  "tasks.title":       { ja: "タスク", en: "Tasks", zh: "任务", ko: "작업" },
  "tasks.today":       { ja: "今日のタスク", en: "Today's Tasks", zh: "今天的任务", ko: "오늘의 작업" },
  "tasks.all":         { ja: "すべてのタスク", en: "All Tasks", zh: "所有任务", ko: "모든 작업" },
  "tasks.completed":   { ja: "完了済み", en: "Completed", zh: "已完成", ko: "완료됨" },
  "tasks.add":         { ja: "+ タスク追加", en: "+ Add Task", zh: "+ 添加任务", ko: "+ 작업 추가" },
  "tasks.empty":       { ja: "タスクがありません", en: "No tasks yet", zh: "暂无任务", ko: "작업이 없습니다" },
  "tasks.emptyHint":   { ja: "「+ タスク追加」で始めましょう", en: "Tap \"+ Add Task\" to get started", zh: "点击\"+ 添加任务\"开始", ko: "\"+ 작업 추가\"를 눌러 시작하세요" },
  "tasks.count":       { ja: "{0}/{1}", en: "{0}/{1}", zh: "{0}/{1}", ko: "{0}/{1}" },

  // Task Add/Edit
  "task.add.title":       { ja: "タスクを追加", en: "Add Task", zh: "添加任务", ko: "작업 추가" },
  "task.edit.title":      { ja: "タスクを編集", en: "Edit Task", zh: "编辑任务", ko: "작업 편집" },
  "task.title":           { ja: "タイトル", en: "Title", zh: "标题", ko: "제목" },
  "task.title.placeholder": { ja: "例: API設計書を書く", en: "e.g. Write API spec", zh: "例如: 编写API规范", ko: "예: API 설계서 작성" },
  "task.priority":        { ja: "優先度", en: "Priority", zh: "优先级", ko: "우선순위" },
  "task.priority.high":   { ja: "高", en: "High", zh: "高", ko: "높음" },
  "task.priority.medium": { ja: "中", en: "Medium", zh: "中", ko: "중간" },
  "task.priority.low":    { ja: "低", en: "Low", zh: "低", ko: "낮음" },
  "task.dueDate":         { ja: "期日", en: "Due Date", zh: "截止日期", ko: "마감일" },
  "task.save":            { ja: "追加する", en: "Add", zh: "添加", ko: "추가하기" },
  "task.update":          { ja: "保存する", en: "Save", zh: "保存", ko: "저장하기" },

  // Goals
  "goals.title":        { ja: "目標", en: "Goals", zh: "目标", ko: "목표" },
  "goals.fromTimer":    { ja: "ENSO TIMERの目標", en: "Goals from ENSO TIMER", zh: "来自ENSO TIMER的目标", ko: "ENSO TIMER의 목표" },
  "goals.noGoals":      { ja: "目標がありません", en: "No goals yet", zh: "暂无目标", ko: "목표가 없습니다" },
  "goals.noGoalsHint":  { ja: "ENSO TIMERで目標を設定しましょう", en: "Set goals in ENSO TIMER", zh: "在ENSO TIMER中设置目标", ko: "ENSO TIMER에서 목표를 설정하세요" },
  "goals.remaining":    { ja: "残り{0}日", en: "{0}d left", zh: "剩余{0}天", ko: "{0}일 남음" },
  "goals.overdue":      { ja: "期限超過", en: "Overdue", zh: "已过期", ko: "기한 초과" },
  "goals.milestones":   { ja: "マイルストーン", en: "Milestones", zh: "里程碑", ko: "마일스톤" },
  "goals.addMilestone": { ja: "+ マイルストーン追加", en: "+ Add Milestone", zh: "+ 添加里程碑", ko: "+ 마일스톤 추가" },
  "goals.milestone.placeholder": { ja: "例: TOEIC模試を受ける", en: "e.g. Take TOEIC mock test", zh: "例如: 参加TOEIC模拟考试", ko: "예: TOEIC 모의고사 응시" },

  // Settings
  "settings.title":          { ja: "設定", en: "Settings", zh: "设置", ko: "설정" },
  "settings.theme":          { ja: "テーマ", en: "Theme", zh: "主题", ko: "테마" },
  "settings.theme.dark":     { ja: "ダーク", en: "Dark", zh: "深色", ko: "다크" },
  "settings.theme.light":    { ja: "ライト", en: "Light", zh: "浅色", ko: "라이트" },
  "settings.theme.system":   { ja: "システム", en: "System", zh: "系统", ko: "시스템" },
  "settings.language":       { ja: "言語", en: "Language", zh: "语言", ko: "언어" },
  "settings.data":           { ja: "データ管理", en: "Data", zh: "数据管理", ko: "데이터 관리" },
  "settings.export":         { ja: "データをエクスポート", en: "Export Data", zh: "导出数据", ko: "데이터 내보내기" },
  "settings.import":         { ja: "データをインポート", en: "Import Data", zh: "导入数据", ko: "데이터 가져오기" },
  "settings.importSuccess":  { ja: "インポート成功！", en: "Import successful!", zh: "导入成功！", ko: "가져오기 성공!" },
  "settings.importFail":     { ja: "インポートに失敗しました", en: "Import failed", zh: "导入失败", ko: "가져오기 실패" },
  "settings.clear":          { ja: "すべてのデータを削除", en: "Delete All Data", zh: "删除所有数据", ko: "모든 데이터 삭제" },
  "settings.clearConfirm":   { ja: "すべてのデータが削除されます。この操作は取り消せません。", en: "All data will be deleted. This cannot be undone.", zh: "所有数据将被删除。此操作无法撤消。", ko: "모든 데이터가 삭제됩니다. 이 작업은 취소할 수 없습니다." },

  // Menu
  "menu.title":            { ja: "メニュー", en: "Menu", zh: "菜单", ko: "메뉴" },
  "menu.ensoApps":         { ja: "ENSO Apps", en: "ENSO Apps", zh: "ENSO Apps", ko: "ENSO Apps" },
  "menu.ensoDashboard":    { ja: "ENSO Dashboard", en: "ENSO Dashboard", zh: "ENSO Dashboard", ko: "ENSO Dashboard" },
  "menu.ensoDashboardDesc":{ ja: "人生をより意識的に生きる", en: "Live more consciously", zh: "更有意识地生活", ko: "더 의식적으로 살다" },
  "menu.ensoTimer":        { ja: "ENSO TIMER", en: "ENSO TIMER", zh: "ENSO TIMER", ko: "ENSO TIMER" },
  "menu.ensoTimerDesc":    { ja: "人生という時間を可視化する", en: "Visualize life's time", zh: "将人生时间可视化", ko: "인생의 시간을 시각화하다" },
  "menu.ensoFocus":        { ja: "ENSO FOCUS", en: "ENSO FOCUS", zh: "ENSO FOCUS", ko: "ENSO FOCUS" },
  "menu.ensoFocusDesc":    { ja: "ポモドーロで集中力を鍛える", en: "Train focus with Pomodoro", zh: "用番茄钟训练专注力", ko: "포모도로로 집중력을 키우다" },
  "menu.ensoJournal":      { ja: "ENSO JOURNAL", en: "ENSO JOURNAL", zh: "ENSO JOURNAL", ko: "ENSO JOURNAL" },
  "menu.ensoJournalDesc":  { ja: "やったことが、勝手に日記になる", en: "Your actions become your journal", zh: "你的行动自动成为日记", ko: "행동이 자동으로 일기가 됩니다" },
  "menu.ensoCommunity":    { ja: "ENSO COMMUNITY", en: "ENSO COMMUNITY", zh: "ENSO COMMUNITY", ko: "ENSO COMMUNITY" },
  "menu.ensoCommunityDesc":{ ja: "仲間と繋がる", en: "Connect with others", zh: "与伙伴连接", ko: "동료와 연결하다" },
  "menu.comingSoon":       { ja: "近日公開", en: "Coming Soon", zh: "即将推出", ko: "출시 예정" },
  "menu.credits":          { ja: "Credits", en: "Credits", zh: "Credits", ko: "Credits" },
  "menu.version":          { ja: "Version", en: "Version", zh: "Version", ko: "Version" },

  // Task Grouping
  "tasks.uncategorized":     { ja: "未分類", en: "Uncategorized", zh: "未分类", ko: "미분류" },
  "tasks.noMilestone":       { ja: "マイルストーンなし", en: "No Milestone", zh: "无里程碑", ko: "마일스톤 없음" },
  "task.goal":               { ja: "目標", en: "Goal", zh: "目标", ko: "목표" },
  "task.goal.none":          { ja: "なし", en: "None", zh: "无", ko: "없음" },
  "task.milestone":          { ja: "マイルストーン", en: "Milestone", zh: "里程碑", ko: "마일스톤" },
  "task.milestone.none":     { ja: "なし", en: "None", zh: "无", ko: "없음" },
  "goals.addTask":           { ja: "+ タスク", en: "+ Task", zh: "+ 任务", ko: "+ 작업" },
  "goals.moveToTasks":       { ja: "タスクに移行", en: "Move to Tasks", zh: "移至任务", ko: "작업으로 이동" },
  "goals.taskCount":         { ja: "{0}件のタスク", en: "{0} tasks", zh: "{0}个任务", ko: "{0}개 작업" },
  "goals.selectTasks":       { ja: "移行するタスクを選択", en: "Select tasks to move", zh: "选择要移动的任务", ko: "이동할 작업 선택" },
  "goals.inTasks":           { ja: "移行済み", en: "Active", zh: "已移动", ko: "이동됨" },
  "goals.editMilestone":     { ja: "編集", en: "Edit", zh: "编辑", ko: "편집" },
  "goals.deleteMilestone":   { ja: "削除", en: "Delete", zh: "删除", ko: "삭제" },
  "goals.deleteMilestoneConfirm": { ja: "このマイルストーンを削除しますか？紐づくタスクも削除されます。", en: "Delete this milestone? Related tasks will also be deleted.", zh: "删除此里程碑？相关任务也将被删除。", ko: "이 마일스톤을 삭제하시겠습니까? 관련 작업도 삭제됩니다." },
  "goals.aiGenerate":        { ja: "AIで分解", en: "AI Breakdown", zh: "AI分解", ko: "AI 분해" },
  "goals.aiGenerating":      { ja: "AI生成中...", en: "Generating...", zh: "AI生成中...", ko: "AI 생성 중..." },
  "goals.aiError":           { ja: "生成に失敗しました", en: "Generation failed", zh: "生成失败", ko: "생성 실패" },
  "goals.aiConfirm":         { ja: "この内容で追加しますか？", en: "Add these items?", zh: "添加这些内容？", ko: "이 내용을 추가하시겠습니까?" },
  "goals.aiAdd":             { ja: "追加する", en: "Add All", zh: "全部添加", ko: "모두 추가" },
  "goals.openTimer":         { ja: "ENSO TIMERを開く →", en: "Open ENSO TIMER →", zh: "打开ENSO TIMER →", ko: "ENSO TIMER 열기 →" },
  "tasks.focusPrompt":       { ja: "「{0}」に集中する？", en: "Focus on \"{0}\"?", zh: "集中于「{0}」？", ko: "\"{0}\"에 집중하시겠습니까?" },
  "tasks.openFocus":         { ja: "ENSO FOCUSで集中 →", en: "Focus with ENSO FOCUS →", zh: "用ENSO FOCUS集中 →", ko: "ENSO FOCUS로 집중 →" },
  "tasks.close":             { ja: "閉じる", en: "Close", zh: "关闭", ko: "닫기" },

  // Modal
  "modal.confirm": { ja: "確認", en: "Confirm", zh: "确认", ko: "확인" },
  "modal.cancel":  { ja: "キャンセル", en: "Cancel", zh: "取消", ko: "취소" },
  "modal.delete":  { ja: "削除する", en: "Delete", zh: "删除", ko: "삭제" },
};

export function t(key: string, locale: Locale): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[locale] ?? entry["en"] ?? key;
}

export function tFormat(key: string, locale: Locale, ...args: (string | number)[]): string {
  let str = t(key, locale);
  args.forEach((arg, i) => {
    str = str.replace(new RegExp(`\\{${i}\\}`, "g"), String(arg));
  });
  return str;
}
