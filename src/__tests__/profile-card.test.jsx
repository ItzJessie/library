import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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

import ProfileCard from "../components/ProfileCard";

const baseProfile = {
    name: "Hayao Miyazaki",
    role: "Director",
    meta: "Tokyo",
    image: "/images/miyazaki.png",
    affiliation: "Studio Ghibli",
    detail:
        "Castle in the Sky, My Neighbor Totoro, Kiki's Delivery Service and many other classics that shaped fantasy storytelling for anime fans worldwide.",
    related: ["Spirited Away", "Princess Mononoke"]
};

describe("ProfileCard", () => {
    test("renders creator card details, badges, quick stats, and related links", () => {
        render(
            <ProfileCard
                profile={baseProfile}
                type="creator"
                quickStats={{ worksCount: 2, yearsActive: "1984-present" }}
                badges={["Award Winner", "Trendsetter"]}
            />
        );

        expect(
            screen.getByText("Creator Name: Hayao Miyazaki")
        ).toBeInTheDocument();
        expect(screen.getByText("Director")).toBeInTheDocument();
        expect(screen.getByText("Studio Ghibli")).toBeInTheDocument();
        expect(screen.getByText("2 works")).toBeInTheDocument();
        expect(screen.getByText("1984-present")).toBeInTheDocument();

        expect(screen.getByText("Award Winner")).toBeInTheDocument();
        expect(screen.getByText("Trendsetter")).toBeInTheDocument();

        expect(screen.getByRole("link", { name: "Spirited Away" })).toHaveAttribute(
            "href",
            "/all-influential-series"
        );
    });

    test("separates nested action clicks from card click", async () => {
        const onClick = jest.fn();
        const onDeepDive = jest.fn();
        const onToggleCompare = jest.fn();

        const { container } = render(
            <ProfileCard
                profile={baseProfile}
                type="creator"
                onClick={onClick}
                onDeepDive={onDeepDive}
                onToggleCompare={onToggleCompare}
            />
        );

        const card = container.querySelector("article");
        expect(card).not.toBeNull();

        await userEvent.click(card);
        expect(onClick).toHaveBeenCalledTimes(1);

        await userEvent.click(screen.getByRole("button", { name: "Deep Dive" }));
        expect(onDeepDive).toHaveBeenCalledWith(baseProfile, "creator");
        expect(onClick).toHaveBeenCalledTimes(1);

        await userEvent.click(screen.getByRole("button", { name: "Compare" }));
        expect(onToggleCompare).toHaveBeenCalledWith(baseProfile, "creator");
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test("supports keyboard activation only from card focus", () => {
        const onClick = jest.fn();

        const { container } = render(
            <ProfileCard profile={baseProfile} type="creator" onClick={onClick} />
        );

        const card = container.querySelector("article");
        expect(card).not.toBeNull();
        fireEvent.keyDown(card, { key: "Enter" });
        expect(onClick).toHaveBeenCalledTimes(1);

        const deepDiveBtn = screen.getByRole("button", { name: "Deep Dive" });
        fireEvent.keyDown(deepDiveBtn, { key: "Enter" });
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test("collapses details on mobile and expands related content", () => {
        const longProfile = {
            ...baseProfile,
            detail: "A".repeat(130)
        };

        const { rerender } = render(
            <ProfileCard profile={longProfile} type="creator" isMobile />
        );

        const bodyText = screen.getByText(/Notable Works:/).textContent;
        expect(bodyText.endsWith("...")).toBe(true);
        expect(screen.queryByText("Related series:")).not.toBeInTheDocument();

        rerender(<ProfileCard profile={longProfile} type="creator" isMobile isExpanded />);
        expect(screen.getByText("Related series:")).toBeInTheDocument();
    });

    test("handles missing profile fields with safe defaults", () => {
        expect(() =>
            render(
                <ProfileCard
                    profile={{ related: [] }}
                    type="studio"
                    badges={null}
                    quickStats={{ worksCount: 0, yearsActive: null }}
                />
            )
        ).not.toThrow();

        expect(screen.getByText("Studio Name: Unknown")).toBeInTheDocument();
        expect(screen.getByText("0 works")).toBeInTheDocument();
        expect(screen.getByText("N/A")).toBeInTheDocument();
    });
});
