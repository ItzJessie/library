import { render, screen } from "@testing-library/react";
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
        NavLink: ({ to, children, className, ...props }) => {
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

describe("Header component", () => {
    beforeEach(() => {
        mockCurrentPathname = "/";
    });

    test("renders the brand and starts with the mobile menu closed", () => {
        render(<Header />);

        expect(
            screen.getByRole("link", { name: /japanese animation history archive home/i })
        ).toHaveAttribute("href", "/");
        expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
            "aria-expanded",
            "false"
        );
    });

    test("closes the menu when the route changes", async () => {
        const { rerender } = render(<Header />);

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        await userEvent.click(toggleButton);

        expect(toggleButton).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByRole("banner")).toHaveClass("nav-open");

        mockCurrentPathname = "/about";
        rerender(<Header />);

        expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
            "aria-expanded",
            "false"
        );
        expect(screen.getByRole("banner")).not.toHaveClass("nav-open");
    });

    test("opens search from the navigation and closes the menu", async () => {
        const onOpenSearch = jest.fn();

        render(<Header onOpenSearch={onOpenSearch} />);

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        await userEvent.click(toggleButton);

        await userEvent.click(screen.getByRole("button", { name: /open universal search/i }));

        expect(onOpenSearch).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("button", { name: /open menu/i })).toHaveAttribute(
            "aria-expanded",
            "false"
        );
    });
});
