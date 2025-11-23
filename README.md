// DOM Elements
const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const modeEl = document.getElementById("mode");
const encodeBtn = document.getElementById("encodeBtn");
const decodeBtn = document.getElementById("decodeBtn");
const swapBtn = document.getElementById("swapBtn");
const clearBtn = document.getElementById("clearBtn");
const inputTree = document.getElementById("inputTree");
const outputTree = document.getElementById("outputTree");
const themeToggleBtn = document.getElementById("themeToggle");
const toast = document.getElementById("toast");
const inputCount = document.getElementById("inputCount");
const outputCount = document.getElementById("outputCount");
const inputCopyBtn = document.getElementById("inputCopyBtn");
const outputCopyBtn = document.getElementById("outputCopyBtn");

// --- Theme Management ---
let isDarkMode = false;

function initTheme() {
// Check saved preference, fallback to system preference
const saved = getSavedTheme();
if (saved) {
isDarkMode = saved === "dark";
} else {
isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
}
applyTheme();
}

function getSavedTheme() {
try {
return localStorage.getItem("theme");
} catch {
return null;
}
}

function saveTheme(theme) {
try {
localStorage.setItem("theme", theme);
} catch {
// Storage unavailable
}
}

function applyTheme() {
document.body.classList.toggle("dark", isDarkMode);
themeToggleBtn.textContent = isDarkMode ? "☀️" : "🌙";
}

themeToggleBtn.onclick = () => {
isDarkMode = !isDarkMode;
applyTheme();
saveTheme(isDarkMode ? "dark" : "light");
};

// --- Character Count ---
function updateCharCount(el, countEl) {
const len = el.value.length;
countEl.textContent = `${len.toLocaleString()} character${
    len !== 1 ? "s" : ""
  }`;
}

inputEl.addEventListener("input", () => updateCharCount(inputEl, inputCount));
outputEl.addEventListener("input", () =>
updateCharCount(outputEl, outputCount)
);

// --- Encoding Functions ---
function encode(text, mode) {
switch (mode) {
case "base64":
// Unicode-safe Base64 encoding
return btoa(unescape(encodeURIComponent(text)));

    case "hex":
      return Array.from(new TextEncoder().encode(text))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    case "url":
      return encodeURIComponent(text);

    case "html":
      return text.replace(
        /[^a-zA-Z0-9 ]/g,
        (c) => "&#" + c.charCodeAt(0) + ";"
      );

    case "binary":
      return Array.from(new TextEncoder().encode(text))
        .map((b) => b.toString(2).padStart(8, "0"))
        .join(" ");

    case "rot13":
      return text.replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode(
          c.charCodeAt(0) + (c.toLowerCase() < "n" ? 13 : -13)
        )
      );

    default:
      return text;

}
}

// --- Decoding Functions ---
function decode(text, mode) {
switch (mode) {
case "base64":
// Unicode-safe Base64 decoding
let decoded = decodeURIComponent(escape(atob(text.trim())));
// Double decode if result looks URL-encoded
if (decoded.includes("%")) {
try {
decoded = decodeURIComponent(decoded);
} catch {}
}
return decoded;

    case "hex":
      if (text.length % 2 !== 0) {
        throw new Error("Hex string length must be even");
      }
      const hexBytes = text.match(/.{1,2}/g).map((h) => parseInt(h, 16));
      return new TextDecoder().decode(new Uint8Array(hexBytes));

    case "url":
      return decodeURIComponent(text);

    case "html":
      const doc = new DOMParser().parseFromString(text, "text/html");
      return doc.documentElement.textContent || "";

    case "binary":
      const binBytes = text.split(/\s+/).map((b) => parseInt(b, 2));
      return new TextDecoder().decode(new Uint8Array(binBytes));

    case "rot13":
      return text.replace(/[a-zA-Z]/g, (c) =>
        String.fromCharCode(
          c.charCodeAt(0) + (c.toLowerCase() < "n" ? 13 : -13)
        )
      );

    default:
      return text;

}
}

// --- JSON Formatter ---
function formatIfJson(str) {
try {
const json = JSON.parse(str);
return JSON.stringify(json, null, 2);
} catch {
return str;
}
}

// --- Collapsible JSON Tree (DevTools Style) ---
function escapeHtml(str) {
return String(str)
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;");
}

