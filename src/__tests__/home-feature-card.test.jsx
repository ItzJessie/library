import { render, screen } from "@testing-library/react";
import HomeFeatureCard from "../components/HomeFeatureCard";

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

describe("HomeFeatureCard", () => {
    test("renders a clickable feature card with provided content", () => {
        render(
            <HomeFeatureCard
                title="Popular Animation"
                period="Mid 1980s"
                meta="The rise of iconic sci-fi and action anime."
                image="/images/feature-1.png"
                alt="Popular animation still"
                toneClass="gold-1"
                to="/1980s"
            />
        );

        const link = screen.getByRole("link", { name: /popular animation/i });

        expect(link).toHaveAttribute("href", "/1980s");
        expect(screen.getByRole("heading", { name: /popular animation/i })).toBeInTheDocument();
        expect(screen.getByText(/mid 1980s/i)).toBeInTheDocument();
        expect(screen.getByText(/the rise of iconic sci-fi and action anime/i)).toBeInTheDocument();
        expect(screen.getByAltText(/popular animation still/i)).toHaveAttribute("src", "/images/feature-1.png");
        expect(link.querySelector(".era-card")).toHaveClass("gold-1");
        expect(screen.getByText(/^open/i)).toBeInTheDocument();
    });

    test("falls back to defaults when optional props are missing", () => {
        render(<HomeFeatureCard image="/images/placeholder.png" to="   " toneClass={null} />);

        const link = screen.getByRole("link", { name: /featured entry/i });

        expect(link).toHaveAttribute("href", "/anime-eras");
        expect(screen.getByRole("heading", { name: /featured entry/i })).toBeInTheDocument();
        expect(screen.getByAltText(/featured entry artwork/i)).toBeInTheDocument();
        expect(screen.queryByText(/^undefined$/i)).not.toBeInTheDocument();
        expect(link.querySelector(".era-card")).not.toHaveClass("null");
    });
});
