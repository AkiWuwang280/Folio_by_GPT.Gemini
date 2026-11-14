# 更新日志

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
