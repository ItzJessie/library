import { useTheme } from "../context/ThemeContext";
import "../css/ThemeToggle.css";

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            className="global-theme-toggle"
            type="button"
            onClick={toggleTheme}
            aria-pressed={isDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
            <span className="global-theme-toggle__label" aria-hidden="true">
                {isDarkMode ? "Light" : "Dark"}
            </span>
            <span className="global-theme-toggle__track" aria-hidden="true">
                <span className="global-theme-toggle__thumb"></span>
            </span>
        </button>
    );
};

export default ThemeToggle;
