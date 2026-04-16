import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockCurrentPathname = "/";

jest.mock(
    "react-router-dom",
    () => ({
        NavLink: ({ to, end, children, className, ...props }) => {
            const pathname = mockCurrentPathname;
            const isRootLink = to === "/";
            const isActive = isRootLink
                ? end
                    ? pathname === "/"
                    : pathname.startsWith("/")
                : pathname === to || pathname.startsWith(`${to}/`);

            const computedClass =
                typeof className === "function" ? className({ isActive }) : className;

            return (
                <a href={to} className={computedClass} {...props}>
                    {children}
                </a>
            );
        }
    }),
    { virtual: true }
);

import Navigation from "../components/Navigation";

describe("Navigation component", () => {
    beforeEach(() => {
        mockCurrentPathname = "/";
    });

    test("renders all primary navigation links", () => {
        render(<Navigation />);

        expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
        expect(screen.getByRole("link", { name: "Anime Eras" })).toHaveAttribute(
            "href",
            "/anime-eras"
        );
        expect(screen.getByRole("link", { name: "Studios & Creators" })).toHaveAttribute(
            "href",
            "/studios-creators"
        );
        expect(screen.getByRole("link", { name: "Influential Series" })).toHaveAttribute(
            "href",
            "/influential-series"
        );
        expect(screen.getByRole("link", { name: "User Feedback Page" })).toHaveAttribute(
            "href",
            "/user-feedback"
        );
        expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
        expect(screen.getByRole("button", { name: /open universal search/i })).toBeInTheDocument();
    });

    test("marks only the matching route as active", () => {
        mockCurrentPathname = "/about";
        render(<Navigation />);

        expect(screen.getByRole("link", { name: "About" })).toHaveClass("is-active");
        expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass("is-active");
    });

    test("runs both callbacks when search trigger is clicked", async () => {
        const onNavigate = jest.fn();
        const onOpenSearch = jest.fn();

        render(<Navigation onNavigate={onNavigate} onOpenSearch={onOpenSearch} />);

        await userEvent.click(screen.getByRole("button", { name: /open universal search/i }));

        expect(onOpenSearch).toHaveBeenCalledTimes(1);
        expect(onNavigate).toHaveBeenCalledTimes(1);
    });

    test("does not throw when callback props are omitted", async () => {
        render(<Navigation />);

        expect(() => {
            userEvent.click(screen.getByRole("button", { name: /open universal search/i }));
        }).not.toThrow();
    });
});
