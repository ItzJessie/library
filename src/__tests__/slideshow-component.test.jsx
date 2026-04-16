import { fireEvent, render, screen, act } from "@testing-library/react";
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

import Slideshow from "../components/Slideshow";

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

describe("Slideshow", () => {
    beforeEach(() => {
        window.matchMedia =
            window.matchMedia ||
            (() => ({
                matches: false,
                media: "(pointer: coarse)",
                addEventListener: jest.fn(),
                removeEventListener: jest.fn(),
                addListener: jest.fn(),
                removeListener: jest.fn(),
                onchange: null,
                dispatchEvent: jest.fn()
            }));
    });

    test("renders a carousel with navigation controls", () => {
        render(<Slideshow slides={slides} />);

        expect(screen.getByLabelText(/featured influential anime slideshow/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /previous slide/i })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /next slide/i })).toBeInTheDocument();
        expect(screen.getByRole("tab", { name: /show cowboy bebop/i })).toHaveAttribute(
            "aria-selected",
            "true"
        );
    });

    test("advances with keyboard arrows and wrap-around controls", async () => {
        render(<Slideshow slides={slides} />);

        const shell = screen.getByLabelText(/featured influential anime slideshow/i);
        act(() => {
            shell.focus();
        });

        act(() => {
            fireEvent.keyDown(shell, { key: "ArrowRight" });
        });
        expect(screen.getByRole("tab", { name: /show evangelion/i })).toHaveAttribute(
            "aria-selected",
            "true"
        );

        act(() => {
            fireEvent.transitionEnd(document.querySelector(".carousel-track"));
        });

        act(() => {
            fireEvent.keyDown(shell, { key: "ArrowLeft" });
        });
        expect(screen.getByRole("tab", { name: /show cowboy bebop/i })).toHaveAttribute(
            "aria-selected",
            "true"
        );
    });

    test("keeps autoplay paused while focus stays inside the carousel", async () => {
        jest.useFakeTimers();

        render(<Slideshow slides={slides} />);

        const shell = screen.getByLabelText(/featured influential anime slideshow/i);
        act(() => {
            shell.focus();
        });

        await userEvent.tab();
        expect(screen.getByRole("button", { name: /previous slide/i })).toHaveFocus();

        act(() => {
            jest.advanceTimersByTime(5100);
        });

        expect(screen.getByRole("tab", { name: /show cowboy bebop/i })).toHaveAttribute(
            "aria-selected",
            "true"
        );

        jest.useRealTimers();
    });

    test("updates the active slide when a dot is selected", async () => {
        render(<Slideshow slides={slides} />);

        await userEvent.click(screen.getByRole("tab", { name: /show samurai champloo/i }));

        expect(screen.getByRole("tab", { name: /show samurai champloo/i })).toHaveAttribute(
            "aria-selected",
            "true"
        );
    });
});