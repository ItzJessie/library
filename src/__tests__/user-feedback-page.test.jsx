import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserFeedback from "../pages/UserFeedback";

describe("User feedback page", () => {
    test("shows calculated average rating summary", () => {
        render(<UserFeedback />);

        expect(screen.getByText(/4\.5 \/ 5 based on 4 reviews/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/average user rating 4\.5 out of 5/i)).toBeInTheDocument();
    });

    test("prevents submit when email is invalid", async () => {
        render(<UserFeedback />);

        await userEvent.type(screen.getByLabelText(/name:/i), "Jessie");
        await userEvent.type(screen.getByLabelText(/email:/i), "invalid-email");
        await userEvent.type(
            screen.getByLabelText(/how satisfied were you with the product\/service/i),
            "Great browsing flow and clean design."
        );
        await userEvent.click(screen.getByRole("radio", { name: /5 out of 5 stars/i }));

        await userEvent.click(screen.getByRole("button", { name: /submit feedback/i }));

        expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    test("prevents submit when rating is missing", async () => {
        render(<UserFeedback />);

        await userEvent.type(screen.getByLabelText(/name:/i), "Jessie");
        await userEvent.type(screen.getByLabelText(/email:/i), "jessie@example.com");
        await userEvent.type(
            screen.getByLabelText(/how satisfied were you with the product\/service/i),
            "Useful content and easy to navigate."
        );

        await userEvent.click(screen.getByRole("button", { name: /submit feedback/i }));

        expect(
            await screen.findByText(/please select a page rating before submitting feedback/i)
        ).toBeInTheDocument();
    });

    test("submits successfully with valid data", async () => {
        render(<UserFeedback />);

        await userEvent.type(screen.getByLabelText(/name:/i), "Jessie");
        await userEvent.type(screen.getByLabelText(/email:/i), "jessie@example.com");
        await userEvent.type(
            screen.getByLabelText(/how satisfied were you with the product\/service/i),
            "Loved the history timeline and studio highlights."
        );
        await userEvent.click(screen.getByRole("radio", { name: /4 out of 5 stars/i }));

        await userEvent.click(screen.getByRole("button", { name: /submit feedback/i }));

        expect(
            await screen.findByText(/thanks for sharing your feedback, jessie\./i)
        ).toBeInTheDocument();
    });
});
