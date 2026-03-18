/**
 * QuietTube — Popup Script
 * Manages the toggle UI and persists settings via chrome.storage.sync.
 */

const globalToggle = document.getElementById("globalEnabled");
const featureToggles = document.querySelectorAll("[data-key]");

// ── Load saved settings ────────────────────────────────────

chrome.storage.sync.get(QT_DEFAULTS, (settings) => {
  globalToggle.checked = settings.globalEnabled;
  updateBodyClass(settings.globalEnabled);

  featureToggles.forEach((input) => {
    input.checked = settings[input.dataset.key];
  });
});

// ── Global toggle ──────────────────────────────────────────

globalToggle.addEventListener("change", () => {
  const enabled = globalToggle.checked;
  chrome.storage.sync.set({ globalEnabled: enabled });
  updateBodyClass(enabled);
});

function updateBodyClass(enabled) {
  document.body.classList.toggle("global-off", !enabled);
}

// ── Per-feature toggles ────────────────────────────────────

featureToggles.forEach((input) => {
  input.addEventListener("change", () => {
    chrome.storage.sync.set({ [input.dataset.key]: input.checked });
  });
});
