/**
 * FitMaster — Light / Dark Theme Toggle Engine
 * Stores preference in localStorage.
 * Works for base.html, dashboard_base.html, and all pages.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'fitmaster-theme';
  const LIGHT = 'light';
  const DARK  = 'dark';

  /* ── Apply theme immediately ── */
  function applyTheme(theme, save = true) {
    const validTheme = theme === LIGHT ? LIGHT : DARK;
    document.documentElement.setAttribute('data-theme', validTheme);
    if (save) {
      localStorage.setItem(STORAGE_KEY, validTheme);
    }

    // Update every toggle knob on the page
    document.querySelectorAll('.theme-toggle-knob').forEach(knob => {
      knob.textContent = validTheme === LIGHT ? '☀️' : '🌙';
    });

    // Update aria labels and tooltips
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      const label = validTheme === LIGHT ? 'Switch to Dark Mode' : 'Switch to Light Mode';
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });

    // Notify any components listening for theme changes (e.g. Chart.js, Three.js)
    window.dispatchEvent(new CustomEvent('fitmaster:themechange', { detail: { theme: validTheme } }));
  }

  /* ── Toggle between light / dark ── */
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || DARK;
    applyTheme(current === LIGHT ? DARK : LIGHT);
  }

  /* ── Load saved preference (default: dark) ── */
  function loadTheme() {
    const saved = localStorage.getItem(STORAGE_KEY) || DARK;
    applyTheme(saved, false);
  }

  /* ── Wire up all toggle buttons after DOM is ready ── */
  function wireButtons() {
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.removeEventListener('click', toggleTheme);
      btn.addEventListener('click', toggleTheme);
    });
    // Apply knob text now that DOM is ready
    const current = document.documentElement.getAttribute('data-theme') || DARK;
    document.querySelectorAll('.theme-toggle-knob').forEach(knob => {
      knob.textContent = current === LIGHT ? '☀️' : '🌙';
    });
  }

  /* ── Listen for cross-tab theme changes ── */
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      applyTheme(e.newValue, false);
    }
  });

  /* ── Run ── */
  // 1. Apply theme immediately to avoid FOUC
  loadTheme();

  // 2. Wire button clicks after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireButtons);
  } else {
    wireButtons();
  }

  // Expose helper globally
  window.FitMasterTheme = {
    get: () => document.documentElement.getAttribute('data-theme') || DARK,
    set: applyTheme,
    toggle: toggleTheme
  };

})();
