import { render, screen, waitFor, within } from "@testing-library/react";
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

import StudiosCreators from "../pages/StudiosCreators";

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
            dispatchEvent: jest.fn()
        }));
});

describe("StudiosCreators page", () => {
    test("shows fallback dataset when studios-creators API is unavailable", async () => {
        const fetchMock = jest.spyOn(global, "fetch").mockImplementation((url) => {
            if (String(url).includes("/api/studios-creators")) {
                return Promise.resolve({ ok: false, json: async () => ({}) });
            }

            return Promise.resolve({ ok: true, json: async () => ({ results: [] }) });
        });

        render(<StudiosCreators />);

        expect(await screen.findByText(/studio name: studio ghibli/i)).toBeInTheDocument();
        expect(screen.getByText(/studio name: mappa/i)).toBeInTheDocument();

        fetchMock.mockRestore();
    });

    test("lets users compare two studios", async () => {
        const fetchMock = jest.spyOn(global, "fetch").mockImplementation((url) => {
            if (String(url).includes("/api/studios-creators")) {
                return Promise.resolve({ ok: false, json: async () => ({}) });
            }

            return Promise.resolve({ ok: true, json: async () => ({ results: [] }) });
        });

        render(<StudiosCreators />);

        await screen.findByText(/studio name: wit studio/i);

        const compareButtons = screen.getAllByRole("button", { name: /^compare$/i });
        await userEvent.click(compareButtons[0]);
        await userEvent.click(compareButtons[1]);

        expect(await screen.findByText(/two profiles selected/i)).toBeInTheDocument();

        fetchMock.mockRestore();
    });

    test("opens deep dive and falls back to local connected anime on request failure", async () => {
        const fetchMock = jest.spyOn(global, "fetch").mockImplementation((url) => {
            if (String(url).includes("/api/studios-creators")) {
                return Promise.resolve({ ok: false, json: async () => ({}) });
            }

            if (String(url).includes("/api/connected-anime")) {
                return Promise.reject(new Error("network unavailable"));
            }

            return Promise.resolve({ ok: true, json: async () => ({}) });
        });

        render(<StudiosCreators />);

        await screen.findByText(/studio name: wit studio/i);

        await userEvent.click(screen.getAllByRole("button", { name: /deep dive/i })[0]);

        const dialog = await screen.findByRole("dialog");
        expect(dialog).toBeInTheDocument();

        await waitFor(() => {
            expect(within(dialog).queryByText(/loading connected anime/i)).not.toBeInTheDocument();
        });

        await waitFor(() => {
            expect(within(dialog).getByText(/attack on titan/i, { selector: "span" })).toBeInTheDocument();
        });

        fetchMock.mockRestore();
    });
});
