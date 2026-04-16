import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Footer from "../components/Footer";
import { ThemeProvider } from "../context/ThemeContext";

jest.mock(
    "react-router-dom",
    () => ({
        Link: ({ to, children, ...rest }) => (
            <a href={to} {...rest}>
                {children}
            </a>
        )
    }),
    { virtual: true }
);

const renderFooter = () =>
    render(
        <ThemeProvider>
            <Footer />
        </ThemeProvider>
    );

describe("Footer component", () => {
    beforeEach(() => {
        window.localStorage.clear();
        document.body.classList.remove("theme-dark");
    });

    test("renders archive copy and footer navigation links", () => {
        renderFooter();

        expect(
            screen.getByText(/the japanese animation history archive/i)
        ).toBeInTheDocument();

        const aboutLink = screen.getByRole("link", { name: /^about$/i });
        const referencesLink = screen.getByRole("link", { name: /references/i });

        expect(aboutLink).toHaveAttribute("href", "/about");
        expect(referencesLink).toHaveAttribute("href", "/about#references");
    });

    test("toggles theme from light to dark", async () => {
        renderFooter();

        const themeToggle = screen.getByRole("button", {
            name: /switch to dark mode/i
        });

        expect(themeToggle).toHaveAttribute("aria-pressed", "false");

        await userEvent.click(themeToggle);

        expect(themeToggle).toHaveAttribute("aria-pressed", "true");
        expect(themeToggle).toHaveAccessibleName(/switch to light mode/i);
        expect(document.body).toHaveClass("theme-dark");
    });
});
