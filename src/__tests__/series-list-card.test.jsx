import { fireEvent, render, screen } from "@testing-library/react";
import SeriesListCard from "../components/SeriesListCard";

describe("SeriesListCard", () => {
    const baseSeries = {
        id: "series-naruto",
        title: "Naruto",
        image: "/images/naruto.jpg",
        year: 2002,
        studio: "Pierrot",
        episodes: 220,
        genre: "Action",
        synopsis: "A young ninja seeks recognition from his peers."
    };

    test("renders full default card details", () => {
        render(<SeriesListCard series={baseSeries} />);

        expect(screen.getByRole("heading", { name: "Naruto" })).toBeInTheDocument();
        expect(screen.getByText(/release:/i)).toBeInTheDocument();
        expect(screen.getByText(/studio:/i)).toBeInTheDocument();
        expect(screen.getByText(/episodes:/i)).toBeInTheDocument();
        expect(screen.getByText(/genre:/i)).toBeInTheDocument();
        expect(screen.getByAltText("Naruto")).toHaveAttribute("src", "/images/naruto.jpg");
    });

    test("renders compact layout when compact is true", () => {
        const { container } = render(<SeriesListCard series={baseSeries} compact />);

        expect(container.querySelector(".carousel-card")).toBeInTheDocument();
        expect(screen.getByText("Naruto")).toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: "Naruto" })).not.toBeInTheDocument();
    });

    test("renders archive featured card and forwards interactive props", () => {
        const handleClick = jest.fn();
        const handleKeyDown = jest.fn();

        const { container } = render(
            <SeriesListCard
                series={baseSeries}
                variant="archive"
                featured
                animated
                interactive={{
                    role: "link",
                    tabIndex: 0,
                    ariaLabel: "Open Naruto in archive",
                    onClick: handleClick,
                    onKeyDown: handleKeyDown
                }}
            />
        );

        const interactiveCard = screen.getByRole("link", { name: "Open Naruto in archive" });

        fireEvent.click(interactiveCard);
        fireEvent.keyDown(interactiveCard, { key: "Enter" });

        expect(handleClick).toHaveBeenCalledTimes(1);
        expect(handleKeyDown).toHaveBeenCalledTimes(1);
        expect(container.querySelector(".series-card--featured")).toBeInTheDocument();
        expect(container.querySelector(".series-card--animated")).toBeInTheDocument();
        expect(screen.getByText(/influence score:/i)).toBeInTheDocument();
    });

    test("renders archive compact card without featured panel", () => {
        const { container } = render(<SeriesListCard series={baseSeries} variant="archive" />);

        expect(container.querySelector(".series-card--compact")).toBeInTheDocument();
        expect(container.querySelector(".series-featured-panel")).not.toBeInTheDocument();
    });

    test("handles missing data without crashing", () => {
        render(<SeriesListCard series={{}} variant="archive" featured />);

        expect(screen.getByAltText("Untitled Series")).toBeInTheDocument();
        expect(screen.getByText(/unknown/i)).toBeInTheDocument();
        expect(screen.getByText(/synopsis coming soon/i)).toBeInTheDocument();
    });
});
