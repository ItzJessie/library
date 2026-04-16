import { Link } from "react-router-dom";

const ProfileCard = ({
    profile = {},
    type,
    quickStats,
    badges = [],
    onClick,
    onDeepDive,
    onToggleCompare,
    onToggleExpand,
    isMobile = false,
    isExpanded = false,
    isCompared = false
}) => {
    const isCreator = type === "creator";
    const profileName = profile.name || "Unknown";
    const detailText = typeof profile.detail === "string" ? profile.detail : "";
    const relatedSeries = Array.isArray(profile.related) ? profile.related : [];
    const safeBadges = Array.isArray(badges) ? badges : [];
    const summaryPreview =
        detailText.length > 108 ? `${detailText.slice(0, 108).trim()}...` : detailText;

    const handleCardInteraction = (event) => {
        const target = event.target;

        // Nested links/buttons handle their own intent.
        if (target instanceof Element && target.closest("button, a")) {
            return;
        }

        onClick?.(profile, type);
    };

    return (
        <article
            className={`info-card interactive-card ${isCreator ? "creator-card" : "studio-card"} ${isMobile ? "is-mobile-card" : ""} ${isExpanded ? "is-expanded" : ""}`.trim()}
            role="button"
            tabIndex={0}
            onClick={handleCardInteraction}
            onKeyDown={(event) => {
                if (event.target !== event.currentTarget) {
                    return;
                }

                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onClick?.(profile, type);
                }
            }}
        >
            <div className="info-quick-stats" aria-hidden="true">
                <p>{quickStats?.worksCount ?? 0} works</p>
                <p>{quickStats?.yearsActive ?? "N/A"}</p>
            </div>

            {safeBadges.length > 0 && (
                <div className="info-badges" aria-label="Profile badges">
                    {safeBadges.map((badge) => (
                        <span key={`${profileName}-${badge}`}>{badge}</span>
                    ))}
                </div>
            )}

            <div className="info-header">
                <div>
                    <p className="info-label">
                        {isCreator ? "Creator Name" : "Studio Name"}: {profileName}
                    </p>
                    <p className="info-meta">{isCreator ? profile.role : profile.meta}</p>
                </div>
                <img
                    src={profile.image}
                    alt={`${profileName} ${isCreator ? "portrait" : "logo"}`}
                    loading="lazy"
                    decoding="async"
                />
            </div>
            {isCreator && (!isMobile || isExpanded) && <p className="info-sub">{profile.affiliation}</p>}
            <p className={`info-body ${isMobile && !isExpanded ? "is-collapsed" : ""}`}>
                Notable Works: {isMobile && !isExpanded ? summaryPreview : detailText}
            </p>
            {(!isMobile || isExpanded) && (
                <div className="related-series">
                    <span>Related series:</span>
                    {relatedSeries.map((name) => (
                        <Link key={`${profileName}-${name}`} to="/all-influential-series">
                            {name}
                        </Link>
                    ))}
                </div>
            )}

            <div className="info-actions">
                {isMobile && (
                    <button
                        type="button"
                        className="card-action-btn expand-btn"
                        onClick={(event) => {
                            event.stopPropagation();
                            onToggleExpand?.(profile, type);
                        }}
                    >
                        {isExpanded ? "Collapse" : "Expand"}
                    </button>
                )}
                <button
                    type="button"
                    className="card-action-btn"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDeepDive?.(profile, type);
                    }}
                >
                    Deep Dive
                </button>
                <button
                    type="button"
                    className={`card-action-btn compare-btn ${isCompared ? "is-active" : ""}`}
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggleCompare?.(profile, type);
                    }}
                >
                    {isCompared ? "Selected" : "Compare"}
                </button>
            </div>
        </article>
    );
};

export default ProfileCard;