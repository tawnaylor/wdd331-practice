(() => {
    const storageKey = "theme-preference";
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function getStoredPreference() {
        const value = window.localStorage.getItem(storageKey);

        if (value === "light" || value === "dark" || value === "system") {
            return value;
        }

        return "system";
    }

    function getResolvedTheme(preference) {
        if (preference === "system") {
            return mediaQuery.matches ? "dark" : "light";
        }

        return preference;
    }

    function applyPreference(preference) {
        const resolvedTheme = getResolvedTheme(preference);

        document.documentElement.dataset.themePreference = preference;
        document.documentElement.dataset.theme = resolvedTheme;
    }

    function syncControls(preference) {
        const controls = document.querySelectorAll('input[name="theme-preference"]');

        for (const control of controls) {
            control.checked = control.value === preference;
        }
    }

    function updatePreference(preference) {
        window.localStorage.setItem(storageKey, preference);
        applyPreference(preference);
        syncControls(preference);
    }

    const initialPreference = getStoredPreference();
    applyPreference(initialPreference);

    document.addEventListener("DOMContentLoaded", () => {
        syncControls(initialPreference);

        const controls = document.querySelectorAll('input[name="theme-preference"]');

        for (const control of controls) {
            control.addEventListener("change", (event) => {
                updatePreference(event.target.value);
            });
        }
    });

    mediaQuery.addEventListener("change", () => {
        const preference = getStoredPreference();

        if (preference === "system") {
            applyPreference(preference);
            syncControls(preference);
        }
    });
})();