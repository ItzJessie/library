const SeriesListCard = ({
    series,
    compact = false,
    variant = "default",
    featured = false,
    animated = false,
    interactive = null
}) => {
    const safeSeries = series || {};
    const seriesTitle = safeSeries.title || "Untitled Series";
    const seriesImage = safeSeries.image || "";
    const resolvedImageSrc = seriesImage || undefined;

    if (compact) {
        return (
            <article className="carousel-card tilt-card" id={safeSeries.id}>
                <img src={resolvedImageSrc} alt={seriesTitle} loading="lazy" decoding="async" />
                <span>{seriesTitle}</span>
            </article>
        );
    }

    if (variant === "archive") {
        const interactiveProps = interactive
            ? {
                  onClick: interactive.onClick,
                  onKeyDown: interactive.onKeyDown,
                  tabIndex: interactive.tabIndex,
                  role: interactive.role,
                  "aria-label": interactive.ariaLabel
              }
            : {};

        const influenceScore = (8.8 + ((seriesTitle.length * 7) % 13) / 10).toFixed(1);

        if (featured) {
            return (
                <article
                    className={`series-card series-card--featured tilt-card ${animated ? "series-card--animated" : ""}`.trim()}
                    id={safeSeries.id}
                    {...interactiveProps}
                >
                    <div className="series-card__media">
                        <img src={resolvedImageSrc} alt={seriesTitle} loading="lazy" decoding="async" />
                        <span className="series-card__title-chip">{seriesTitle}</span>
                    </div>

                    <div className="series-featured-panel" aria-hidden="true">
                        <div className="series-featured-panel__meta">
                            <p>
                                {safeSeries.year || "Unknown"} <span aria-hidden="true">|</span> {safeSeries.studio || "Unknown"}
                            </p>
                        </div>

                        <p className="series-featured-panel__synopsis">{safeSeries.synopsis || "Synopsis coming soon."}</p>

                        <p className="series-featured-panel__score">Influence Score: {influenceScore}</p>
                    </div>
                </article>
            );
        }

        return (
            <article
                className={`series-card series-card--compact tilt-card ${animated ? "series-card--animated" : ""}`.trim()}
                id={safeSeries.id}
                {...interactiveProps}
            >
                <img src={resolvedImageSrc} alt={seriesTitle} loading="lazy" decoding="async" />
                <span className="series-card__title-chip">{seriesTitle}</span>
            </article>
        );
    }

    return (
        <article className="all-series-card" id={safeSeries.id}>
            <img src={resolvedImageSrc} alt={seriesTitle} loading="lazy" decoding="async" />
            <div className="all-series-body">
                <h2>{seriesTitle}</h2>
                <p><span>Release:</span> {safeSeries.year || "Unknown"}</p>
                <p><span>Studio:</span> {safeSeries.studio || "Unknown"}</p>
                {typeof safeSeries.episodes !== "undefined" && <p><span>Episodes:</span> {safeSeries.episodes}</p>}
                {safeSeries.genre && <p><span>Genre:</span> {safeSeries.genre}</p>}
                {safeSeries.synopsis && <p>{safeSeries.synopsis}</p>}
            </div>
        </article>
    );
};

export default SeriesListCard;
