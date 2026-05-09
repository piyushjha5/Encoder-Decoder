# 🔐 Encode / Decode Tool

A lightweight, browser-based utility for encoding and decoding text in a variety of popular formats.  
This tool is designed for developers, testers, and security enthusiasts who frequently work with encoded data.  
It features an intuitive user interface, JSON auto-formatting, dark mode, keyboard shortcuts, and a powerful built-in JSON tree viewer.

---

## 📌 Overview

The Encode / Decode Tool allows you to quickly transform text using the following modes:

- **Base64**
- **Hexadecimal**
- **URL Encoding**
- **HTML Entities**
- **Binary**
- **ROT13**

The application runs entirely in the browser — no backend or external libraries.  
It is fully offline-capable, responsive, and optimized for fast usage.

---

## ✨ Features

### 🔧 Multiple Encoding / Decoding Modes

Easily switch between different transformation types including Base64, Hex, URL, HTML Entities, Binary, and ROT13.

### 🌗 Light & Dark Mode

- Automatically detects system theme
- Manual toggle available
- Saves preference using `localStorage`

### 🧾 Automatic JSON Detection & Tree Viewer

- If output or input contains valid JSON, the tool automatically displays:
  - A collapsible tree structure
  - Syntax highlighting
  - Preview nodes for large objects
  - Click-to-edit raw JSON view

### 📋 Copy to Clipboard

- One-click copy buttons for both input and output fields
- Smooth checkmark feedback animation
- Clipboard API with fallback support

### 🔄 Swap & Clear Actions

- Swap input and output fields instantly
- Clear both fields in one click

### ⌨ Productivity Shortcuts

- **Ctrl + Enter** → Encode
- **Ctrl + Shift + Enter** → Decode

### 📊 Character Counters

- Live character count for input and output text areas

### 📱 Fully Responsive Layout

- Works across desktop, tablet, and mobile
- Smart layout switching for smaller screens

---

## 📁 Project Structure

/
│── index.html # UI structure and layout
│── styles.css # Theming, dark mode, responsive UI styling
└── script.js # Encoding logic, event handlers, JSON viewer, shortcuts

---

## 🖥️ Screenshots

> Add your screenshots below (recommended sizes: 1200×700)

### 🔹 **Light Mode UI**

![Light Mode Screenshot](./screenshots/light-mode.png)

### 🔹 **Dark Mode UI**

![Dark Mode Screenshot](./screenshots/dark-mode.png)

### 🔹 **JSON Viewer Example**

![JSON Viewer Screenshot](./screenshots/json-viewer.png)

_(If you haven't taken screenshots yet, you can upload them into a `/screenshots` folder in your repo.)_

---

## 🚀 Getting Started

### 🔸 **1. Clone or Download the Project**

```bash
git clone https://github.com/your-username/encode-decode-tool.git
```

### 🔸 2. Open the Tool

Simply open the following file in any modern browser:

No installation, no dependencies.

---

## 🛠️ Technologies Used

- **HTML5** for layout and structure
- **CSS3** for theming, animations, and responsive design
- **Vanilla JavaScript (ES6+)** for all logic, JSON viewer, theme control, encoding/decoding operations

---

## 🔧 Possible Enhancements

Here are some improvements you could add in the future:

### 🟦 Additional Encoding Types

- JWT decode & inspection
- SHA hashing
- Base32 / Base58 / Base91
- Morse code
- Gzip compression (browser-based)

### 🟦 UI & UX Upgrades

- Drag-and-drop text files
- Side-by-side diff viewer
- Resizable panels
- Custom themes using CSS variables

### 🟦 Developer Tools Integration

- Browser extension version
- Electron desktop app build
- PWA installation support (offline-first)

### 🟦 Advanced JSON Tools

- JSON validation error messaging
- JSON beautify + minify toggles
- JSON schema validation

---

## 📄 License

This project is released under the **MIT License**, allowing free usage, modification, and distribution.

---

## 🤝 Contributing

Contributions are welcome!  
Feel free to submit issues or pull requests to help improve the tool.

---

## ⭐ Support

If you find this tool useful, consider giving the repository a ⭐ on GitHub to support further development.
