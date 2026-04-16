import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "../components/ThemeToggle";
import { ThemeProvider } from "../context/ThemeContext";

const renderThemeToggle = () =>
    render(
        <ThemeProvider>
            <ThemeToggle />
        </ThemeProvider>
    );

describe("ThemeToggle component", () => {
    beforeEach(() => {
        window.localStorage.clear();
        document.body.classList.remove("theme-dark");
        document.documentElement.removeAttribute("data-theme");
        document.documentElement.style.colorScheme = "";
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders in light mode by default", () => {
        renderThemeToggle();

        const button = screen.getByRole("button", { name: /switch to dark mode/i });

        expect(button).toHaveAttribute("aria-pressed", "false");
        expect(document.body).not.toHaveClass("theme-dark");
        expect(document.documentElement).toHaveAttribute("data-theme", "light");
        expect(window.localStorage.getItem("theme")).toBe("light");
    });

    test("respects previously saved dark mode preference", () => {
        window.localStorage.setItem("theme", "dark");

        renderThemeToggle();

        const button = screen.getByRole("button", { name: /switch to light mode/i });

        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(document.body).toHaveClass("theme-dark");
        expect(document.documentElement).toHaveAttribute("data-theme", "dark");
    });

    test("toggles between light and dark modes", async () => {
        renderThemeToggle();

        const button = screen.getByRole("button", { name: /switch to dark mode/i });

        await userEvent.click(button);

        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(button).toHaveAccessibleName(/switch to light mode/i);
        expect(document.body).toHaveClass("theme-dark");
        expect(document.documentElement).toHaveAttribute("data-theme", "dark");
        expect(window.localStorage.getItem("theme")).toBe("dark");

        await userEvent.click(button);

        expect(button).toHaveAttribute("aria-pressed", "false");
        expect(button).toHaveAccessibleName(/switch to dark mode/i);
        expect(document.body).not.toHaveClass("theme-dark");
        expect(document.documentElement).toHaveAttribute("data-theme", "light");
        expect(window.localStorage.getItem("theme")).toBe("light");
    });

    test("keeps working when localStorage setItem throws", async () => {
        const setItemSpy = jest
            .spyOn(Object.getPrototypeOf(window.localStorage), "setItem")
            .mockImplementation(() => {
                throw new Error("Storage blocked");
            });

        renderThemeToggle();

        const button = screen.getByRole("button", { name: /switch to dark mode/i });

        await userEvent.click(button);

        expect(button).toHaveAttribute("aria-pressed", "true");
        expect(document.body).toHaveClass("theme-dark");
        expect(setItemSpy).toHaveBeenCalled();
    });
});
