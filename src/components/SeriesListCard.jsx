const SeriesListCard = ({
    series,
    compact = false,
    variant = "default",
    interactive = null
}) => {
    if (compact) {
        return (
            <article className="carousel-card tilt-card" id={series.id}>
                <img src={series.image} alt={series.title} />
                <span>{series.title}</span>
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

        return (
            <article className="series-card tilt-card" id={series.id} {...interactiveProps}>
                <img src={series.image} alt={series.title} />
                <span>{series.title}</span>
                <div className="series-info" aria-hidden="true">
                    <h3>{series.title}</h3>
                    <p><strong>Release:</strong> {series.year}</p>
                    <p><strong>Studio:</strong> {series.studio}</p>
                    <p><strong>Genre:</strong> {series.genre}</p>
                    <p>{series.synopsis}</p>
                </div>
            </article>
        );
    }

    return (
        <article className="all-series-card" id={series.id}>
            <img src={series.image} alt={series.title} />
            <div className="all-series-body">
                <h2>{series.title}</h2>
                <p><span>Release:</span> {series.year}</p>
                <p><span>Studio:</span> {series.studio}</p>
                {typeof series.episodes !== "undefined" && <p><span>Episodes:</span> {series.episodes}</p>}
                {series.genre && <p><span>Genre:</span> {series.genre}</p>}
                {series.synopsis && <p>{series.synopsis}</p>}
            </div>
        </article>
    );
};

export default SeriesListCard;
