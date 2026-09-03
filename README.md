# 💌 约会邀请程序 (Crush Invite H5)

为小杰特别定制的移动端高颜值约会邀请互动单页。无需购买云服务器，纯静态托管即可上线！

---

## 🌟 核心特色

1. **抖音爆款拟物卡片与动效**：
   - 包含【信封轻启】、【诚挚寄语】、【行程方案与心愿挑选】、【男嘉宾承诺】、【高能决策】、【终极通票】6 大阶段。
2. **调皮搞怪的“无法拒绝”按钮**：
   - 对方手指碰到或鼠标划向【狠心拒绝】按钮时，按钮会在屏幕内快速随机逃跑，根本点不到！
3. **沉浸式庆祝特效**：
   - 点击【同意约会】后，全屏自动喷发彩色礼花与粉红爱心雨粒子特效，并盖上醒目的【审批通过 APPROVED】印章。
4. **免服务器微信即时推送**：
   - 对方点击同意后，系统会第一时间给你的微信发送通知，汇报对方选的菜品和确认时间！

---

## 🛠️ 如何配置与个性化修改

所有文字、称呼、日程流程都已单独抽离在 `js/config.js` 文件中：

### 1. 微信通知配置（免费 30 秒搞定）
1. 微信搜索公众号 **【pushplus推送加】** 并关注。
2. 进入公众号后点击下方的【一对一推送】-> 复制你的 **Token**。
3. 打开 `js/config.js`，将 Token 粘贴到 `pushToken: "你的Token"` 中即可。
   *(不配置也不影响页面正常运行)*

### 2. 约会流程与菜品修改
打开 `js/config.js`，找到 `agendaSchedule` 数组，随时替换为你真实的行程和想吃的美食选项。

---

## 🚀 免费发布上线（拿到可在微信发给对方的链接）

你的 GitHub 账号为：`hapy_8bit`。

### 方法 A：使用 GitHub Pages（最推荐）

1. **在 GitHub 上新建仓库**：
   - 登录你的 GitHub，点击右上角 `+` -> `New repository`。
   - 仓库名称比如写：`crush-invite`（设置为 **Public 公开**）。
2. **把本项目文件夹的内容推送到该仓库**：
   在终端运行：
   ```bash
   cd /Users/liuhang/Documents/Google_Project/CrushInvite
   git init
   git add .
   git commit -m "feat: init crush invite app"
   git branch -M main
   git remote add origin https://github.com/hapy_8bit/crush-invite.git
   git push -u origin main
   ```
3. **开启免费在线网页**：
   - 进入该仓库页面 -> 点击顶部的 **Settings** -> 左侧菜单选择 **Pages**。
   - 在 **Build and deployment** 下的 Branch 选择 `main`，文件夹选 `/(root)`，点击 **Save**。
   - 等待 1~2 分钟，页面上方就会出现你的专属链接：
     `https://hapy_8bit.github.io/crush-invite/`
   - 将这个链接直接在微信发给对方即可！

---

### 方法 B：使用 Vercel 一键拖拽上线（更简单，30秒）
1. 打开 [https://vercel.com](https://vercel.com) 用你的 GitHub 账号直接登录。
2. 直接导入刚刚创建的 `crush-invite` 仓库，或者直接把 `CrushInvite` 文件夹拖拽进去。
3. 瞬间生成一个诸如 `https://crush-invite-xxx.vercel.app` 的超快网址！
