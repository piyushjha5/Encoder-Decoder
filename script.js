const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const modeEl = document.getElementById("mode");
const encodeBtn = document.getElementById("encodeBtn");
const decodeBtn = document.getElementById("decodeBtn");

// --- Encode Handler ---
encodeBtn.onclick = () => {
  const text = inputEl.value;
  const mode = modeEl.value;

  try {
    let result = "";
    if (mode === "base64") {
      result = btoa(text);
    } else if (mode === "hex") {
      result = Array.from(new TextEncoder().encode(text))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } else if (mode === "url") {
      result = encodeURIComponent(text);
    } else if (mode === "html") {
      result = text.replace(
        /[^a-zA-Z0-9 ]/g,
        (c) => "&#" + c.charCodeAt(0) + ";"
      );
    }
    outputEl.value = result;
  } catch (e) {
    outputEl.value = `Encoding error: ${e.message}`;
  }
};

// --- Decode Handler ---
decodeBtn.onclick = () => {
  const text = inputEl.value;
  const mode = modeEl.value;

  try {
    let decoded = "";

    if (mode === "base64") {
      decoded = atob(text.trim());

      // Optional double decode if base64 result looks like URL-encoded
      if (decoded.includes("%")) {
        try {
          decoded = decodeURIComponent(decoded);
        } catch {}
      }
    } else if (mode === "hex") {
      if (text.length % 2 !== 0)
        throw new Error("Hex string length must be even");
      const bytes = text.match(/.{1,2}/g).map((h) => parseInt(h, 16));
      decoded = new TextDecoder().decode(new Uint8Array(bytes));
    } else if (mode === "url") {
      decoded = decodeURIComponent(text);
    } else if (mode === "html") {
      const doc = new DOMParser().parseFromString(text, "text/html");
      decoded = doc.documentElement.textContent || "";
    }

    try {
      const json = JSON.parse(decoded);
      outputEl.value = JSON.stringify(json, null, 2);
    } catch {
      outputEl.value = decoded;
    }
  } catch (e) {
    outputEl.value = `Decoding error: ${e.message}`;
  }
};

// --- Theme Toggle Logic ---
const themeToggleBtn = document.getElementById("themeToggle");

themeToggleBtn.onclick = () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
};

// --- Apply Saved Theme on Load ---
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }
});
