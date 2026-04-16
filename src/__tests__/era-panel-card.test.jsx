import { fireEvent, render, screen } from "@testing-library/react";

jest.mock(
    "react-router-dom",
    () => ({
        Link: ({ to, children, ...props }) => (
            <a href={typeof to === "string" ? to : "#"} {...props}>
                {children}
            </a>
        )
    }),
    { virtual: true }
);

import EraPanelCard from "../components/EraPanelCard";

describe("EraPanelCard", () => {
    test("renders era details and deep links related series", () => {
        render(
            <EraPanelCard
                era={{
                    id: "1980s",
                    image: "images/1980s img.png",
                    blurb: "Anime gains global popularity.",
                    featured: "City Hunter",
                    years: "1985-1991",
                    related: ["Akira", "Dragon Ball"]
                }}
            />
        );

        expect(screen.getByRole("heading", { name: "1980s" })).toBeInTheDocument();
        expect(screen.getByText("Anime gains global popularity.")).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Akira" })).toHaveAttribute(
            "href",
            "/all-influential-series#series-akira"
        );
        expect(screen.getByRole("link", { name: "Dragon Ball" })).toHaveAttribute(
            "href",
            "/all-influential-series#series-dragon-ball"
        );
    });

    test("clears the loading state after the image loads or errors", () => {
        render(
            <EraPanelCard
                era={{
                    id: "1990s",
                    image: "images/1990s img.png",
                    related: []
                }}
            />
        );

        const image = screen.getByAltText("Anime from the 1990s");

        expect(image).toHaveClass("loading");

        fireEvent.error(image);

        expect(image).not.toHaveClass("loading");
        expect(screen.getByText("None listed")).toBeInTheDocument();
    });
});