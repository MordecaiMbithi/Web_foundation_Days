// DOM Element Selectors
const noteTextarea = document.getElementById("note-text");
const charCountElement = document.getElementById("char-count");
const wordCountElement = document.getElementById("word-count");
const clearButton = document.getElementById("clear-btn");
const themeToggleButton = document.getElementById("theme-toggle");

const DRAFT_STORAGE_KEY = "quicknotes_draft";
const THEME_STORAGE_KEY = "quicknotes_theme";

/**
 * Updates the character and word displays, applying warning and over classes.
 */
function updateCounts() {
  const text = noteTextarea.value;
  const charLength = text.length;

  // 1. Character count display & alerts
  charCountElement.textContent = `${charLength} / 200 characters`;
  charCountElement.classList.remove("warning", "over");

  if (charLength > 200) {
    charCountElement.classList.add("over");
  } else if (charLength > 180) {
    charCountElement.classList.add("warning");
  }

  // 2. Word count display
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  const wordCount = words.length;
  wordCountElement.textContent = `${wordCount} ${wordCount === 1 ? "word" : "words"}`;
}

/**
 * Resets the editor content, removes saved draft from localStorage, and updates UI.
 */
function clearEditor() {
  noteTextarea.value = "";
  localStorage.removeItem(DRAFT_STORAGE_KEY);
  updateCounts();
  noteTextarea.focus();
}

/**
 * Toggles dark mode class, updates button label, and stores preference.
 */
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  themeToggleButton.textContent = isDark ? "Light mode" : "Dark mode";
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
}

// --- Event Listeners ---

// Update counts & persist draft on every input
noteTextarea.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem(DRAFT_STORAGE_KEY, noteTextarea.value);
});

// Clear editor on button click
clearButton.addEventListener("click", clearEditor);

// Clear editor on Escape key press inside the textarea
noteTextarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearEditor();
  }
});

// Theme switcher button
themeToggleButton.addEventListener("click", toggleTheme);

// --- Initialization on Page Load ---
window.addEventListener("DOMContentLoaded", () => {
  // Restore saved theme
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggleButton.textContent = "Light mode";
  } else {
    themeToggleButton.textContent = "Dark mode";
  }

  // Restore saved draft
  const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
  if (savedDraft !== null) {
    noteTextarea.value = savedDraft;
  }

  // Synchronize count UI
  updateCounts();
});