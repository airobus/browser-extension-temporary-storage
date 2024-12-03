# Quick Notes 浏览器插件

一个简单但功能强大的临时记事本浏览器插件，让您可以随时记录想法、笔记，并支持一键发送到 Notion。

## 功能特点

### 基础功能
- 快速打开记事本，随时记录
- 自动保存内容，无需手动操作
- 简洁优雅的界面设计
- 支持多行文本输入
- 一键清除功能

### 高级功能
- 支持一键发送到 Notion
- 自动格式化内容布局
- 自动添加时间戳
- 智能识别链接，自动添加来源标记
- 支持右键菜单快速保存选中文本

### 使用体验
- 流畅的动画效果
- 即时的操作反馈
- 友好的错误提示
- 完整的设置引导
- 优雅的滚动条设计

## Notion 集成

### 特性
- 支持自定义 Notion 页面
- 自动格式化内容布局
- 智能时间戳
- 自动分割线
- 链接源标记

### 详细配置步骤

1. 创建 Notion Integration
   - 访问 [Notion Integrations](https://www.notion.so/my-integrations)
   - 点击 "Create new integration"
   - 填写名称（如 "Quick Notes"）
   - 选择关联的 Workspace
   - 在 Capabilities 部分确保勾选：
     * Read content
     * Update content
     * Insert content
   - 点击 "Submit"
   - 复制生成的 "Internal Integration Token"

2. 配置 Notion 页面权限
   - 打开要使用的 Notion 页面
   - 点击右上角 "•••" 按钮
   - 选择 "Add connections"
   - 找到并选择刚才创建的 integration
   - 确认添加权限

3. 获取页面 ID
   - 在浏览器中打开你的 Notion 页面
   - 复制 URL 中最后一段作为 Page ID
   - 示例：notion.so/xxx/1513f7c67c13805a9e40dc384cf92fc2
   - Page ID 就是最后的 32 位字符串

4. 在插件中配置
   - 点击插件图标
   - 点击 "Notion 设置"
   - 填入 Integration Token
   - 填入 Page ID
   - 点击保存设置

### 注意事项
- Integration Token 是私密信息，请勿分享给他人
- 确保 Notion 页面已正确添加 integration 权限
- Page ID 不需要包含破折号，插件会自动处理
- 可以随时更新或修改配置

## 数据存储说明

本插件使用 Chrome 浏览器的 `chrome.storage.local` API 来存储数据：

- 数据完全存储在浏览器本地
- 数据会在浏览器关闭后保持
- 数据限制大小为 5MB
- 数据仅在该浏览器中可用
- 支持自动保存和手动保存

## 使用方法

### 基础使用
1. 点击浏览器工具栏中的插件图标
2. 在弹出的文本框中输入内容
3. 内容会自动保存
4. 可以点击"保存"按钮手动保存
5. 需要清除时点击"清除"按钮

### 右键菜单使用
1. 选中网页中的文本
2. 右键点击，选择"保存到临时记事本"
3. 文本会自动添加到记事本中
4. 自动保存网页链接作为来源

### Notion 集成使用
1. 完成 Notion 配置
2. 在记事本中输入内容
3. 点击"发送到 Notion"
4. 内容会以优雅的格式发送到指定页面

## 安装方法

1. 下载本项目
2. 打开 Chrome 浏览器，进入扩展程序页面（chrome://extensions/）
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目文件夹

## 隐私说明

- 所有笔记内容均存储在本地，不会上传到任何服务器
- Notion 集成仅在用户主动配置后才会启用
- 不收集任何用户数据
- 源代码完全开放，可以审查

## 技术特点

- 使用现代化的 Web 技术栈
- 优雅的 UI 设计
- 高性能的本地存储
- 可靠的错误处理
- 友好的用户体验 