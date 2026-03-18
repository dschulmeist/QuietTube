/**
 * QuietTube — Shared Configuration
 * Single source of truth for feature keys, CSS classes, and default settings.
 */

const QT_FEATURES = {
  homeFeed:  { key: "homeFeed",  cssClass: "qt-hide-home-feed" },
  sidebar:   { key: "sidebar",   cssClass: "qt-hide-sidebar" },
  endscreen: { key: "endscreen", cssClass: "qt-hide-endscreen" },
  shorts:    { key: "shorts",    cssClass: "qt-hide-shorts" },
  comments:  { key: "comments",  cssClass: "qt-hide-comments" },
  trending:  { key: "trending",  cssClass: "qt-hide-trending" },
  autoplay:  { key: "autoplay",  cssClass: "qt-hide-autoplay" },
};

const QT_DEFAULTS = {
  globalEnabled: true,
  homeFeed:   true,
  sidebar:    true,
  endscreen:  true,
  shorts:     true,
  comments:   true,
  trending:   true,
  autoplay:   true,
};
