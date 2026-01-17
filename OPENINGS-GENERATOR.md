# 开局页面生成器 - 通用提示词

> **使用说明**：只需在下面的"输入区"粘贴您的棋谱数据，AI 会自动识别格式并完成所有流程。

---

## 📋 输入区（您只需填写这里）

### 步骤 1：配置目标文件
```
文件名：Kasparov's Trainer Smashes Keres Attack.html
目录类型：openings（或 games）
```

### 步骤 2：直接粘贴您的棋谱数据（任何格式都可以）

```
（在这里粘贴您的棋谱数据）

支持的格式：
- PGN 格式（从 lichess.org、chess.com 等网站复制）
- JSON 格式（结构化数据）
- 纯文本格式（走法 + 注释）
- 混合格式（开局名 + 走法序列）
- 甚至只有开局名称（AI 会自动搜索补全完整数据）

AI 会自动识别并处理！
```

**示例 1：从网站复制的 PGN**
```pgn
[Event "Scottish Opening"]
[ECO "C45"]

1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nf6 5. Nxc6 bxc6 6. Bd3 d5 *
```

**示例 2：只有走法的简单文本**
```
苏格兰开局 - 米埃塞斯变例

1. e4 e5 2. Nf3 Nc6 3. d4 exd4 4. Nxd4 Nf6 5. Nxc6 bxc6
```

**示例 3：只有开局名称**
```
西西里防御 - 龙式变例
```

**示例 4：JSON 格式**
```json
{
  "opening_name": "苏格兰开局",
  "variations": {
    "main_line": {
      "moves": ["e4", "e5", "Nf3", "Nc6"],
      "steps": ["步骤1", "步骤2", "步骤3", "步骤4"]
    }
  }
}
```

---

## 🤖 AI 执行流程（自动执行，用户无需关心）

当您收到用户的输入后，**严格按以下顺序执行**：

---

### Phase 0: 数据识别与预处理 🔍

#### 步骤 0.1：智能格式识别
```javascript
// 自动检测数据格式
function detectFormat(input) {
    // 检测 1: 是否是 JSON？
    try {
        const parsed = JSON.parse(input);
        if (parsed.variations || parsed.moves) {
            return { format: 'JSON', data: parsed };
        }
    } catch (e) {}
    
    // 检测 2: 是否是 PGN？
    if (input.includes('[Event') || input.match(/\d+\.\s+\w+/)) {
        return { format: 'PGN', data: input };
    }
    
    // 检测 3: 是否只有开局名称？
    if (input.split('\n').length <= 3 && !input.match(/\d+\./)) {
        return { format: 'OPENING_NAME_ONLY', data: input.trim() };
    }
    
    // 检测 4: 混合文本格式
    return { format: 'MIXED_TEXT', data: input };
}
```

#### 步骤 0.2：提取初步数据
```javascript
// 根据格式提取数据
switch (detectedFormat) {
    case 'JSON':
        variations = parseJSON(input);
        break;
    case 'PGN':
        variations = parsePGN(input);
        break;
    case 'OPENING_NAME_ONLY':
        openingName = input.trim();
        variations = {}; // 稍后通过搜索补全
        break;
    case 'MIXED_TEXT':
        variations = parseText(input);
        break;
}

// 输出识别结果
console.log(`✓ 格式识别：${detectedFormat}`);
console.log(`✓ 初步提取：${Object.keys(variations).length} 个变例`);
```

#### 步骤 0.3：🔴 强制网络搜索补全（不可跳过）

**必须执行至少 4 次 `brave_web_search`**：

```javascript
// 搜索 1: 验证开局名称和 ECO 编码
brave_web_search(query="{开局名称} opening ECO site:lichess.org OR site:chess.com")
// 记录：标准名称、ECO 编码、常见变例名

// 搜索 2: 获取主线走法
brave_web_search(query="{开局名称} main line theory site:chessgames.com")
// 记录：标准主线走法、关键分支点

// 搜索 3: 验证每个变例的走法和理论
for (const [key, variation] of Object.entries(variations)) {
    brave_web_search(query="{variation.title} chess opening moves site:lichess.org/analysis")
    // 记录：完整走法序列、理论评价
}

// 搜索 4: 补全缺失的注释和讲解
if (missingSteps.length > 0) {
    brave_web_search(query="{开局名称} key moves explanation site:chess.com/article")
    // 记录：每步的战略意义
}
```

