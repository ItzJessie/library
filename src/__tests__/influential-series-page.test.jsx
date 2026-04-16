import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InfluentialSeries from "../pages/InfluentialSeries";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    MemoryRouter: ({ children }) => <div>{children}</div>,
    Link: ({ to, children, ...props }) => (
        <a href={to} {...props}>
            {children}
        </a>
    ),
    useNavigate: () => mockNavigate
}), { virtual: true });

import { MemoryRouter } from "react-router-dom";

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
        renderPage();

        await userEvent.click(screen.getByRole("tab", { name: /modern hits/i }));
        await userEvent.type(screen.getByPlaceholderText(/search anime/i), "one piece");

        expect(screen.getByText(/no anime found matching/i)).toBeInTheDocument();
    });

    test("search suggestion navigation uses canonical series ids", async () => {
        renderPage();

        await userEvent.type(screen.getByPlaceholderText(/search anime/i), "pokemon");
        await userEvent.click(screen.getByRole("button", { name: "Pokemon" }));

        expect(mockNavigate).toHaveBeenCalledWith(
            "/all-influential-series#series-pokemon"
        );
    });
});
