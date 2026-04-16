import { render, screen } from "@testing-library/react";
import HomeArchiveCard from "../components/HomeArchiveCard";

jest.mock(
    "react-router-dom",
    () => ({
        Link: ({ to, children, ...rest }) => (
            <a href={typeof to === "string" ? to : "#"} {...rest}>
                {children}
            </a>
        )
    }),
    { virtual: true }
);

describe("HomeArchiveCard", () => {
    test("renders a clickable archive card with provided content", () => {
        render(
            <HomeArchiveCard
                title="Late 1980s"
                subtitle="Akira"
                detail="Genre-defining cyberpunk milestone."
                image="/images/akira.png"
                alt="Akira poster"
                to="/1980s"
                wide={true}
            />
        );

        const link = screen.getByRole("link", { name: /late 1980s/i });

        expect(link).toHaveAttribute("href", "/1980s");
        expect(screen.getByRole("heading", { name: /late 1980s/i })).toBeInTheDocument();
        expect(screen.getByText(/akira/i)).toBeInTheDocument();
        expect(screen.getByText(/genre-defining cyberpunk milestone/i)).toBeInTheDocument();
        expect(screen.getByAltText(/akira poster/i)).toHaveAttribute("src", "/images/akira.png");
        expect(link.querySelector(".archive-card")).toHaveClass("wide");
    });

    test("falls back to defaults when optional props are missing", () => {
        render(<HomeArchiveCard image="/images/placeholder.png" to="   " />);

        const link = screen.getByRole("link", { name: /archive entry/i });

        expect(link).toHaveAttribute("href", "/anime-eras");
        expect(screen.getByRole("heading", { name: /archive entry/i })).toBeInTheDocument();
        expect(screen.getByAltText(/archive entry artwork/i)).toBeInTheDocument();
        expect(screen.queryByText(/^undefined$/i)).not.toBeInTheDocument();
    });
});
