import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const buildSeriesId = (title) =>
    `series-${String(title || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")}`;

const EraPanelCard = ({ era }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const eraId = era?.id || "unknown-era";
    const relatedSeries = Array.isArray(era?.related) ? era.related : [];

    useEffect(() => {
        setImageLoaded(false);
    }, [eraId, era?.image]);
    
    const iconPathByEra = {
        "1980s": "M12 3v6M12 15v6M3 12h6M15 12h6",
        "1990s": "M7 12h10M12 7v10",
        "2000s": "M8 8l8 8M16 8l-8 8",
        "2010s": "M12 3v6M12 15v6M3 12h6M15 12h6",
        "2020s": "M7 12h10M12 7v10"
    };

    return (
        <article
            id={`era-${eraId}`}
            className="era-panel reveal tilt-card"
            data-era={eraId}
            aria-labelledby={`era-panel-title-${eraId}`}
        >
            <img
                src={era?.image ? `${process.env.PUBLIC_URL}/${era.image}` : ""}
                alt={era?.id ? `Anime from the ${era.id}` : "Anime era artwork"}
                loading="lazy"
                decoding="async"
                className={imageLoaded ? "" : "loading"}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
            />
            <h3 id={`era-panel-title-${eraId}`}>{eraId}</h3>
            <div className="era-panel__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d={iconPathByEra[eraId] || iconPathByEra["1980s"]}></path>
                </svg>
            </div>
            <p>{era?.blurb || "Explore the defining series and milestones from this anime era."}</p>
            <ul>
                <li>{era?.featured || "Featured series coming soon"}</li>
                <li>{era?.years || "Years unavailable"}</li>
            </ul>
            <div className="related-series">
                <span>Related series:</span>
                {relatedSeries.length > 0 ? (
                    relatedSeries.map((title, index) => (
                        <Link
                            key={`${title}-${index}`}
                            to={`/all-influential-series#${buildSeriesId(title)}`}
                        >
                            {title}
                        </Link>
                    ))
                ) : (
                    <span>None listed</span>
                )}
            </div>
        </article>
    );
};

export default EraPanelCard;