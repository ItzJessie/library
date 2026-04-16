import { useState } from "react";
import FeedbackSummaryCard from "../components/FeedbackSummaryCard";
import "../css/UserFeedbackPage.css";

const feedbackItems = [
    {
        id: "timmy-adams",
        name: "Timmy Adams",
        rating: 5,
        comment: "Loved the 1980s timeline highlights and the clean layout for studio profiles."
    },
    {
        id: "jim-walts",
        name: "Jim Walts",
        rating: 4,
        comment: "Easy to navigate with strong visuals, but a quick filter for eras would be helpful."
    },
    {
        id: "james-black",
        name: "James Black",
        rating: 5,
        comment: "Great mix of history and series details; would like more trivia snippets on each page."
    },
    {
        id: "sandra-wells",
        name: "Sandra Wells",
        rating: 4,
        comment: "Clear writing and nice color palette; the influential series list was the highlight."
    }
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const averageRating = (
    feedbackItems.reduce((sum, item) => sum + item.rating, 0) / feedbackItems.length
).toFixed(1);

const roundedAverageRating = Math.round(Number(averageRating));

const averageStars =
    "★".repeat(roundedAverageRating) + "☆".repeat(Math.max(0, 5 - roundedAverageRating));

const UserFeedback = () => {
    const [status, setStatus] = useState({ type: "", message: "" });

    const handleSubmit = (event) => {
        event.preventDefault();

        const formElement = event.currentTarget;
        const formData = new FormData(formElement);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const ageValue = String(formData.get("age") || "").trim();
        const rating = String(formData.get("rating") || "").trim();
        const satisfaction = String(formData.get("satisfaction") || "").trim();

        if (!name) {
            setStatus({
                type: "error",
                message: "Please enter your name before submitting feedback."
            });
            formElement.querySelector("#feedback-name")?.focus();
            return;
        }

        if (name.length < 2) {
            setStatus({
                type: "error",
                message: "Please enter a name with at least 2 characters."
            });
            formElement.querySelector("#feedback-name")?.focus();
            return;
        }

        if (!email) {
            setStatus({
                type: "error",
                message: "Please enter your email before submitting feedback."
            });
            formElement.querySelector("#feedback-email")?.focus();
            return;
        }

        if (!EMAIL_PATTERN.test(email)) {
            setStatus({
                type: "error",
                message: "Please enter a valid email address."
            });
            formElement.querySelector("#feedback-email")?.focus();
            return;
        }

        if (ageValue) {
            const age = Number(ageValue);

            if (!Number.isInteger(age) || age < 5 || age > 120) {
                setStatus({
                    type: "error",
                    message: "Please enter a valid age between 5 and 120."
                });
                formElement.querySelector("#feedback-age")?.focus();
                return;
            }
        }

        if (!rating) {
            setStatus({
                type: "error",
                message: "Please select a page rating before submitting feedback."
            });
            formElement.querySelector("#rating-5")?.focus();
            return;
        }

        if (!satisfaction) {
            setStatus({
                type: "error",
                message: "Please share your satisfaction feedback before submitting."
            });
            formElement.querySelector("#feedback-satisfaction")?.focus();
            return;
        }

        setStatus({
            type: "success",
            message: `Thanks for sharing your feedback, ${name}.`
        });

        formElement.reset();
    };

    return (
        <main className="feedback-page">
            <section className="feedback-hero">
                <h1>User Feedback</h1>
            </section>

            <section className="feedback-layout">
                <form className="feedback-card is-visible" onSubmit={handleSubmit} noValidate>
                    <h2>Feedback Form</h2>
                    <div className="feedback-grid">
                        <label className="field" htmlFor="feedback-name">
                            <span>Name:</span>
                            <input
                                id="feedback-name"
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                autoComplete="name"
                                required
                            />
                        </label>
                        <label className="field" htmlFor="feedback-phone">
                            <span>Phone:</span>
                            <input
                                id="feedback-phone"
                                type="tel"
                                name="phone"
                                placeholder="(555) 123-4567"
                                autoComplete="tel"
                            />
                        </label>
                        <label className="field" htmlFor="feedback-age">
                            <span>Age:</span>
                            <input
                                id="feedback-age"
                                type="number"
                                name="age"
                                placeholder="19"
                                min="5"
                                max="120"
                                inputMode="numeric"
                            />
                        </label>
                        <label className="field" htmlFor="feedback-email">
                            <span>Email:</span>
                            <input
                                id="feedback-email"
                                type="email"
                                name="email"
                                placeholder="john.doe@example.com"
                                autoComplete="email"
                                required
                            />
                        </label>
                    </div>
                    <label className="field field-wide" htmlFor="feedback-satisfaction">
                        <span>How satisfied were you with the product/service you received?</span>
                        <textarea
                            id="feedback-satisfaction"
                            name="satisfaction"
                            rows="3"
                            placeholder="Tell us what worked well and what could improve."
                            required
                        ></textarea>
                    </label>
                    <div className="rating-row">
                        <span>Rate this page:</span>
                        <div className="rating-stars" role="radiogroup" aria-label="Page rating">
                            <input
                                id="rating-5"
                                type="radio"
                                name="rating"
                                value="5"
                                aria-label="5 out of 5 stars"
                                required
                            />
                            <label htmlFor="rating-5" title="5 stars">
                                &#9733;
                            </label>
                            <input
                                id="rating-4"
                                type="radio"
                                name="rating"
                                value="4"
                                aria-label="4 out of 5 stars"
                            />
                            <label htmlFor="rating-4" title="4 stars">
                                &#9733;
                            </label>
                            <input
                                id="rating-3"
                                type="radio"
                                name="rating"
                                value="3"
                                aria-label="3 out of 5 stars"
                            />
                            <label htmlFor="rating-3" title="3 stars">
                                &#9733;
                            </label>
                            <input
                                id="rating-2"
                                type="radio"
                                name="rating"
                                value="2"
                                aria-label="2 out of 5 stars"
                            />
                            <label htmlFor="rating-2" title="2 stars">
                                &#9733;
                            </label>
                            <input
                                id="rating-1"
                                type="radio"
                                name="rating"
                                value="1"
                                aria-label="1 out of 5 stars"
                            />
                            <label htmlFor="rating-1" title="1 star">
                                &#9733;
                            </label>
                        </div>
                    </div>
                    <label className="field field-wide" htmlFor="feedback-comments">
                        <span>Comments (optional)</span>
                        <textarea
                            id="feedback-comments"
                            name="comments"
                            rows="3"
                            placeholder="Optional details or suggestions."
                        ></textarea>
                    </label>
                    <button className="feedback-submit" type="submit">
                        Submit Feedback
                    </button>
                    {status.message ? (
                        <div
                            className={`form-feedback ${status.type}`.trim()}
                            role={status.type === "error" ? "alert" : "status"}
                            aria-live={status.type === "error" ? "assertive" : "polite"}
                        >
                            <p>{status.message}</p>
                        </div>
                    ) : null}
                </form>

                <section className="feedback-card feedback-summary is-visible">
                    <h2>Feedback Summary</h2>
                    <div className="summary-rating">
                        <h3>Average Rating</h3>
                        <div
                            className="star-row is-gold"
                            aria-label={`Average user rating ${averageRating} out of 5`}
                        >
                            {averageStars}
                        </div>
                        <p className="summary-score">
                            {averageRating} / 5 based on {feedbackItems.length} reviews
                        </p>
                    </div>
                    <div className="summary-scroll">
                        {feedbackItems.map((item) => (
                            <FeedbackSummaryCard
                                key={item.id}
                                name={item.name}
                                rating={item.rating}
                                comment={item.comment}
                            />
                        ))}
                    </div>
                </section>
            </section>
        </main>
    );
};

export default UserFeedback;
