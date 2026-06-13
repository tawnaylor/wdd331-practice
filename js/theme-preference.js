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

    function buildToggleButton() {
        const button = document.createElement("button");
        const thumb = document.createElement("span");
        const label = document.createElement("span");

        button.type = "button";
        button.className = "theme-toggle";
        button.dataset.themeToggle = "";

        thumb.className = "theme-toggle__thumb";
        thumb.setAttribute("aria-hidden", "true");

        label.className = "theme-toggle__label";

        button.append(thumb, label);

        return button;
    }

    function mountToggle() {
        if (document.querySelector("[data-theme-toggle]")) {
            return;
        }

        const legacyMenus = document.querySelectorAll(".theme-menu");

        for (const legacyMenu of legacyMenus) {
            legacyMenu.remove();
        }

        const button = buildToggleButton();
        const nav = document.querySelector(".site-nav");

        if (nav) {
            button.classList.add("theme-toggle--nav");
            nav.append(button);
        } else {
            button.classList.add("theme-toggle--floating");
            document.body.prepend(button);
        }

        button.addEventListener("click", () => {
            const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
            const nextTheme = currentTheme === "dark" ? "light" : "dark";

            updatePreference(nextTheme);
        });
    }

    function syncControls(preference) {
        const resolvedTheme = getResolvedTheme(preference);
        const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
        const controls = document.querySelectorAll('[data-theme-toggle]');

        for (const control of controls) {
            const label = control.querySelector(".theme-toggle__label");

            control.dataset.themeActive = resolvedTheme;
            control.setAttribute("aria-pressed", String(resolvedTheme === "dark"));
            control.setAttribute("aria-label", `Current theme: ${resolvedTheme}. Switch to ${nextTheme} mode.`);
            control.title = `Switch to ${nextTheme} mode`;

            if (label) {
                label.textContent = resolvedTheme === "dark" ? "Dark mode" : "Light mode";
            }
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
        mountToggle();
        syncControls(initialPreference);
    });

    mediaQuery.addEventListener("change", () => {
        const preference = getStoredPreference();

        if (preference === "system") {
            applyPreference(preference);
            syncControls(preference);
        }
    });
})();