function getPreview(data, isArray) {
if (isArray) {
const items = data.slice(0, 3).map((v) => {
if (v === null) return "null";
if (typeof v === "object") return Array.isArray(v) ? "[…]" : "{…}";
if (typeof v === "string")
return `"${v.length > 15 ? v.slice(0, 15) + "…" : v}"`;
return String(v);
});
return `[${items.join(", ")}${data.length > 3 ? ", …" : ""}]`;
} else {
const entries = Object.entries(data).slice(0, 3);
const items = entries.map(([k, v]) => {
let val;
if (v === null) val = "null";
else if (typeof v === "object") val = Array.isArray(v) ? "[…]" : "{…}";
else if (typeof v === "string")
val = `"${v.length > 10 ? v.slice(0, 10) + "…" : v}"`;
else val = String(v);
return `${k}: ${val}`;
});
return `{${items.join(", ")}${Object.keys(data).length > 3 ? ", …" : ""}}`;
}
}

function renderValue(value) {
if (value === null) return `<span class="json-null">null</span>`;
if (typeof value === "string") {
const escaped = escapeHtml(value);
return `<span class="json-string">"${escaped}"</span>`;
}
if (typeof value === "number")
return `<span class="json-number">${value}</span>`;
if (typeof value === "boolean")
return `<span class="json-boolean">${value}</span>`;
return escapeHtml(String(value));
}

function createJsonTree(data, key = null, isLast = true) {
const isArray = Array.isArray(data);
const isObject = data !== null && typeof data === "object";
const comma = isLast ? "" : ",";

if (!isObject) {
const keyPart =
key !== null
? `<span class="json-key">${escapeHtml(String(key))}</span>: `
: "";
return `<div class="json-row">${keyPart}${renderValue(data)}${comma}</div>`;
}

const entries = isArray ? data.map((v, i) => [i, v]) : Object.entries(data);
const bracket = isArray ? ["[", "]"] : ["{", "}"];
const isEmpty = entries.length === 0;

if (isEmpty) {
const keyPart =
key !== null
? `<span class="json-key">${escapeHtml(String(key))}</span>: `
: "";
return `<div class="json-row">${keyPart}${bracket[0]}${bracket[1]}${comma}</div>`;
}

const id = `j${Math.random().toString(36).slice(2, 8)}`;
const preview = escapeHtml(getPreview(data, isArray));
const keyPart =
key !== null
? `<span class="json-key">${escapeHtml(String(key))}</span>: `
: "";

let html = `<div class="json-row">`;
html += `<span class="json-arrow expanded" data-id="${id}" onclick="toggleNode('${id}')"></span>`;
html += `${keyPart}<span class="json-bracket">${bracket[0]}</span>`;
html += `<span class="json-preview" id="${id}-preview" style="display:none">${preview}</span>`;
html += `<span class="json-ellipsis" id="${id}-ellipsis" style="display:none">…${bracket[1]}${comma}</span>`;
html += `</div>`;

html += `<div class="json-children" id="${id}">`;
entries.forEach(([k, v], idx) => {
html += createJsonTree(v, isArray ? idx : k, idx === entries.length - 1);
});
html += `</div>`;

html += `<div class="json-row json-closing" id="${id}-close"><span class="json-bracket">${bracket[1]}</span>${comma}</div>`;

return html;
}

function toggleNode(id) {
const children = document.getElementById(id);
const arrow = document.querySelector(`[data-id="${id}"]`);
const preview = document.getElementById(`${id}-preview`);
const ellipsis = document.getElementById(`${id}-ellipsis`);
const closing = document.getElementById(`${id}-close`);

const isExpanded = arrow.classList.contains("expanded");

if (isExpanded) {
arrow.classList.remove("expanded");
children.style.display = "none";
closing.style.display = "none";
preview.style.display = "inline";
ellipsis.style.display = "inline";
} else {
arrow.classList.add("expanded");
children.style.display = "block";
closing.style.display = "block";
preview.style.display = "none";
ellipsis.style.display = "none";
}
}

// --- Auto-detect and render JSON in panels ---
function isValidJson(str) {
try {
const parsed = JSON.parse(str);
return typeof parsed === "object" && parsed !== null;
} catch {
return false;
}
}

function updatePanel(textarea, treeView, value) {
textarea.value = value;

if (isValidJson(value)) {
const json = JSON.parse(value);
treeView.innerHTML = createJsonTree(json);
treeView.style.display = "block";
textarea.classList.add("hidden");
} else {
treeView.style.display = "none";
treeView.innerHTML = "";
textarea.classList.remove("hidden");
}
}

// Check input on typing
inputEl.addEventListener("input", () => {
updateCharCount(inputEl, inputCount);
});

