const FeedbackSummaryCard = ({ name, rating, comment }) => {
    const stars = "★".repeat(Math.max(1, Math.min(5, rating)));

    return (
        <article className="summary-item is-visible">
            <p className="summary-name">{name}</p>
            <div className="star-row is-gold" aria-label={`${rating} out of 5 stars`}>
                {stars}
            </div>
            <div className="summary-box">{comment}</div>
        </article>
    );
};

export default FeedbackSummaryCard;