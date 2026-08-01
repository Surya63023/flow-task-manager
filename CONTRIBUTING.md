# 🤝 Contributing to Flow Task Manager

Thank you for your interest in contributing to **Flow Task Manager**!

Contributions that improve functionality, usability, accessibility, performance, documentation, or code quality are welcome.

This document defines the recommended workflow and development standards for contributing to the project.

---

## 📋 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Ways to Contribute](#-ways-to-contribute)
- [Getting Started](#-getting-started)
- [Development Setup](#-development-setup)
- [Branch Naming Convention](#-branch-naming-convention)
- [Coding Standards](#-coding-standards)
- [Commit Message Convention](#-commit-message-convention)
- [Testing Your Changes](#-testing-your-changes)
- [Submitting a Pull Request](#-submitting-a-pull-request)
- [Reporting Bugs](#-reporting-bugs)
- [Suggesting Features](#-suggesting-features)
- [Security Issues](#-security-issues)

---

## 📜 Code of Conduct

All contributors are expected to communicate respectfully and professionally.

Before participating, please review the project's `CODE_OF_CONDUCT.md`.

---

## 🚀 Ways to Contribute

Contributions can include:

- 🐛 Fixing bugs
- ✨ Implementing new features
- 🎨 Improving UI/UX
- 📱 Improving responsive behavior
- ♿ Improving accessibility
- ⚡ Optimizing performance
- 🧹 Refactoring JavaScript or CSS
- 🧪 Improving testing and validation
- 📝 Improving documentation
- 🔍 Fixing browser compatibility issues
- 💡 Suggesting enhancements

---

## 🛠️ Getting Started

### 1. Fork the Repository

Fork the **Flow Task Manager** repository to your GitHub account.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/flow-task-manager.git
```

### 3. Navigate to the Project

```bash
cd flow-task-manager
```

### 4. Create a Development Branch

```bash
git checkout -b feature/your-feature-name
```

Make your changes on a dedicated branch instead of directly modifying `main`.

---

## 💻 Development Setup

Flow Task Manager is built using:

- HTML5
- CSS3
- Vanilla JavaScript

The project does not require a package manager or build process for its core functionality.

You can run the application by opening:

```text
index.html
```

in a modern web browser.

For development, a local server such as the VS Code **Live Server** extension may also be used.

---

## 🌿 Branch Naming Convention

Use clear and descriptive branch names.

### Features

```text
feature/task-priority-filter
feature/task-reminders
```

### Bug Fixes

```text
fix/task-rendering
fix/theme-toggle
```

### Documentation

```text
docs/update-readme
docs/improve-contributing-guide
```

### Refactoring

```text
refactor/task-storage
refactor/rendering-logic
```

### Performance

```text
perf/task-rendering
```

Keep branch names:

- Lowercase
- Descriptive
- Hyphen-separated
- Focused on a single change

---

## 🧑‍💻 Coding Standards

### HTML

- Use semantic HTML5 elements where appropriate
- Maintain accessible and meaningful markup
- Use descriptive class and ID names
- Keep indentation consistent
- Avoid unnecessary nested elements
- Add accessibility attributes where required

### CSS

- Use clear and maintainable selectors
- Keep naming conventions consistent
- Reuse existing CSS variables where available
- Avoid unnecessary duplication
- Maintain responsive behavior
- Test changes across common viewport sizes
- Keep animations purposeful and performant

### JavaScript

- Prefer `const` and `let` over `var`
- Use descriptive variable and function names
- Keep functions focused on a single responsibility
- Avoid unnecessary global state
- Reuse existing logic instead of duplicating functionality
- Handle invalid input and edge cases
- Keep DOM manipulation predictable and maintainable
- Preserve Local Storage compatibility when modifying persisted task data

---

## 📝 Commit Message Convention

This project follows a **Conventional Commits-inspired** format.

### Structure

```text
<type>: <short description>
```

### Common Types

| Type | Purpose |
|---|---|
| `feat` | Introduces a new feature |
| `fix` | Fixes a bug |
| `docs` | Documentation changes |
| `style` | UI/style changes without application logic changes |
| `refactor` | Code restructuring without changing behavior |
| `perf` | Performance improvements |
| `test` | Testing-related changes |
| `chore` | Maintenance or repository configuration |

### Examples

```text
feat: add task priority filtering

fix: prevent duplicate task rendering

docs: update project setup instructions

style: improve mobile dashboard layout

refactor: simplify localStorage synchronization

perf: optimize task rendering
```

Commit messages should be concise, descriptive, and focused on the change being introduced.

---

## 🧪 Testing Your Changes

Before submitting a contribution, verify that the application continues to work correctly.

Check relevant functionality such as:

- [ ] Task creation
- [ ] Task completion
- [ ] Task deletion
- [ ] Search functionality
- [ ] Task filtering
- [ ] Date-based task handling
- [ ] Category handling
- [ ] Progress calculations
- [ ] Local Storage persistence
- [ ] Dark/light theme switching
- [ ] Responsive layouts
- [ ] Browser refresh persistence
- [ ] Empty and invalid input handling

Also check the browser developer console for unexpected JavaScript errors.

---

## 🔀 Submitting a Pull Request

### 1. Stage Your Changes

```bash
git add .
```

### 2. Commit Your Changes

```bash
git commit -m "feat: add task reminder functionality"
```

### 3. Push Your Branch

```bash
git push origin feature/task-reminders
```

### 4. Open a Pull Request

Open a Pull Request from your branch to the repository's `main` branch.

### Pull Request Guidelines

Your Pull Request should:

- Have a clear and descriptive title
- Explain what was changed
- Explain why the change is useful
- Reference related issues when applicable
- Include screenshots for significant UI changes
- Keep unrelated changes out of the same PR
- Confirm that existing functionality still works

---

## 🐛 Reporting Bugs

Before creating a bug report, check existing GitHub Issues to avoid duplicates.

A useful bug report should include:

- Clear issue title
- Description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and version
- Operating system
- Screenshots or recordings when relevant
- Console errors when applicable

---

## 💡 Suggesting Features

Feature suggestions are welcome.

When proposing a feature, describe:

- The problem being solved
- The proposed functionality
- Expected user benefit
- Possible implementation approach, if known
- Relevant UI examples or screenshots, if applicable

---

## 🔐 Security Issues

Please do **not** publicly disclose potentially exploitable security vulnerabilities through ordinary GitHub Issues.

Follow the responsible disclosure instructions provided in:

```text
SECURITY.md
```

---

## 📚 Documentation Contributions

Documentation improvements are also valuable contributions.

This includes:

- Correcting inaccurate information
- Improving setup instructions
- Adding useful examples
- Fixing spelling or formatting
- Improving technical explanations
- Keeping documentation synchronized with application behavior

---

## ✅ Contribution Checklist

Before opening a Pull Request:

- [ ] I created a dedicated branch for my changes
- [ ] My changes address one clear purpose
- [ ] I followed the project's coding conventions
- [ ] I tested the affected functionality
- [ ] I checked for browser console errors
- [ ] I verified responsive behavior where applicable
- [ ] I used a descriptive commit message
- [ ] I updated documentation when necessary
- [ ] I reviewed my changes before submitting

---

## 🙌 Thank You

Thank you for helping improve **Flow Task Manager**.

Every bug fix, feature, documentation improvement, and code-quality enhancement contributes to making the project more reliable and useful.