#### 步骤 0.4：数据完整性检查
```javascript
// 检查所有变例
for (const [key, variation] of Object.entries(VARIATIONS)) {
    // 检查 1: 必填字段
    if (!variation.title) {
        ❌ ERROR: ${key} 缺少 title
    }
    if (!variation.fen) {
        ⚠️  WARNING: ${key} 缺少 FEN，使用标准起始位置
        variation.fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    }
    if (!variation.moves || variation.moves.length === 0) {
        ❌ ERROR: ${key} 缺少 moves 数组
    }
    if (!variation.steps || variation.steps.length === 0) {
        ⚠️  WARNING: ${key} 缺少 steps，通过搜索生成
        variation.steps = generateStepsFromSearch(variation.moves);
    }
    
    // 检查 2: 关键约束（CRITICAL）
    if (variation.moves.length !== variation.steps.length) {
        ❌ CRITICAL ERROR: ${key} 数据不匹配
        moves: ${variation.moves.length}
        steps: ${variation.steps.length}
        → 必须修复后才能继续
        → 回到搜索步骤补全数据
    }
}
```

#### 步骤 0.5：输出搜索报告（必须）
```
═══════════════════════════════════════════════════
Phase 0: 数据识别与搜索报告
═══════════════════════════════════════════════════

【格式识别】
✓ 输入格式: PGN
✓ 检测到: 2 个变例

【搜索 1】开局名称验证
- 搜索关键词: "Scottish Opening ECO site:lichess.org"
- 来源 URL: https://lichess.org/opening/Scottish_Opening
- 提取数据: ECO=C45, 标准名称="Scottish Game"
- 修改: 无

【搜索 2】主线走法验证
- 搜索关键词: "Scottish Opening main line theory site:chessgames.com"
- 来源 URL: https://www.chessgames.com/...
- 提取数据: 标准主线前15步
- 修改: 补充了第12-15步走法

【搜索 3】变例验证
- 变例 1: main_line
  - 搜索: "Scottish Opening main line site:lichess.org/analysis"
  - 来源: https://lichess.org/analysis/...
  - 修改: 补充了缺失的注释
- 变例 2: aggressive_line
  - 搜索: "Scottish Gambit aggressive site:chess.com"
  - 来源: https://www.chess.com/openings/...
  - 修改: 验证走法合法性 ✓

【搜索 4】注释补全
- 缺失注释: 5 处
- 搜索: "Scottish Opening key moves explanation"
- 来源: chess.com, lichess.org
- 补全: 所有缺失注释已生成

【最终数据】
✓ 开局名称: Scottish Game (ECO: C45)
✓ 变例数量: 2
✓ main_line: 40 moves, 40 steps ✓
✓ aggressive_line: 18 moves, 18 steps ✓
✓ 所有变例 moves.length === steps.length ✓

如未执行以上搜索，必须回到此步骤重新执行。
```

---

### Phase 1: 棋理验证 ♟️

#### 步骤 1.1：Chess.js 验证所有走法

```javascript
const Chess = require('chess.js');

for (const [key, variation] of Object.entries(VARIATIONS)) {
    console.log(`\n验证变例: ${key}`);
    
    // 检查 1: 数组长度匹配（CRITICAL）
    if (variation.moves.length !== variation.steps.length) {
        ❌ CRITICAL ERROR: ${key} 数据不匹配
        moves: ${variation.moves.length}
        steps: ${variation.steps.length}
        → 立即停止，回到 Phase 0 修复
    }
    
    // 检查 2: FEN 有效性
    const chess = new Chess();
    try {
        chess.load(variation.fen);
    } catch (e) {
        ❌ ERROR: ${key} FEN 无效: ${variation.fen}
        → 立即停止并修复
    }
    
    // 检查 3: 逐步验证走法合法性
    chess.load(variation.fen);
    for (let i = 0; i < variation.moves.length; i++) {
        const move = chess.move(variation.moves[i]);
        if (!move) {
            ❌ ERROR: ${key} 第 ${i+1} 步 '${variation.moves[i]}' 非法
            当前FEN: ${chess.fen()}
            → 立即停止并修复
        }
    }
    
    // 全部通过
    console.log(`✓ ${key}: ${variation.moves.length} 步全部合法`);
    console.log(`  最终FEN: ${chess.fen()}`);
}
```

