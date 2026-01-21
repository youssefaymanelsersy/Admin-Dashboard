const THEME_KEY = "theme";

export function getTheme() {
    return localStorage.getItem(THEME_KEY) || "light";
}

export function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);

    if (theme === "dark") {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
}

export function toggleTheme() {
    const current = getTheme();
    const next = current === "dark" ? "light" : "dark";
    setTheme(next);
}
