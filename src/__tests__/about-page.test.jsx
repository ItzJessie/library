import { render, screen } from "@testing-library/react";
import About from "../pages/About";

describe("About page", () => {
    test("renders core About content", () => {
        render(<About />);

        expect(
            screen.getByRole("heading", { name: /about the project/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /project overview/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /technologies used/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("heading", { name: /references & sources/i })
        ).toBeInTheDocument();
    });

    test("uses safe external link attributes for source references", () => {
        render(<About />);

        const sourceLinks = [
            screen.getByRole("link", { name: /anime news network/i }),
            screen.getByRole("link", { name: /myanimelist/i }),
            screen.getByRole("link", { name: /imdb/i }),
            screen.getByRole("link", { name: /studio ghibli official site/i })
        ];

        sourceLinks.forEach((link) => {
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
            expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
        });
    });
});