#### 步骤 1.2：输出验证报告（必须）
```
═══════════════════════════════════════════════════
Phase 1: 棋理验证报告
═══════════════════════════════════════════════════

✓ main_line:
  - moves: 40 个
  - steps: 40 个
  - 匹配: ✓
  - FEN 有效: ✓
  - 合法性: 全部通过 ✓
  - 最终FEN: r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 6

✓ aggressive_line:
  - moves: 18 个
  - steps: 18 个
  - 匹配: ✓
  - FEN 有效: ✓
  - 合法性: 全部通过 ✓
  - 最终FEN: r1bqk2r/pppp1ppp/2n2n2/4p3/1bB1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 5

【验证统计】
- 总变例: 2
- 通过: 2
- 失败: 0
- 成功率: 100%

如有任何错误，必须回到 Phase 0 重新搜索验证。
```

---

### Phase 2: HTML 生成 📝

#### 步骤 2.1：读取参考模板

```javascript
// 自动选择最新模板
const templatePath = detectLatestTemplate("openings/");
// 或使用用户指定的模板

console.log(`✓ 使用模板: ${templatePath}`);
```

#### 步骤 2.2：生成 HTML

**严格要求**：
1. **保持模板完整结构**：DOM、class 命名、交互逻辑
2. **使用相对路径**（必须）：
   ```html
   <link rel="stylesheet" href="../assets/css/style.css">
   <script src="../assets/js/chess-logic.js"></script>
   <a href="../index.html">返回主页</a>
   ```
3. **侧边栏按钮**：
   ```html
   <button onclick="selectVariation('main_line')">主变例</button>
   <!-- 键名必须与 VARIATIONS 对象一致 -->
   ```
4. **数据注入**：
   ```html
   <script>
   const VARIATIONS = {
       main_line: {
           title: "主变例",
           fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
           moves: ["e4", "e5", "Nf3", ...],
           steps: ["步骤1", "步骤2", "步骤3", ...]
       }
   };
   </script>
   ```

---

### Phase 3: 🔴 chrome-devtools 强制完整手动测试（不可跳过）

#### 步骤 3.1：打开页面
```javascript
chrome-devtools_new_page(url="file:///Volumes/disk1/111111/my-chess-class/openings/{文件名}")
等待 2 秒
```

#### 步骤 3.2：检查资源加载
```javascript
chrome-devtools_list_network_requests

// 必须验证：
✓ style.css: 200 OK
✓ chess-logic.js: 200 OK
✓ 所有 CDN 资源: 200 OK
✗ 无任何 404 错误

// 如有 404，立即停止并修复
```

#### 步骤 3.3：检查控制台
```javascript
chrome-devtools_list_console_messages

// 必须验证：
✓ 看到: "Initializing ChessApp..."
✓ 看到: "ChessApp initialized successfully."
✗ 无任何 error
✗ 无任何 warning

// 如有错误，立即停止并修复
```

#### 步骤 3.4：🔴 逐个手动点击每个变例按钮（核心步骤）

