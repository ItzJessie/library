import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockCurrentPathname = "/";

jest.mock(
    "react-router-dom",
    () => ({
        Link: ({ to, children, ...props }) => (
            <a href={to} {...props}>
                {children}
            </a>
        ),
        NavLink: ({ to, children, className, end: _end, ...props }) => {
            const computedClass =
                typeof className === "function" ? className({ isActive: false }) : className;

            return (
                <a href={to} className={computedClass} {...props}>
                    {children}
                </a>
            );
        },
        useLocation: () => ({ pathname: mockCurrentPathname })
    }),
    { virtual: true }
);

import Header from "../components/header";
import { ThemeProvider } from "../context/ThemeContext";

const renderHeader = (props = {}) =>
    render(
        <ThemeProvider>
            <Header {...props} />
        </ThemeProvider>
    );

describe("Header component", () => {
    beforeEach(() => {
        mockCurrentPathname = "/";
        document.body.classList.remove("nav-menu-open");
    });

    test("renders the brand and starts with the mobile menu closed", () => {
        renderHeader();

        expect(
            screen.getByRole("link", { name: /japanese animation history archive home/i })
        ).toHaveAttribute("href", "/");
        expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
            "aria-expanded",
            "false"
        );
    });

    test("closes the menu when the route changes", async () => {
        const { rerender } = renderHeader();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        await userEvent.click(toggleButton);

        expect(toggleButton).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByRole("banner")).toHaveClass("nav-open");

        mockCurrentPathname = "/about";
        rerender(
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        );

        expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
            "aria-expanded",
            "false"
        );
        expect(screen.getByRole("banner")).not.toHaveClass("nav-open");
    });

    test("opens search from the navigation and closes the menu", async () => {
        const onOpenSearch = jest.fn();

        renderHeader({ onOpenSearch });

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        await userEvent.click(toggleButton);

        await userEvent.click(screen.getByRole("button", { name: /open universal search/i }));

        expect(onOpenSearch).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
            "aria-expanded",
            "false"
        );
    });

    test("locks scroll while mobile menu is open and unlocks when closed", async () => {
        renderHeader();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        await userEvent.click(toggleButton);

        expect(document.body).toHaveClass("nav-menu-open");

        await userEvent.click(screen.getByRole("button", { name: /close menu/i }));

        expect(document.body).not.toHaveClass("nav-menu-open");
    });

    test("closes the mobile menu when tapping outside the header", async () => {
        renderHeader();

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        await userEvent.click(toggleButton);

        expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute(
            "aria-expanded",
            "true"
        );

        act(() => {
            document.body.dispatchEvent(new Event("pointerdown", { bubbles: true }));
        });

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
                "aria-expanded",
                "false"
            );
        });
    });
});
