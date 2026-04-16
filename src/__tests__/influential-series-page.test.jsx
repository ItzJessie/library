import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import InfluentialSeries from "../pages/InfluentialSeries";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate
}));

jest.mock("../hooks/useEraInteractions", () => ({
    useEraInteractions: () => {}
}));

jest.mock("../components/Slideshow", () => {
    const MockSlideshow = ({ slides = [] }) => (
        <div data-testid="mock-slideshow">
            {slides.map((series) => (
                <article className="carousel-card" key={series.id}>
                    <h2>{series.title}</h2>
                </article>
            ))}
        </div>
    );

    return {
        __esModule: true,
        default: MockSlideshow
    };
});

jest.mock("../components/SeriesListCard", () => {
    const MockSeriesListCard = ({ series }) => (
        <article className="series-card" id={series.id}>
            <span>{series.title}</span>
        </article>
    );

    return {
        __esModule: true,
        default: MockSeriesListCard
    };
});

const renderPage = () =>
    render(
        <MemoryRouter>
            <InfluentialSeries />
        </MemoryRouter>
    );

describe("InfluentialSeries page", () => {
    beforeEach(() => {
        mockNavigate.mockClear();
    });

    test("renders core page sections", () => {
        renderPage();

        expect(
            screen.getByRole("heading", { name: /influential series/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /archive highlights/i })
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /see all/i })).toHaveAttribute(
            "href",
            "/all-influential-series"
        );
    });

    test("shows no results when search only matches hidden archive entries", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("tab", { name: /modern hits/i }));
        await user.type(screen.getByPlaceholderText(/search anime/i), "vinland");

        expect(screen.getByText(/no anime found matching/i)).toBeInTheDocument();
        expect(screen.getByText(/vinland/i)).toBeInTheDocument();
    });

    test("search suggestion navigation uses canonical series ids", async () => {
        const user = userEvent.setup();
        renderPage();

        await user.type(screen.getByPlaceholderText(/search anime/i), "pokemon");
        await user.click(screen.getByRole("button", { name: "Pokemon" }));

        expect(mockNavigate).toHaveBeenCalledWith(
            "/all-influential-series#series-pokemon"
        );
    });
});
