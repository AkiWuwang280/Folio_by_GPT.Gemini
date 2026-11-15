# 更新日志

## 1.4.2
- 完善项目公开说明与原作者致谢，明确本项目为基于「纸上访谈」的授权二次创作。
- 将当前适配范围明确为手机端，说明桌面端尚未完成适配。
- 更新推荐导入的 UI 主题文件为 `folio-theme1.3.2-fixed.json`，旧版 JSON 保留作历史备份。
- 精简几何暗纹的项目介绍。
- 恢复并稳定几何暗纹在聊天阅读区域内的定位。
- 整理顶部九宫格导航与浅色界面图标适配。
- 优化消息正文版心、头像与正文的布局关系及页码居中效果。
- 修整输入区域的分隔线与背景衔接，减少多余黑条。
- 更新扩展设置面板中的版本标记。

## 1.3.1
- 修复扩展入口中的 JavaScript 语法错误，恢复正常加载。
- 撤销 1.3.0 对正文宽度、内边距和底板的强制覆盖，恢复原作者版心尺寸。
- 正文仅做轻微左移，头像与消息容器保持原位。
- 限制底部输入框的最小与最大高度，避免输入区过度膨胀。

## 1.3.0
- 恢复第五套深紫配色「紫宸」，并为角色正文与旁白配置独立文字层级。
- 为正文加入轻微区分的阅读底板、低对比几何角纹与细腻边线。
- 优化正文版心居中逻辑，分节线采用克制的菱形符号。
- 保留原主题布局参数与移动端适配，背景图片仍可独立设置。

## 1.1.1
- 修复预设管理器条目图标与标题间距，避免状态标记覆盖文字。
- 恢复参考版式的消息容器与头像原生布局，不再强制改写 flex 尺寸。
- 恢复快速回复栏单行布局，避免按钮换行撑高输入区域。
- 将复选框样式限制在 Folio 自身设置面板，不再覆盖酒馆全局控件。

## 1.1.0
- 重构为完整阅读主题布局，接入 SmartTheme 变量。
- 修复头像占位和正文重复左边距导致的偏移。
- 设置面板改为原生可折叠抽屉，分组也可折叠。
- 增加四套配色、独立背景图、字体与排版设置。
- 新增可导入的原生 UI 主题 JSON。

## 1.2.0
- Rebased the imported UI theme on the supplied original「纸上访谈」theme CSS, preserving its established layout, component styling, and mobile measurements.
- Separated extension settings CSS from global UI styling to reduce unintended selector collisions.
- Replaced ineffective free-text font-name fields with built-in font-stack selectors.
- Restored original theme typography and layout variables as the source of truth; exposed only supported, wired controls.
- Updated the settings panel version label and runtime version marker to 1.2.0.
