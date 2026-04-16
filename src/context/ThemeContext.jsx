import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(undefined);
const THEME_STORAGE_KEY = "theme";

const readStoredTheme = () => {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
        return storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
    } catch {
        return null;
    }
};

const getSystemTheme = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getPreferredTheme = () => {
    return readStoredTheme() ?? getSystemTheme();
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(getPreferredTheme);

    useEffect(() => {
        const isDark = theme === "dark";

        document.body.classList.toggle("theme-dark", isDark);
        document.documentElement.setAttribute("data-theme", theme);
        document.documentElement.style.colorScheme = isDark ? "dark" : "light";

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
            // Ignore storage failures (for example in private browsing modes).
        }
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            isDarkMode: theme === "dark",
            setTheme,
            toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark"))
        }),
        [theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider.");
    }

    return context;
};
