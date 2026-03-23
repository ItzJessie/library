import FeedbackSummaryCard from "../components/FeedbackSummaryCard";

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

const UserFeedback = () => {
    return (
        <main className="feedback-page">
            <section className="feedback-hero">
                <h1>User Feedback</h1>
            </section>

            <section className="feedback-layout">
                <form className="feedback-card is-visible" action="#" method="post">
                    <h2>Feedback Form</h2>
                    <div className="feedback-grid">
                        <label className="field" htmlFor="feedback-name">
                            <span>Name:</span>
                            <input id="feedback-name" type="text" name="name" placeholder="John Doe" />
                        </label>
                        <label className="field" htmlFor="feedback-phone">
                            <span>Phone:</span>
                            <input
                                id="feedback-phone"
                                type="tel"
                                name="phone"
                                placeholder="(555) 123-4567"
                            />
                        </label>
                        <label className="field" htmlFor="feedback-age">
                            <span>Age:</span>
                            <input id="feedback-age" type="text" name="age" placeholder="19" />
                        </label>
                        <label className="field" htmlFor="feedback-email">
                            <span>Email:</span>
                            <input
                                id="feedback-email"
                                type="email"
                                name="email"
                                placeholder="john.doe@example.com"
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
                        ></textarea>
                    </label>
                    <div className="rating-row">
                        <span>Rate this page:</span>
                        <div className="rating-stars" role="radiogroup" aria-label="Page rating">
                            <input id="rating-5" type="radio" name="rating" value="5" />
                            <label htmlFor="rating-5" title="5 stars">
                                &#9733;
                            </label>
                            <input id="rating-4" type="radio" name="rating" value="4" />
                            <label htmlFor="rating-4" title="4 stars">
                                &#9733;
                            </label>
                            <input id="rating-3" type="radio" name="rating" value="3" />
                            <label htmlFor="rating-3" title="3 stars">
                                &#9733;
                            </label>
                            <input id="rating-2" type="radio" name="rating" value="2" />
                            <label htmlFor="rating-2" title="2 stars">
                                &#9733;
                            </label>
                            <input id="rating-1" type="radio" name="rating" value="1" />
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
                </form>

                <section className="feedback-card feedback-summary is-visible">
                    <h2>Feedback Summary</h2>
                    <div className="summary-rating">
                        <h3>Average Rating</h3>
                        <div className="star-row is-gold" aria-hidden="true">
                            &#9733;&#9733;&#9733;&#9733;&#9733;
                        </div>
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
