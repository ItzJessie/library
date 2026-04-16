import { render, screen } from "@testing-library/react";
import FeedbackSummaryCard from "../components/FeedbackSummaryCard";

describe("FeedbackSummaryCard", () => {
    test("renders provided reviewer details and normalized stars", () => {
        render(<FeedbackSummaryCard name="Jessie" rating={4} comment="Great timeline details." />);

        expect(screen.getByText("Jessie")).toBeInTheDocument();
        expect(screen.getByText("Great timeline details.")).toBeInTheDocument();

        const stars = screen.getByLabelText("4 out of 5 stars");
        expect(stars).toHaveTextContent("★★★★☆");
    });

    test("clamps ratings outside the valid range", () => {
        const { rerender } = render(
            <FeedbackSummaryCard name="A" rating={10} comment="Loved it." />
        );
        expect(screen.getByLabelText("5 out of 5 stars")).toHaveTextContent("★★★★★");

        rerender(<FeedbackSummaryCard name="B" rating={0} comment="Could improve." />);
        expect(screen.getByLabelText("1 out of 5 stars")).toHaveTextContent("★☆☆☆☆");
    });

    test("uses safe fallbacks for missing values", () => {
        render(<FeedbackSummaryCard rating={"not-a-number"} />);

        expect(screen.getByText("Anonymous Reviewer")).toBeInTheDocument();
        expect(screen.getByText("No additional comments provided.")).toBeInTheDocument();
        expect(screen.getByLabelText("1 out of 5 stars")).toHaveTextContent("★☆☆☆☆");
    });
});
