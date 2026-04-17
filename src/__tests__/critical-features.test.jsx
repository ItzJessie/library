import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockCurrentPathname = "/";

jest.mock(
    "react-router-dom",
    () => ({
        Link: ({ to, children, ...props }) => (
            <a href={typeof to === "string" ? to : "#"} {...props}>
                {children}
            </a>
        ),
        NavLink: ({ to, children, className, end: _end, ...props }) => {
            const computedClass =
                typeof className === "function" ? className({ isActive: false }) : className;

            return (
                <a href={typeof to === "string" ? to : "#"} className={computedClass} {...props}>
                    {children}
                </a>
            );
        },
        useLocation: () => ({ pathname: mockCurrentPathname }),
        useOutletContext: () => ({})
    }),
    { virtual: true }
);

import Header from "../components/header";
import ContactForm from "../components/ContactForm";
import UserFeedback from "../pages/UserFeedback";
import Slideshow from "../components/Slideshow";
import Home from "../pages/home";
import EraOverlay from "../components/EraOverlay";
import AnimeEras from "../pages/AnimeEras";
import { eraPanels } from "../data/siteData";
import { ThemeProvider } from "../context/ThemeContext";

const renderWithRouter = (ui) => render(ui);

beforeEach(() => {
    mockCurrentPathname = "/";
    window.matchMedia = window.matchMedia || (() => ({
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

describe("Critical feature coverage", () => {
    test("mobile nav toggle opens and closes", async () => {
        renderWithRouter(
            <ThemeProvider>
                <Header />
            </ThemeProvider>
        );

        const toggleButton = screen.getByRole("button", { name: /open menu/i });
        expect(toggleButton).toHaveAttribute("aria-expanded", "false");

        await userEvent.click(toggleButton);
        expect(toggleButton).toHaveAttribute("aria-expanded", "true");

        const closeButton = screen.getByRole("button", { name: /close menu/i });
        await userEvent.click(closeButton);
        expect(closeButton).toHaveAttribute("aria-expanded", "false");
    });

    test("home page embeds the expected iframe", () => {
        renderWithRouter(<Home />);
        const iframe = screen.getByTitle("YouTube video: The Evolution of Anime");

        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/cqoURVPgGPo");
    });

    test("contact form shows success feedback and redirect link", async () => {
        const fetchMock = jest
            .spyOn(global, "fetch")
            .mockResolvedValue({
                ok: true,
                json: async () => ({ success: true, message: "Thanks!" })
            });

        renderWithRouter(<ContactForm />);

        await userEvent.type(screen.getByLabelText(/name/i), "Jessie");
        await userEvent.type(screen.getByLabelText(/email/i), "jessie@example.com");
        await userEvent.type(screen.getByLabelText(/subject/i), "Hello");
        await userEvent.type(screen.getByLabelText(/message/i), "Testing form behavior");

        await userEvent.click(screen.getByRole("button", { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByText("Thanks!")).toBeInTheDocument();
        });

        const redirectLink = screen.getByRole("link", { name: /open feedback page/i });
        expect(redirectLink).toHaveAttribute("href", "/user-feedback");
        expect(fetchMock).toHaveBeenCalledTimes(1);

        fetchMock.mockRestore();
    });

    test("contact form blocks submission and surfaces validation guidance for empty fields", async () => {
        const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({ success: true, message: "Thanks!" })
        });

        renderWithRouter(<ContactForm />);

        await userEvent.click(screen.getByRole("button", { name: /send message/i }));

        await waitFor(() => {
            expect(screen.getByText(/please fix the highlighted fields/i)).toBeInTheDocument();
        });

        expect(fetchMock).not.toHaveBeenCalled();
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();

        fetchMock.mockRestore();
    });

    test("contact form shows an error if fetch fails and native submit is unavailable", async () => {
        const fetchMock = jest
            .spyOn(global, "fetch")
            .mockRejectedValue(new Error("Network unavailable"));

        renderWithRouter(<ContactForm />);

        const formElement = document.querySelector("form.contact-form");
        Object.defineProperty(formElement, "submit", {
            configurable: true,
            value: undefined
        });

        await userEvent.type(screen.getByLabelText(/name/i), "Jessie");
        await userEvent.type(screen.getByLabelText(/email/i), "jessie@example.com");
        await userEvent.type(screen.getByLabelText(/subject/i), "Hello");
        await userEvent.type(screen.getByLabelText(/message/i), "Testing fetch failure handling");

        await userEvent.click(screen.getByRole("button", { name: /send message/i }));

        expect(
            await screen.findByText(/unable to submit the form right now\. please try again shortly\./i)
        ).toBeInTheDocument();

        fetchMock.mockRestore();
    });

    test("user feedback form submits on the client without posting the page", async () => {
        renderWithRouter(<UserFeedback />);

        await userEvent.type(screen.getByLabelText(/name/i), "Jessie");
        await userEvent.type(screen.getByLabelText(/email/i), "jessie@example.com");
        await userEvent.type(
            screen.getByLabelText(/how satisfied were you with the product\/service/i),
            "Great experience overall."
        );
        await userEvent.click(screen.getByRole("radio", { name: /5 out of 5 stars/i }));

        await userEvent.click(screen.getByRole("button", { name: /submit feedback/i }));

        expect(await screen.findByText(/thanks for sharing your feedback/i)).toBeInTheDocument();
    });

    test("slideshow advances automatically", async () => {
        jest.useFakeTimers();

        const slides = [
            {
                id: "s1",
                title: "Cowboy Bebop",
                year: 1998,
                genre: "Sci-Fi",
                studio: "Sunrise",
                synopsis: "Classic space western.",
                image: "/img-1.jpg"
            },
            {
                id: "s2",
                title: "Evangelion",
                year: 1995,
                genre: "Mecha",
                studio: "Gainax",
                synopsis: "Psychological mecha landmark.",
                image: "/img-2.jpg"
            },
            {
                id: "s3",
                title: "Samurai Champloo",
                year: 2004,
                genre: "Adventure",
                studio: "Manglobe",
                synopsis: "Stylish road anime.",
                image: "/img-3.jpg"
            }
        ];

        renderWithRouter(<Slideshow slides={slides} />);

        const initiallyActive = screen.getByRole("tab", { name: /show cowboy bebop/i });
        expect(initiallyActive).toHaveAttribute("aria-selected", "true");

        act(() => {
            jest.advanceTimersByTime(5100);
        });

        const nextActive = screen.getByRole("tab", { name: /show evangelion/i });
        expect(nextActive).toHaveAttribute("aria-selected", "true");

        jest.useRealTimers();
    });

    test("akira details fall back when the API request fails", async () => {
        const fetchMock = jest
            .spyOn(global, "fetch")
            .mockRejectedValue(new Error("Network unavailable"));

        render(
            <EraOverlay
                era={eraPanels[0]}
                isOpen={true}
                onClose={jest.fn()}
                onNavigateEra={jest.fn()}
                prevEraId={null}
                nextEraId={null}
            />
        );

        await userEvent.click(
            screen.getByRole("button", { name: /learn more about akira/i })
        );

        expect(await screen.findByText(/tokyo movie shinsha/i)).toBeInTheDocument();
        expect(screen.queryByText(/unable to load details/i)).not.toBeInTheDocument();
        expect(fetchMock).toHaveBeenCalledTimes(1);

        fetchMock.mockRestore();
    });

    test("anime eras page opens and navigates overlays", async () => {
        renderWithRouter(<AnimeEras />);

        await userEvent.click(
            screen.getByRole("button", { name: /view 1980s era details/i })
        );

        expect(await screen.findByRole("dialog", { name: "1980s" })).toBeInTheDocument();

        await userEvent.click(screen.getByRole("button", { name: /next era/i }));

        expect(await screen.findByRole("dialog", { name: "1990s" })).toBeInTheDocument();
    });
});
