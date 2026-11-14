# 纸访主题 · Paper Theme

一个为 SillyTavern / SillyDroid 设计的轻量级界面主题扩展。

目标是提供清晰、克制、适合长时间阅读的界面，并把**配色主题**与**背景图片**分开管理。

## V1 功能

- 四套独立配色：深紫夜刊、深灰夜刊、浅紫刊物、暖白纸刊。
- AI 与玩家字体分别设置。
- 消息字号、行距、阅读宽度调整。
- 自定义背景图片 URL、透明度与模糊程度。
- 纸张纹理强度控制。
- 消息细边框开关。
- 设置自动保存，恢复默认值不会修改酒馆的其他设置。

## 安装

### 通过酒馆扩展管理器

1. 打开 SillyTavern 的「扩展」页面。
2. 进入「安装扩展」。
3. 粘贴仓库地址：

   `https://github.com/AkiWuwang280/PaperTheme_by_gpt`

4. 安装完成后刷新页面。
5. 在扩展设置中找到「纸访主题 · Paper Theme」。

### 手动安装

将整个仓库文件夹放入 SillyTavern 的第三方扩展目录：

`public/scripts/extensions/third-party/PaperTheme_by_gpt/`

目录中应包含 `manifest.json`、`index.js`、`settings.html` 和 `style.css`。

## 使用说明

- **配色主题**只控制纸访主题的配色，不会清除背景图片设置。
- **背景图片**使用可公开访问的 HTTP 或 HTTPS 图片直链；清空 URL 即关闭。
- 字体填写系统或设备中已安装的字体名称；留空则继承酒馆默认字体。
- 纹理强度为轻微点状纹理，建议从较低数值开始调整。
- 「恢复纸访主题默认值」只重置本扩展的设置。

## 兼容性与已知限制

- 使用 SillyTavern 的 `SillyTavern.getContext()` API 读取扩展设置、保存设置和渲染模板。
- 主要针对 SillyTavern 当前扩展 API 编写；SillyDroid 是社区打包版本，实际 DOM 与 WebView 表现仍需在目标 APK 上测试。
- 消息样式使用 SillyTavern 常见的 `#chat .mes`、`is_user` 与 `.mes_text` 结构。若宿主版本改动 DOM，可能需要调整选择器。
- 背景图层与宿主原有背景的叠放关系可能因 SillyDroid 的主题实现而不同；若背景不可见或遮挡界面，请先关闭背景图并反馈实机表现。
- 远程图片是否能加载，取决于图片链接是否可公开访问以及 WebView 的网络策略。

## 项目结构

```text
PaperTheme_by_gpt/
├── manifest.json
├── index.js
├── settings.html
├── style.css
├── README.md
└── CHANGELOG.md
```

## 开发原则

- 原生 JavaScript、CSS、HTML，不依赖构建工具。
- 不修改 SillyTavern 或 SillyDroid 核心文件。
- 设置保存在独立的扩展命名空间 `paper_theme_by_gpt`。
- 样式尽量限定在扩展设置面板与聊天消息区域，减少对其他扩展的干扰。

## 项目地址

https://github.com/AkiWuwang280/PaperTheme_by_gpt
