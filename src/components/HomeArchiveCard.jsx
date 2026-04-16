import { Link } from "react-router-dom";

const HomeArchiveCard = ({ title, subtitle, detail, image, alt, wide = false, to = "/anime-eras" }) => {
    const resolvedTitle = title || "Archive Entry";
    const resolvedAlt = alt || `${resolvedTitle} artwork`;
    const resolvedTo = typeof to === "string" && to.trim() ? to : "/anime-eras";

    return (
        <Link className="home-click-card-link" to={resolvedTo}>
            <article className={`archive-card tilt-card reveal home-click-card ${wide ? "wide" : ""}`.trim()}>
                <img src={image} alt={resolvedAlt} loading="lazy" decoding="async" />
                <div>
                    <h3>{resolvedTitle}</h3>
                    {subtitle && <p>{subtitle}</p>}
                    {detail && <span>{detail}</span>}
                    <span className="home-card-inline-cta" aria-hidden="true">
                        Open <span className="home-card-arrow">&rarr;</span>
                    </span>
                </div>
            </article>
        </Link>
    );
};

export default HomeArchiveCard;