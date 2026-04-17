import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

const ThemeContext = createContext(undefined);
const THEME_STORAGE_KEY = "theme";
const THEME_TRANSITION_MS = 180;
const THEME_TRANSITION_CLASS = "theme-transitioning";

const shouldAnimateThemeTransition = () => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }

    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

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
    const transitionTimeoutRef = useRef(null);

    const runThemeTransitionWindow = useCallback(() => {
        if (!shouldAnimateThemeTransition()) {
            return;
        }

        if (transitionTimeoutRef.current) {
            window.clearTimeout(transitionTimeoutRef.current);
            transitionTimeoutRef.current = null;
        }

        document.documentElement.style.setProperty(
            "--theme-transition-ms",
            `${THEME_TRANSITION_MS}ms`
        );
        document.documentElement.classList.add(THEME_TRANSITION_CLASS);
        document.body.classList.add(THEME_TRANSITION_CLASS);

        transitionTimeoutRef.current = window.setTimeout(() => {
            document.documentElement.classList.remove(THEME_TRANSITION_CLASS);
            document.body.classList.remove(THEME_TRANSITION_CLASS);
            transitionTimeoutRef.current = null;
        }, THEME_TRANSITION_MS);
    }, []);

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

    useEffect(
        () => () => {
            if (transitionTimeoutRef.current) {
                window.clearTimeout(transitionTimeoutRef.current);
                transitionTimeoutRef.current = null;
            }

            document.documentElement.classList.remove(THEME_TRANSITION_CLASS);
            document.body.classList.remove(THEME_TRANSITION_CLASS);
        },
        []
    );

    const toggleTheme = useCallback(() => {
        runThemeTransitionWindow();
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, [runThemeTransitionWindow]);

    const value = useMemo(
        () => ({
            theme,
            isDarkMode: theme === "dark",
            setTheme,
            toggleTheme
        }),
        [theme, toggleTheme]
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
