import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock(
    "react-router-dom",
    () => ({
        Link: ({ to, children, ...props }) => (
            <a href={to} {...props}>
                {children}
            </a>
        )
    }),
    { virtual: true }
);

jest.mock("../data/animeSeries.json", () => [
    {
        _id: "1",
        title: "Spirited Away",
        year: 2001,
        studio: "Studio Ghibli",
        era: "2000s",
        genre: "Fantasy, Adventure",
        episodes: 1,
        synopsis: "A young girl enters a mysterious spirit world.",
        img_name: "images/spirited-away.jpg"
    },
    {
        _id: "2",
        title: "Death Note",
        year: 2006,
        studio: "Madhouse",
        era: "2000s",
        genre: "Psychological, Thriller",
        episodes: 37,
        synopsis: "A student obtains a deadly notebook.",
        img_name: "images/death-note.jpg"
    }
]);

jest.mock("../data/studiosCreators.json", () => ({
    studios: [
        {
            name: "Studio Ghibli",
            meta: "Era: 1980s-2000s; Features hand-drawn style",
            detail: "Known for emotionally resonant fantasy films.",
            image: "images/ghibli.jpg",
            related: ["Hayao Miyazaki"]
        }
    ],
    creators: [
        {
            name: "Hayao Miyazaki",
            role: "Director",
            detail: "Co-founder of Studio Ghibli.",
            image: "images/miyazaki.jpg",
            related: ["Studio Ghibli"]
        }
    ]
}));

jest.mock("../data/siteData", () => ({
    eraPanels: [
        {
            id: "2000s",
            years: "2000-2009",
            blurb: "Digital workflows and global expansion.",
            image: "images/2000s.jpg",
            related: ["Spirited Away"]
        }
    ]
}));

import UniversalSearchOverlay from "../components/UniversalSearchOverlay";

describe("UniversalSearchOverlay component", () => {
    test("does not render when closed", () => {
        render(<UniversalSearchOverlay isOpen={false} onClose={jest.fn()} />);

        expect(
            screen.queryByRole("dialog", { name: /universal anime search/i })
        ).not.toBeInTheDocument();
    });

    test("publishes preview state when opened and closed", async () => {
        const onPreviewUpdate = jest.fn();
        const { rerender } = render(
            <UniversalSearchOverlay
                isOpen={true}
                onClose={jest.fn()}
                onPreviewUpdate={onPreviewUpdate}
            />
        );

        await waitFor(() => {
            expect(onPreviewUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    isOpen: true,
                    query: "",
                    results: expect.any(Array)
                })
            );
        });

        rerender(
            <UniversalSearchOverlay
                isOpen={false}
                onClose={jest.fn()}
                onPreviewUpdate={onPreviewUpdate}
            />
        );

        await waitFor(() => {
            expect(onPreviewUpdate).toHaveBeenCalledWith({
                isOpen: false,
                query: "",
                results: []
            });
        });
    });

    test("supports suggestion keyboard selection", async () => {
        render(<UniversalSearchOverlay isOpen={true} onClose={jest.fn()} />);

        const input = screen.getByRole("searchbox", { name: /universal search/i });
        await userEvent.type(input, "spir");

        const suggestionList = screen.getByRole("listbox", {
            name: /predictive suggestions/i
        });
        expect(within(suggestionList).getByText("Spirited Away")).toBeInTheDocument();

        await userEvent.keyboard("{ArrowDown}{Enter}");

        expect(input).toHaveValue("Spirited Away");
    });

    test("closes on escape", async () => {
        const onClose = jest.fn();

        render(<UniversalSearchOverlay isOpen={true} onClose={onClose} />);

        await userEvent.keyboard("{Escape}");

        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
