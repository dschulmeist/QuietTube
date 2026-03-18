/**
 * QuietTube — Content Script
 *
 * Reads settings from chrome.storage.sync, applies CSS classes to <html>,
 * and handles autoplay suppression + Shorts redirection.
 * Listens for setting changes in real time.
 */

function applySettings(settings) {
  const s = { ...QT_DEFAULTS, ...settings };
  const root = document.documentElement;

  for (const feature of Object.values(QT_FEATURES)) {
    root.classList.toggle(feature.cssClass, s.globalEnabled && s[feature.key]);
  }

  if (s.globalEnabled && s.autoplay) {
    disableAutoplay();
  }
}

// --- Autoplay suppression ---------------------------------------------------

function disableAutoplay() {
  const toggle = document.querySelector(
    '.ytp-autonav-toggle-button[aria-checked="true"]'
  );
  if (toggle) toggle.click();
}

// Debounced observer — YouTube's SPA triggers many rapid DOM mutations.
// We batch them so autoplay is only checked once per burst.
let autoplayTimer = null;

function observeAutoplay() {
  const observer = new MutationObserver(() => {
    if (autoplayTimer) return;
    autoplayTimer = setTimeout(() => {
      autoplayTimer = null;
      chrome.storage.sync.get(QT_DEFAULTS, (settings) => {
        if (settings.globalEnabled && settings.autoplay) {
          disableAutoplay();
        }
      });
    }, 300);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// --- Shorts redirect --------------------------------------------------------

function redirectShorts() {
  chrome.storage.sync.get(QT_DEFAULTS, (settings) => {
    if (!settings.globalEnabled || !settings.shorts) return;

    const path = window.location.pathname;
    if (path.startsWith("/shorts/")) {
      const videoId = path.split("/shorts/")[1]?.split("?")[0];
      if (videoId) {
        window.location.replace(`https://www.youtube.com/watch?v=${videoId}`);
      }
    }
  });
}

// --- Init -------------------------------------------------------------------

chrome.storage.sync.get(QT_DEFAULTS, applySettings);

chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "sync") return;
  chrome.storage.sync.get(QT_DEFAULTS, applySettings);
});

// YouTube is a SPA — re-apply on navigation
document.addEventListener("yt-navigate-finish", () => {
  chrome.storage.sync.get(QT_DEFAULTS, applySettings);
  redirectShorts();
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    redirectShorts();
    observeAutoplay();
  });
} else {
  redirectShorts();
  observeAutoplay();
}
