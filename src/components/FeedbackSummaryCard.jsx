const FeedbackSummaryCard = ({ name, rating, comment }) => {
    const parsedRating = Number(rating);
    const normalizedRating = Number.isFinite(parsedRating)
        ? Math.max(1, Math.min(5, Math.round(parsedRating)))
        : 1;
    const stars = "★".repeat(normalizedRating) + "☆".repeat(5 - normalizedRating);
    const displayName = typeof name === "string" && name.trim() ? name.trim() : "Anonymous Reviewer";
    const displayComment =
        typeof comment === "string" && comment.trim()
            ? comment.trim()
            : "No additional comments provided.";

    return (
        <article className="summary-item is-visible">
            <p className="summary-name">{displayName}</p>
            <div className="star-row is-gold" aria-label={`${normalizedRating} out of 5 stars`}>
                {stars}
            </div>
            <div className="summary-box">{displayComment}</div>
        </article>
    );
};

export default FeedbackSummaryCard;