<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![AGPL-3.0 License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/celerforge/freenote">
    <img src="public/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Freenote</h3>

  <p align="center">
    一个支持 Markdown 的开源 AI 日记应用
    <br />
    <a href="https://freenote.app" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"><strong>访问 Freenote 应用</strong></a>
    <br />
    <br />
    <a href="https://github.com/celerforge/freenote/issues/new?labels=bug&template=bug-report---.md">报告 Bug</a>
    &middot;
    <a href="https://github.com/celerforge/freenote/issues/new?labels=enhancement&template=feature-request---.md">请求新功能</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>目录</summary>
  <ol>
    <li><a href="#关于项目">关于项目</a></li>
    <li><a href="#使用方法">使用方法</a></li>
    <li>
      <a href="#开始使用">开始使用</a>
      <ul>
        <li><a href="#前提条件">前提条件</a></li>
        <li><a href="#安装">安装</a></li>
      </ul>
    </li>
    <li><a href="#路线图">路线图</a></li>
    <li><a href="#贡献">贡献</a></li>
    <li><a href="#许可证">许可证</a></li>
    <li><a href="#联系方式">联系方式</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## 关于项目

[![Freenote截图][product-screenshot]](https://freenote.app)

Freenote 是一个支持 Markdown 的开源 AI 日记应用。您可以自由记录笔记，并借助 AI 助手轻松搜索和总结过去的条目，增强创意捕捉和管理能力。所有数据都存储在您的设备本地，确保隐私和安全。

### 主要特点

- **Markdown 编辑器**：丰富的格式化功能和直观的快捷键
- **AI 助手**：智能搜索和总结您的笔记
- **隐私优先**：所有数据存储在您的设备本地
- **无干扰界面**：专注于写作的简洁界面

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- USAGE EXAMPLES -->

## 使用方法

### 基本使用

1. 点击日记部分，使用 Markdown 编写笔记
2. 使用 Markdown 快捷键进行格式化：
   - 输入 `#` 到 `######` 创建标题（H1-H6）
   - 输入 `*` 或 `-` 创建项目符号列表
   - 输入 `>` 创建引用块
   - 选择文本 + `Ctrl/Cmd+B` 加粗，`Ctrl/Cmd+I` 斜体
   - 输入 `` ` `` 创建内联代码，或 ` ``` ` 创建代码块

### AI 功能

1. 前往设置 → 添加您的 OpenAI API 密钥
2. 使用聊天功能询问有关您笔记的问题
3. 借助 AI 助手搜索所有条目

**注意：** AI 功能需要 OpenAI API 密钥

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- GETTING STARTED -->

## 开始使用

按照以下简单步骤获取本地副本并运行。

### 前提条件

- Node.js（v18 或更高版本）
- npm 或 pnpm
  ```sh
  npm install npm@latest -g
  # 或
  npm install -g pnpm
  ```

### 安装

1. 克隆仓库
   ```sh
   git clone https://github.com/celerforge/freenote.git
   ```
2. 安装依赖
   ```sh
   cd freenote
   pnpm install
   ```
3. 创建环境配置
   ```sh
   cp .env.example .env
   ```
4. 启动开发服务器
   ```sh
   pnpm dev
   ```

### Docker 部署

您也可以使用 Docker 运行 Freenote：

1. 构建 Docker 镜像

   ```sh
   docker build -t freenote .
   ```

2. 运行容器

   ```sh
   docker run -p 3000:3000 freenote
   ```

3. 在 http://localhost:3000 访问应用

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- ROADMAP -->

## 路线图

- [ ] 增强 AI 工具
  - [ ] 关键词搜索的 AI 总结工具，显示相关笔记和连接
  - [ ] 从笔记生成 AI 驱动的知识库
- [ ] 存储代码可读性优化
- [ ] 笔记导入/导出功能
- [ ] 多设备数据同步
- [ ] 使用 Tauri 添加桌面应用
- [ ] 添加笔记标签

查看[未解决的问题](https://github.com/celerforge/freenote/issues)获取完整的功能提议和已知问题列表。

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- CONTRIBUTING -->

## 贡献

贡献使开源社区成为一个令人惊叹的学习、启发和创造的地方。非常感谢您的任何贡献。

1. Fork项目
2. 创建您的功能分支（`git checkout -b feature/AmazingFeature`）
3. 提交您的更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启Pull Request

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- LICENSE -->

## 许可证

根据 AGPL-3.0 许可证分发。有关更多信息，请参阅 `LICENSE`。

<p align="right">(<a href="#readme-top">返回顶部</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/celerforge/freenote.svg?style=for-the-badge
[contributors-url]: https://github.com/celerforge/freenote/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/celerforge/freenote.svg?style=for-the-badge
[forks-url]: https://github.com/celerforge/freenote/network/members
[stars-shield]: https://img.shields.io/github/stars/celerforge/freenote.svg?style=for-the-badge
[stars-url]: https://github.com/celerforge/freenote/stargazers
[issues-shield]: https://img.shields.io/github/issues/celerforge/freenote.svg?style=for-the-badge
[issues-url]: https://github.com/celerforge/freenote/issues
[license-shield]: https://img.shields.io/github/license/celerforge/freenote.svg?style=for-the-badge
[license-url]: https://github.com/celerforge/freenote/blob/main/LICENSE
[product-screenshot]: public/screenshot.jpeg
