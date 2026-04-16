import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EraOverlay from "../components/EraOverlay";
import { eraPanels } from "../data/siteData";

beforeEach(() => {
    window.matchMedia =
        window.matchMedia ||
        (() => ({
            matches: false,
            media: "(max-width: 720px)",
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            addListener: jest.fn(),
            removeListener: jest.fn(),
            onchange: null,
            dispatchEvent: jest.fn(),
        }));
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("EraOverlay", () => {
    test("Escape closes detail view first before closing the full overlay", async () => {
        const onClose = jest.fn();

        jest.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        render(
            <EraOverlay
                era={eraPanels[0]}
                isOpen={true}
                onClose={onClose}
                onNavigateEra={jest.fn()}
                prevEraId={null}
                nextEraId={"1990s"}
            />
        );

        await userEvent.click(
            screen.getByRole("button", { name: /learn more about akira/i })
        );

        expect(await screen.findByRole("button", { name: /back to list/i })).toBeInTheDocument();

        await userEvent.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: /back to list/i })).not.toBeInTheDocument();
        });

        expect(screen.getByRole("button", { name: /learn more about akira/i })).toBeInTheDocument();
        expect(onClose).not.toHaveBeenCalled();
    });

    test("clicking the overlay backdrop closes the overlay", async () => {
        const onClose = jest.fn();

        jest.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => [],
        });

        render(
            <EraOverlay
                era={eraPanels[0]}
                isOpen={true}
                onClose={onClose}
                onNavigateEra={jest.fn()}
                prevEraId={null}
                nextEraId={"1990s"}
            />
        );

        await userEvent.click(screen.getByRole("dialog", { name: "1980s" }));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test("ignores stale fetch responses when switching series quickly", async () => {
        const resolvers = [];
        jest.spyOn(global, "fetch").mockImplementation(
            () =>
                new Promise((resolve) => {
                    resolvers.push(resolve);
                })
        );

        render(
            <EraOverlay
                era={eraPanels[0]}
                isOpen={true}
                onClose={jest.fn()}
                onNavigateEra={jest.fn()}
                prevEraId={null}
                nextEraId={"1990s"}
            />
        );

        await userEvent.click(
            screen.getByRole("button", { name: /learn more about akira/i })
        );

        await userEvent.click(screen.getByRole("button", { name: /back to list/i }));

        await userEvent.click(
            screen.getByRole("button", { name: /learn more about dragon ball/i })
        );

        expect(resolvers).toHaveLength(2);

        await act(async () => {
            resolvers[1]({
                ok: true,
                json: async () => [
                    {
                        title: "Dragon Ball",
                        studio: "Studio 2",
                        episodes: 153,
                        genre: "Action",
                    },
                ],
            });
        });

        expect(await screen.findByText(/studio 2/i)).toBeInTheDocument();

        await act(async () => {
            resolvers[0]({
                ok: true,
                json: async () => [
                    {
                        title: "Akira",
                        studio: "Studio 1",
                        episodes: 1,
                        genre: "Sci-Fi",
                    },
                ],
            });
        });

        await waitFor(() => {
            expect(screen.getByText(/studio 2/i)).toBeInTheDocument();
            expect(screen.queryByText(/studio 1/i)).not.toBeInTheDocument();
        });
    });
});