```javascript
const variationKeys = Object.keys(VARIATIONS);
console.log(`开始测试 ${variationKeys.length} 个变例`);

for (let i = 0; i < variationKeys.length; i++) {
    const varId = variationKeys[i];
    
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`测试变例 ${i+1}/${variationKeys.length}: ${varId}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    
    // [步骤 1] 点击变例按钮
    console.log(`\n[步骤 1] 点击变例按钮: ${varId}`);
    chrome-devtools_click_selector(selector=`button[onclick*="${varId}"]`)
    等待 500 毫秒
    
    // [步骤 2] 检查是否出现"数据严重错误"
    console.log(`\n[步骤 2] 检查加载状态...`);
    chrome-devtools_evaluate_js(script=`
        document.getElementById('statusInfo').textContent
    `)
    
    const statusText = 上一步返回值;
    if (statusText.includes('数据严重错误')) {
        ❌ 变例 ${varId} 加载失败！
        错误信息: ${statusText}
        → 立即停止，回到 Phase 1 检查数据
        exit(1);
    }
    console.log(`✓ 变例加载成功: ${statusText}`);
    
    // [步骤 3] 验证初始步数 [0/N]
    console.log(`\n[步骤 3] 验证初始步数...`);
    chrome-devtools_evaluate_js(script=`
        const status = document.getElementById('statusInfo').textContent;
        const match = status.match(/\\[(\\d+)\\/(\\d+)\\]/);
        match ? { current: parseInt(match[1]), total: parseInt(match[2]) } : null
    `)
    
    const stepInfo = 上一步返回值;
    if (stepInfo.current !== 0) {
        ❌ 初始步数错误: ${stepInfo.current}, 应为 0
        立即停止并修复;
    }
    console.log(`✓ 初始步数正确: [0/${stepInfo.total}]`);
    
    // [步骤 4] 手动点击"下一步" 5 次
    console.log(`\n[步骤 4] 手动点击"下一步" 5次...`);
    for (let step = 1; step <= 5; step++) {
        console.log(`  点击第 ${step} 次...`);
        chrome-devtools_click_selector(selector=`button[onclick*="nextMove"]`)
        等待 300 毫秒
    }
    
    // [步骤 5] 验证步数递增到 [5/N]
    console.log(`\n[步骤 5] 验证步数递增...`);
    chrome-devtools_evaluate_js(script=`
        document.getElementById('statusInfo').textContent
    `)
    
    const afterClicks = 上一步返回值;
    if (!afterClicks.includes('[5/')) {
        ❌ "下一步"功能异常: ${afterClicks}
        应显示 [5/${stepInfo.total}]
        立即停止并修复;
    }
    console.log(`✓ 步数递增正常: ${afterClicks}`);
    
    // [步骤 6] 手动点击"重置"
    console.log(`\n[步骤 6] 手动点击"重置"...`);
    chrome-devtools_click_selector(selector=`button[onclick*="reset"]`)
    等待 300 毫秒
    
    // [步骤 7] 验证回到 [0/N]
    console.log(`\n[步骤 7] 验证重置功能...`);
    chrome-devtools_evaluate_js(script=`
        document.getElementById('statusInfo').textContent
    `)
    
    const afterReset = 上一步返回值;
    if (!afterReset.includes('[0/')) {
        ❌ "重置"功能异常: ${afterReset}
        应显示 [0/${stepInfo.total}]
        立即停止并修复;
    }
    console.log(`✓ 重置功能正常: ${afterReset}`);
    
    console.log(`\n✓✓✓ 变例 ${varId} 所有测试通过！\n`);
}

console.log(`\n═══════════════════════════════════════════════════`);
console.log(`✓✓✓ 所有 ${variationKeys.length} 个变例测试通过！`);
console.log(`═══════════════════════════════════════════════════\n`);
```

#### 步骤 3.5：输出完整测试报告
```
═══════════════════════════════════════════════════
Phase 3: chrome-devtools 完整手动测试报告
═══════════════════════════════════════════════════

【测试环境】
✓ 页面: file:///.../openings/Kasparov's Trainer.html
✓ chrome-devtools: 连接成功

【资源加载】
✓ 网络请求: 15 个，全部 200 OK
✗ 无 404 错误

【控制台】
✓ "Initializing ChessApp..."
✓ "ChessApp initialized successfully."
✗ 无 error, 无 warning

【变例按钮逐个手动测试】
✓ main_line:
  [步骤 1] 点击按钮: 成功 ✓
  [步骤 2] 加载状态: [0/40] ✓
  [步骤 3] 初始步数: [0/40] ✓
  [步骤 4] 点击"下一步"5次: 成功 ✓
  [步骤 5] 步数递增: [0/40] → [5/40] ✓
  [步骤 6] 点击"重置": 成功 ✓
  [步骤 7] 重置验证: [5/40] → [0/40] ✓

✓ aggressive_line:
  [步骤 1] 点击按钮: 成功 ✓
  [步骤 2] 加载状态: [0/18] ✓
  [步骤 3] 初始步数: [0/18] ✓
  [步骤 4] 点击"下一步"5次: 成功 ✓
  [步骤 5] 步数递增: [0/18] → [5/18] ✓
  [步骤 6] 点击"重置": 成功 ✓
  [步骤 7] 重置验证: [5/18] → [0/18] ✓

