import { Link } from "react-router-dom";

const EraPanelCard = ({ era }) => {
    const iconPathByEra = {
        "1980s": "M12 3v6M12 15v6M3 12h6M15 12h6",
        "1990s": "M7 12h10M12 7v10",
        "2000s": "M8 8l8 8M16 8l-8 8",
        "2010s": "M12 3v6M12 15v6M3 12h6M15 12h6",
        "2020s": "M7 12h10M12 7v10"
    };

    return (
        <article id={`era-${era.id}`} className="era-panel reveal tilt-card">
            <img src={`${process.env.PUBLIC_URL}/${era.image}`} alt={`Anime from the ${era.id}`} />
            <h3>{era.id}</h3>
            <div className="era-panel__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="9"></circle>
                    <path d={iconPathByEra[era.id] || iconPathByEra["1980s"]}></path>
                </svg>
            </div>
            <p>{era.blurb}</p>
            <ul>
                <li>{era.featured}</li>
                <li>{era.years}</li>
            </ul>
            <div className="related-series">
                <span>Related series:</span>
                {era.related.map((title) => (
                    <Link key={title} to="/all-influential-series">
                        {title}
                    </Link>
                ))}
            </div>
        </article>
    );
};

export default EraPanelCard;