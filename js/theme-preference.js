/**
 * theme-preference.js
 * Loaded synchronously in <head> (no defer/async) so the theme is applied
 * before first paint — that's why every page uses
 * <script src="js/theme-preference.js"></script>, not <script defer>.
 */
(function () {
  var STORAGE_KEY = "theme-preference";
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function systemPrefersDark() {
    return media.matches;
  }

  function applyTheme(pref) {
    if (pref === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (pref === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.setAttribute("data-theme", systemPrefersDark() ? "dark" : "light");
    }
  }

  function getStoredPreference() {
    var stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system";
  }

  function setPreference(pref) {
    localStorage.setItem(STORAGE_KEY, pref);
    applyTheme(pref);
    syncRadios(pref);
  }

  function syncRadios(pref) {
    var inputs = document.querySelectorAll('input[name="theme"]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].checked = inputs[i].value === pref;
    }
  }

  var currentPreference = getStoredPreference();
  applyTheme(currentPreference);

  media.addEventListener("change", function () {
    if (getStoredPreference() === "system") {
      applyTheme("system");
    }
  });

  document.addEventListener("DOMContentLoaded", function () {
    syncRadios(currentPreference);
    var inputs = document.querySelectorAll('input[name="theme"]');
    for (var i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("change", function (e) {
        setPreference(e.target.value);
      });
    }
  });
})();