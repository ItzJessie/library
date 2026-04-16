import { Link } from "react-router-dom";

const HomeFeatureCard = ({ title, period, meta, image, alt, toneClass = "", to = "/anime-eras" }) => {
    const resolvedTitle = title || "Featured Entry";
    const resolvedAlt = alt || `${resolvedTitle} artwork`;
    const resolvedTo = typeof to === "string" && to.trim() ? to : "/anime-eras";
    const resolvedToneClass = typeof toneClass === "string" ? toneClass : "";

    return (
        <Link className="home-click-card-link" to={resolvedTo}>
            <article className={`era-card tilt-card reveal home-click-card ${resolvedToneClass}`.trim()}>
                <img src={image} alt={resolvedAlt} loading="lazy" decoding="async" />
                <h3>{resolvedTitle}</h3>
                {period && <p>{period}</p>}
                {meta && <span className="card-meta">{meta}</span>}
                <span className="home-card-inline-cta" aria-hidden="true">
                    Open <span className="home-card-arrow">&rarr;</span>
                </span>
            </article>
        </Link>
    );
};

export default HomeFeatureCard;