// Render JSON when input loses focus
inputEl.addEventListener("blur", () => {
if (isValidJson(inputEl.value)) {
const json = JSON.parse(inputEl.value);
inputTree.innerHTML = createJsonTree(json);
inputTree.style.display = "block";
inputEl.classList.add("hidden");
}
});

// Click on tree view to edit
inputTree.addEventListener("click", () => {
inputTree.style.display = "none";
inputTree.innerHTML = "";
inputEl.classList.remove("hidden");
inputEl.focus();
});

outputTree.addEventListener("click", () => {
outputTree.style.display = "none";
outputTree.innerHTML = "";
outputEl.classList.remove("hidden");
outputEl.removeAttribute("readonly");
outputEl.focus();
});

// --- Button Handlers ---
encodeBtn.onclick = () => {
try {
const inputValue = inputEl.value;
const result = encode(inputValue, modeEl.value);
updatePanel(outputEl, outputTree, result);
updateCharCount(outputEl, outputCount);
outputEl.setAttribute("readonly", true);
} catch (e) {
updatePanel(outputEl, outputTree, `Encoding error: ${e.message}`);
outputEl.setAttribute("readonly", true);
}
};

decodeBtn.onclick = () => {
try {
const inputValue = inputEl.value;
const decoded = decode(inputValue, modeEl.value);
updatePanel(outputEl, outputTree, formatIfJson(decoded));
updateCharCount(outputEl, outputCount);
outputEl.setAttribute("readonly", true);
} catch (e) {
updatePanel(outputEl, outputTree, `Decoding error: ${e.message}`);
outputEl.setAttribute("readonly", true);
}
};

swapBtn.onclick = () => {
const inputVal = inputEl.value;
const outputVal = outputEl.value;

// Update both panels
updatePanel(inputEl, inputTree, outputVal);
updatePanel(outputEl, outputTree, inputVal);

updateCharCount(inputEl, inputCount);
updateCharCount(outputEl, outputCount);
outputEl.setAttribute("readonly", true);
};

clearBtn.onclick = () => {
inputEl.value = "";
outputEl.value = "";
inputTree.style.display = "none";
inputTree.innerHTML = "";
inputEl.classList.remove("hidden");
outputTree.style.display = "none";
outputTree.innerHTML = "";
outputEl.classList.remove("hidden");
updateCharCount(inputEl, inputCount);
updateCharCount(outputEl, outputCount);
inputEl.focus();
};

// --- Copy to Clipboard with Icon Change ---
async function copyText(textarea, copyBtn) {
if (!textarea || !textarea.value) {
showToast("Nothing to copy!");
return;
}

try {
await navigator.clipboard.writeText(textarea.value);

    // Change icon to check mark
    const copyIcon = copyBtn.querySelector(".copy-icon");
    const checkIcon = copyBtn.querySelector(".check-icon");

    copyIcon.style.display = "none";
    checkIcon.style.display = "inline";

    showToast("Copied to clipboard!");

    // Revert back to copy icon after 2 seconds
    setTimeout(() => {
      copyIcon.style.display = "inline";
      checkIcon.style.display = "none";
    }, 2000);

} catch {
// Fallback for older browsers
textarea.select();
document.execCommand("copy");

    const copyIcon = copyBtn.querySelector(".copy-icon");
    const checkIcon = copyBtn.querySelector(".check-icon");

    copyIcon.style.display = "none";
    checkIcon.style.display = "inline";

    showToast("Copied!");

    setTimeout(() => {
      copyIcon.style.display = "inline";
      checkIcon.style.display = "none";
    }, 2000);

}
}

// Copy button handlers
inputCopyBtn.onclick = () => copyText(inputEl, inputCopyBtn);
outputCopyBtn.onclick = () => copyText(outputEl, outputCopyBtn);

// --- Toast Notification ---
function showToast(message) {
toast.textContent = message;
toast.classList.add("show");
setTimeout(() => toast.classList.remove("show"), 2000);
}

// --- Keyboard Shortcuts ---
document.addEventListener("keydown", (e) => {
// Encode/Decode shortcuts
if (e.ctrlKey && e.key === "Enter") {
e.preventDefault();
if (e.shiftKey) {
decodeBtn.click();
} else {
encodeBtn.click();
}
}
});

// --- Initialize ---
document.addEventListener("DOMContentLoaded", () => {
initTheme();
updateCharCount(inputEl, inputCount);
updateCharCount(outputEl, outputCount);
});