【测试统计】
- 总变例数: 2
- 测试通过: 2
- 测试失败: 0
- 总测试步骤: 14 (2变例 × 7步骤)
- 成功率: 100%

所有测试通过 ✓✓✓
```

---

## 交付清单

### 1. 完整 HTML 代码
```html
<!-- 直接可用的完整 HTML 文件 -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scottish Game - 苏格兰开局</title>
    
    <!-- CDN 资源 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.js"></script>
    
    <!-- 本地资源 -->
    <link rel="stylesheet" href="../assets/css/style.css">
    <script src="../assets/js/chess-logic.js"></script>
</head>
<body>
    <!-- 完整页面内容 -->
    <script>
    const VARIATIONS = {
        // 所有验证通过的变例数据
    };
    </script>
</body>
</html>
```

### 2. index.html 入口代码
```html
<!-- 在 index.html 对应位置添加： -->
<li><a href="openings/Kasparov's Trainer.html">Scottish Game - 苏格兰开局</a></li>
```

### 3. 完整验收报告
```
═══════════════════════════════════════════════════
最终验收报告
═══════════════════════════════════════════════════

【Phase 0: 数据识别与搜索】
✓ 格式识别: PGN
✓ 执行了 4 次 brave_web_search
✓ 补全了开局名称、ECO编码、缺失走法、所有注释
✓ 所有数据经搜索验证

【Phase 1: 棋理验证】
✓ 2 个变例全部通过 Chess.js 验证
✓ 所有变例 moves.length === steps.length
✓ 所有走法合法

【Phase 3: chrome-devtools 完整手动测试】
✓ 资源加载: 全部 200 OK
✓ 控制台: 无错误
✓ 变例按钮: 2 个变例逐个手动点击测试，全部通过
✓ UI 交互: 下一步/上一步/重置/翻转 手动测试，全部通过

【测试统计】
- 总测试项: 14
- 通过: 14
- 失败: 0
- 成功率: 100%

所有测试通过，可以安全部署 ✓✓✓
```

---

## 🔴 强制规则（AI 必须遵守）

### 规则 1: MCP 网络搜索（不可跳过）
- ❌ 禁止猜测或假设数据
- ✅ **必须至少执行 4 次 `brave_web_search`**
- ✅ 必须搜索权威来源：lichess.org、chessgames.com、chess.com、365chess.com
- ✅ 必须记录所有搜索关键词、来源 URL、提取的数据

### 规则 2: chrome-devtools 手动测试（不可跳过）
- ❌ 禁止假设功能正常
- ✅ **必须使用 chrome-devtools MCP 打开页面**
- ✅ **必须手动点击每一个变例按钮**（不是只测试一个）
- ✅ **必须逐个执行 7 个测试步骤**（点击 → 检查状态 → 验证步数 → 点击"下一步" → 验证递增 → 点击"重置" → 验证归零）
- ✅ 任何测试失败必须立即停止、修复、重新测试

### 规则 3: 数据完整性（不可妥协）
- ❌ 禁止创建 `moves.length !== steps.length` 的数据
- ✅ Phase 1 验证失败必须回到 Phase 0 修复
- ✅ Phase 3 测试失败必须回到 Phase 1 检查数据

---

## 项目环境

**仓库**：https://github.com/pengzfn/my-chess-class  
**工作目录**：`/Volumes/disk1/111111/my-chess-class/openings/`  
**资源路径**：`../assets/css/`, `../assets/js/`, `../assets/images/`

---

## 开始执行

AI 收到用户的输入后，**必须严格按顺序执行**：

1. ✅ Phase 0: 数据识别 + 强制网络搜索补全（brave_web_search）
2. ✅ Phase 1: Chess.js 验证所有走法
3. ✅ Phase 2: 生成 HTML
4. ✅ Phase 3: chrome-devtools 逐步手动测试（每个变例都要点击）
5. ✅ 提供完整交付清单（代码 + 3 个 Phase 的详细报告）

**强制要求**：
- ❌ 不得跳过任何 Phase
- ❌ 不得跳过网络搜索（brave_web_search）
- ❌ 不得跳过手动测试（chrome-devtools）
- ❌ 不得假设功能正常
- ✅ 任何验证失败必须立即停止、修复、重新测试
- ✅ 必须输出完整的测试报告

**只有所有测试 100% 通过，才能交付最终代码。**
