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
    An open-source AI journal app with Markdown support
    <br />
    <a href="https://freenote.app" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;"><strong>Visit Freenote App</strong></a>
    <br />
    <br />
    <a href="https://github.com/celerforge/freenote/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/celerforge/freenote/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
    &middot;
    <a href="README.cn.md">中文文档</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

[![Freenote Screen Shot][product-screenshot]](https://freenote.app)

Freenote is an open-source AI journal app with Markdown support. You can freely record your notes, and with AI assistance, easily search and summarize past entries, enhancing creativity capture and management. All data is stored locally on your device, ensuring privacy and security.

### Key Features

- **Markdown Editor**: Rich formatting with intuitive shortcuts
- **AI Assistant**: Search and summarize your notes intelligently
- **Privacy First**: All data stored locally on your device
- **Distraction-Free**: Clean interface focused on writing

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

### Basic Usage

1. Click on the Journal section to write notes with Markdown
2. Use Markdown shortcuts for formatting:
   - Type `#` to `######` for headings (H1-H6)
   - Type `*` or `-` for bullet lists
   - Type `>` for blockquotes
   - Select text + `Ctrl/Cmd+B` for bold, `Ctrl/Cmd+I` for italic
   - Type `` ` `` for inline code, or ` ` ``` for code blocks

### AI Features

1. Go to Settings → Add your OpenAI API key
2. Use Chat to ask questions about your notes
3. Search across all entries with AI assistance

**Note:** AI features require an OpenAI API key

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or higher)
- npm or pnpm
  ```sh
  npm install npm@latest -g
  # or
  npm install -g pnpm
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/celerforge/freenote.git
   ```
2. Install dependencies
   ```sh
   cd freenote
   pnpm install
   ```
3. Create environment configuration
   ```sh
   cp .env.example .env
   ```
4. Start the development server
   ```sh
   pnpm dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

- [ ] Enhanced AI Tools
  - [ ] AI summarization tool for keyword searches with related notes and connections
  - [ ] AI-powered knowledge base generation from notes
- [ ] Storage code readability optimization
- [ ] Note import/export functionality
- [ ] Multi-device data synchronization
- [ ] Add desktop app using Tauri

See the [open issues](https://github.com/celerforge/freenote/issues) for a full list of proposed features and known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions make the open source community an amazing place to learn, inspire, and create. Any contributions are greatly appreciated.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the AGPL-3.0 License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

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
