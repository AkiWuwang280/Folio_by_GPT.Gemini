# 页序 · Folio

简约阅读主题与配套设置扩展。

## 安装扩展
在 SillyTavern → 扩展 → 安装扩展中粘贴：
`https://github.com/AkiWuwang280/PaperTheme_by_gpt`

仓库默认分支为稳定版，不需要填写分支名。

## 导入 UI 主题
首次安装后，在「用户设置 → UI 主题 → 导入主题文件」导入 `folio-theme.json`，主题就会出现在原生 UI 主题列表中。
主题文件直链：https://raw.githubusercontent.com/AkiWuwang280/PaperTheme_by_gpt/main/folio-theme.json

## 设计基准
- SmartTheme 变量接管聊天区、抽屉、顶栏、输入区和弹窗配色。
- 墨夜、暖纸、雾青、樱笺四套配色；背景图与配色独立。
- 排版默认值参考原作者版式逻辑：头像 44px（手机 34px）、头像与正文间距 10px（手机 4px）、消息上/下留白 22px/36px（手机 18px/32px）、每行约 40 字、行高 1.95、段落间距 .75em。
- 设置面板采用酒馆原生 inline-drawer，整体和各分组均可折叠。

UI 主题 JSON 与扩展是酒馆的两套独立机制，因此主题 JSON 需要首次导入一次；扩展负责额外设置。