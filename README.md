# AI Driven Dev — VS Code Extension

[![Version](https://img.shields.io/visual-studio-marketplace/v/AI-Driven-Dev.ai-driven-dev)](https://marketplace.visualstudio.com/items?itemName=AI-Driven-Dev.ai-driven-dev)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/AI-Driven-Dev.ai-driven-dev)](https://marketplace.visualstudio.com/items?itemName=AI-Driven-Dev.ai-driven-dev)
[![License](https://img.shields.io/badge/license-GPL--3.0--or--later-blue)](LICENSE.txt)
[![Discord](https://img.shields.io/discord/1234567890?color=7289DA&label=Discord&logo=discord&logoColor=white)](https://discord.gg/ai-driven-dev)

**AI Driven Dev** is a VS Code extension providing a _preconfigured, AI-ready_ environment for developers. It bundles curated settings, keybindings, and recommended extensions to boost productivity with AI tools (e.g., GitHub Copilot, Cursor, Windsurf). **No manual setup required**—just install and code.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation](#installation)
  - [From VS Code Marketplace (Recommended)](#from-vs-code-marketplace-recommended)
  - [From Command Palette](#from-command-palette)
- [Usage](#usage)
- [Shortcuts](#shortcuts)
- [Snippets Supported](#snippets-supported)
- [Coming Soon](#coming-soon)
- [Recommended Extensions](#recommended-extensions)
  - [Recommended extensions for specific languages](#recommended-extensions-for-specific-languages)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Optimized Settings** ⚙️  
  Pre-tuned VS Code config for AI-based workflows, enabling format-on-save, auto-imports, ESLint fixes, and more.
  
- **Recommended Extensions** 🧩  
  Automatic installation of essential plugins (Prettier, GitLens, Code Spell Checker, Docker, etc.) for an improved coding experience.
  
- **Keybindings** ⌨️  
  Saves time with shortcuts for tasks like opening folders, pasting with auto-import, deleting current lines, or toggling sidebars.
  
- **Snippets** 📝  
  Extensive snippet support for PHP, Java, Kotlin, TypeScript, and React, accelerating common coding patterns.
  
- **AI Tool Integration** 🤖  
  Seamless synergy with GitHub Copilot, Cursor, and Windsurf. Edits are auto-formatted, auto-imported, and AI suggestions blend right into your workflow.

---

## Installation

### From VS Code Marketplace (Recommended)

- Search for **“AI Driven Dev”** in the Extensions panel and click **Install**.
- Install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AI-Driven-Dev.ai-driven-dev).

### From Command Palette

Open the command palette (`Ctrl+P` or `Cmd+P` on macOS), then run:

```sh
ext install ai-driven-dev
```

_The extension applies all defaults. You can customize any setting afterward._

---

## Usage

1. **Start Coding**:  
   Simply open or create a project; AI Driven Dev automatically configures recommended defaults for maximum productivity.

2. **Adjust Settings (Optional)**:  
   You can override any default in your user/workspace `settings.json` if needed.

3. **Check Shortcuts**:  
   Use the provided keybindings or add your own. They’re visible in the Keyboard Shortcuts panel (search `AI Driven Dev`).

4. **Snippets**:  
   Type your snippet prefix (e.g., `clg` for console.log or `phpclass` for a new PHP class) and press **Tab** to expand.

---

## Shortcuts

| Shortcut          | Description                                      |
|-------------------|--------------------------------------------------|
| `cmd+k cmd+o`     | Open a new folder in a new VS Code window        |
| `ctrl+shift+v`    | Paste with auto-import                           |
| `cmd+n`           | Create a new file in the current directory       |
| `ctrl+s`          | Remove unused imports (or fix lint issues)       |
| `f12`             | Open file from Git (or go to definition)         |
| `shift+cmd+l`     | Select all occurrences of the current selection  |
| `shift+cmd+k`     | Delete the current line                          |
| `cmd+l`           | Close sidebar and focus the AI chat (if present) |
| `cmd+shift+b`     | Toggle the secondary (auxiliary) sidebar         |

_(Shortcuts may differ slightly on Linux/Windows.)_

---

## Snippets Supported

- **PHP** (`.php`)  
  `phpclass` → PHP 8 class with constructor property promotion.
  
- **TypeScript** (`.ts`)  
  - `clg` → `console.log()`
  - `ef` → `export function …`
  - `edf` → `export default function …`

- **TypeScript React** (`.tsx`)  
  - `jss` → JSON stringify block in React  
  - `uef`, `ucb`, `umo`, `ure`, `ef` → Hooks & component snippets

- **Java** (`.java`)  
  - `jclass` → Basic Java class.

- **Kotlin** (`.kt`)  
  - `kclass` → Basic Kotlin class.

_More languages may be added in future updates._

---

## Coming Soon

- Editor Config support.
- Shortcut support for Linux/Windows.
- Cursor Rules template.
- GitHub Copilot template.

---

## Recommended Extensions

The following extensions are recommended for the best experience:

- [Code Spell Checker (English)](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [Code Spell Checker (French)](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker-french)
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
- [Markdown Lint](https://marketplace.visualstudio.com/items?itemName=davidanson.vscode-markdownlint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Recommended extensions for specific languages

- [PHP Prettier](https://github.com/prettier/plugin-php)
- [PHP Intelephense](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)
- [Kotlin](https://marketplace.visualstudio.com/items?itemName=fwcd.kotlin)
- [Java](https://marketplace.visualstudio.com/items?itemName=Oracle.oracle-java)

---

## Contributing

We welcome contributions, bug reports, and feature requests. Feel free to:

- Open an **issue** on [GitHub](https://github.com/ai-driven-dev/vscode/issues) to report problems or propose ideas.
- Submit a **pull request** if you’d like to add features or fix bugs.
- Star our repository if you find the extension useful—this helps more developers discover it!

---

## License

This project is licensed under [**GPL-3.0-or-later**](LICENSE.txt).  
© 2025 **AI Driven Dev**.

_Enjoy coding with AI-Driven Dev!_ 🚀
