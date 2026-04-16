import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DecadePage from "../pages/DecadePage";

let mockDecade = "1980s";

jest.mock(
    "react-router-dom",
    () => ({
        Link: ({ to, children, ...props }) => (
            <a href={typeof to === "string" ? to : "#"} {...props}>
                {children}
            </a>
        ),
        Navigate: () => null,
        useNavigate: () => jest.fn(),
        useParams: () => ({ decade: mockDecade }),
    }),
    { virtual: true }
);

const renderDecadePage = (decade = "1980s") => {
    mockDecade = decade;
    return render(<DecadePage />);
};

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

    jest.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => [],
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("DecadePage", () => {
    test("connections toggle is independent from why it matters", async () => {
        renderDecadePage("1980s");

        const connectionsHeading = await screen.findByRole("heading", { name: /connections/i });
        const connectionsCard = connectionsHeading.closest("article");
        const connectionsToggle = within(connectionsCard).getByRole("button");

        await userEvent.click(connectionsToggle);

        expect(within(connectionsCard).queryByRole("list")).not.toBeInTheDocument();
        expect(document.querySelector("#era-impact-content")).toBeInTheDocument();
    });

    test("series modal closes on escape key", async () => {
        renderDecadePage("1980s");

        const learnMoreButtons = await screen.findAllByRole("button", { name: /learn more/i });
        await userEvent.click(learnMoreButtons[0]);
        expect(screen.getByRole("dialog")).toBeInTheDocument();

        await userEvent.keyboard("{Escape}");

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });

    test("series modal closes when backdrop is clicked", async () => {
        renderDecadePage("1980s");

        const learnMoreButtons = await screen.findAllByRole("button", { name: /learn more/i });
        await userEvent.click(learnMoreButtons[0]);
        const dialog = screen.getByRole("dialog");

        await userEvent.click(dialog);

        await waitFor(() => {
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });
    });
});
