import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { decadeData } from "../data/siteData";
import "../css/DecadePage.css";

const eraOrder = ["1980s", "1990s", "2000s", "2010s", "2020s"];

const iconCycle = ["🚀", "🌍", "🎬", "⚡", "🛰️", "🎵"];

const eraHighlights = {
    "1980s": {
        topGenre: "Mecha / Sci-Fi",
        avgEpisodes: "40+",
        studiosRising: "Sunrise, Toei",
        globalImpact: "First major Western exposure"
    },
    "1990s": {
        topGenre: "Shounen / Psychological Sci-Fi",
        avgEpisodes: "30-50",
        studiosRising: "Gainax, Sunrise",
        globalImpact: "TV syndication built global fandom"
    },
    "2000s": {
        topGenre: "Battle Shounen",
        avgEpisodes: "50+",
        studiosRising: "Madhouse, Studio Pierrot",
        globalImpact: "Fansub culture to mainstream transition"
    },
    "2010s": {
        topGenre: "Dark Fantasy / Action",
        avgEpisodes: "24-48",
        studiosRising: "Wit Studio, Ufotable",
        globalImpact: "Streaming simulcast era explodes"
    },
    "2020s": {
        topGenre: "Dark Action / Cross-Media",
        avgEpisodes: "12-24",
        studiosRising: "MAPPA, CloverWorks",
        globalImpact: "Weekly global launch culture"
    }
};

const seriesTags = {
    "1980s": {
        "Super Dimension Fortress Macross": ["Mecha", "Sci-Fi", "Romance"],
        "Dragon Ball": ["Shounen", "Adventure", "Martial Arts"],
        "Akira": ["Cyberpunk", "Sci-Fi", "Film"],
        "Gundam Wing": ["Mecha", "War", "Political"],
    },
    "1990s": {
        "Sailor Moon": ["Magical Girl", "Fantasy", "Romance"],
        "Neon Genesis Evangelion": ["Mecha", "Psychological", "Sci-Fi"],
        "Rurouni Kenshin": ["Samurai", "Action", "Drama"],
        "Cowboy Bebop": ["Space Noir", "Sci-Fi", "Jazz"],
    },
    "2000s": {
        "Fullmetal Alchemist": ["Fantasy", "Adventure", "Drama"],
        "Bleach": ["Supernatural", "Shounen", "Action"],
        "Naruto": ["Shounen", "Ninja", "Adventure"],
        "Death Note": ["Psychological", "Thriller", "Supernatural"],
    },
    "2010s": {
        "Steins;Gate": ["Sci-Fi", "Time Travel", "Thriller"],
        "Attack on Titan": ["Dark Fantasy", "Action", "Mystery"],
        "My Hero Academia": ["Superhero", "Shounen", "School"],
        "One Punch Man": ["Action", "Comedy", "Superhero"],
    },
    "2020s": {
        "Jujutsu Kaisen": ["Dark Fantasy", "Action", "Supernatural"],
        "Tower of God": ["Fantasy", "Adventure", "Mystery"],
        "Chainsaw Man": ["Horror", "Action", "Dark Comedy"],
        "Cyberpunk: Edgerunners": ["Cyberpunk", "Drama", "Sci-Fi"],
    }
};

const eraConnections = {
    "1980s": [
        "Akira -> influenced global cyberpunk aesthetics",
        "Gundam -> pushed mecha realism and political storytelling"
    ],
    "1990s": [
        "Evangelion -> inspired introspective mecha narratives",
        "Cowboy Bebop -> raised global standards for anime direction and score"
    ],
    "2000s": [
        "Naruto -> normalized long-form character arcs for global audiences",
        "Death Note -> made psychological anime mainstream"
    ],
    "2010s": [
        "Attack on Titan -> drove cinematic action in TV anime",
        "Steins;Gate -> popularized complex timeline storytelling"
    ],
    "2020s": [
        "Chainsaw Man -> normalized filmic direction in weekly TV anime",
        "Edgerunners -> proved game-to-anime collaborations can dominate globally"
    ]
};

const normalizeTitle = (value) =>
    String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

const resolveApiImagePath = (anime) =>
    anime?.img_name ||
    anime?.imageVersionedPath ||
    anime?.image ||
    anime?.image_url ||
    anime?.poster ||
    "";

const toAbsoluteImageUrl = (apiBase, path) => {
    if (!path) {
        return "";
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return `${apiBase}/${String(path).replace(/^\/+/, "")}`;
};

const toLocalPublicImageUrl = (path) => {
    if (!path) {
        return "";
    }

    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return `${process.env.PUBLIC_URL}/${String(path).replace(/^\/+/, "")}`;
};

const localSeriesImageFallbacks = {
    "zeta gundam": `${process.env.PUBLIC_URL}/images/zeta-gundam-poster.jpeg`,
    "princess mononoke": `${process.env.PUBLIC_URL}/images/princess-monoke-poster.png`
};

const buildSeriesPreview = (detail) => {
    const text = String(detail || "").trim();

    if (!text) {
        return "";
    }

    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const preview = sentences.slice(0, 2).join(" ").trim();

    if (preview.length <= 220) {
        return preview;
    }

    return `${preview.slice(0, 217).trimEnd()}...`;
};

const getDefaultApiBaseUrl = () =>
    process.env.NODE_ENV === "production"
        ? "https://demo-backend-1-0t5d.onrender.com"
        : "http://localhost:3001";

const isLocalhostUrl = (value) =>
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(String(value || "").trim());

const isLocalhostRuntime = () => {
    if (typeof window === "undefined") {
        return false;
    }

    return /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
};

const resolveApiBaseUrl = () => {
    const explicitBaseUrl = process.env.REACT_APP_API_URL || "";

    if (
        process.env.NODE_ENV === "production" &&
        isLocalhostUrl(explicitBaseUrl) &&
        !isLocalhostRuntime()
    ) {
        return getDefaultApiBaseUrl();
    }

    return (explicitBaseUrl || getDefaultApiBaseUrl()).replace(/\/+$/, "");
};

const ANIME_API_PATH = "/api/anime";

const DecadePage = () => {
    const navigate = useNavigate();
    const { decade } = useParams();
    const data = decadeData[decade];
    const [activeSeriesIndex, setActiveSeriesIndex] = useState(0);
    const [focusedSeries, setFocusedSeries] = useState(null);
    const [focusedSeriesExpanded, setFocusedSeriesExpanded] = useState(false);
    const [isCompactDetailView, setIsCompactDetailView] = useState(false);
    const [apiLoading, setApiLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [apiMatches, setApiMatches] = useState([]);
    const [animeImageMap, setAnimeImageMap] = useState({});
    const [expandedSections, setExpandedSections] = useState({
        keyDevelopments: true,
        influentialSeries: true,
        eraHighlights: true,
        eraImpact: true,
        connections: true,
        apiExplorer: false
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const apiBase = useMemo(() => resolveApiBaseUrl(), []);

    const currentEraPosition = eraOrder.indexOf(decade);
    const prevEra = currentEraPosition > 0 ? eraOrder[currentEraPosition - 1] : null;
    const nextEra =
        currentEraPosition >= 0 && currentEraPosition < eraOrder.length - 1
            ? eraOrder[currentEraPosition + 1]
            : null;

    const activeSeries = data?.series?.[activeSeriesIndex] || data?.series?.[0] || null;
    const highlight = eraHighlights[decade] || eraHighlights["1980s"];
    const impactStatement = useMemo(() => {
        if (data?.whyThisEraMatters?.length) {
            return data.whyThisEraMatters[0];
        }

        return `This era defined modern anime storytelling and expanded its global reach.`;
    }, [data]);

    const focusedSeriesPreview = useMemo(
        () => buildSeriesPreview(focusedSeries?.detail),
        [focusedSeries]
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 720px)");

        const handleChange = () => {
            setIsCompactDetailView(mediaQuery.matches);
        };

        handleChange();

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", handleChange);
            return () => mediaQuery.removeEventListener("change", handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    useEffect(() => {
        setFocusedSeriesExpanded(false);
    }, [focusedSeries]);

    useEffect(() => {
        setActiveSeriesIndex(0);
        setFocusedSeries(null);
        setFocusedSeriesExpanded(false);
        setApiMatches([]);
        setApiError("");
    }, [decade]);

    useEffect(() => {
        if (!focusedSeries || typeof document === "undefined") {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [focusedSeries]);

    useEffect(() => {
        if (!focusedSeries || typeof window === "undefined") {
            return;
        }

        const handleKeydown = (event) => {
            if (event.key === "Escape") {
                setFocusedSeries(null);
            }
        };

        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    }, [focusedSeries]);

    useEffect(() => {
        if (!data?.series?.length) {
            setAnimeImageMap({});
            return;
        }

        let isMounted = true;

        const syncAnimeImages = async () => {
            try {
                const response = await fetch(`${apiBase}${ANIME_API_PATH}`);
                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`);
                }

                const payload = await response.json();
                const list = Array.isArray(payload) ? payload : [];

                const mappedImages = list.reduce((acc, anime) => {
                    const key = normalizeTitle(anime?.title);
                    const imagePath = resolveApiImagePath(anime);
                    if (key && imagePath) {
                        acc[key] = toAbsoluteImageUrl(apiBase, imagePath);
                    }
                    return acc;
                }, {});

                if (isMounted) {
                    setAnimeImageMap(mappedImages);
                }
            } catch {
                if (isMounted) {
                    setAnimeImageMap({});
                }
            }
        };

        syncAnimeImages();

        return () => {
            isMounted = false;
        };
    }, [apiBase, data]);

    if (!data) {
        return <Navigate to="/" replace />;
    }

    const getSeriesImage = (series) => {
        const seriesName = series?.name || "";
        const normalizedTitle = normalizeTitle(seriesName);
        return (
            animeImageMap[normalizedTitle] ||
            localSeriesImageFallbacks[normalizedTitle] ||
            toLocalPublicImageUrl(resolveApiImagePath(series)) ||
            ""
        );
    };
    const activeSeriesImage =
        getSeriesImage(activeSeries) || toLocalPublicImageUrl(data.image);

    const handleExploreAllFromEra = async () => {
        setApiLoading(true);
        setApiError("");

        try {
            const response = await fetch(`${apiBase}${ANIME_API_PATH}`);
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            const payload = await response.json();
            const list = Array.isArray(payload) ? payload : [];
            const knownTitles = new Set((data.series || []).map((item) => normalizeTitle(item.name)));

            const matches = list.filter((item) => {
                const title = normalizeTitle(item.title || item.name);
                return knownTitles.has(title);
            });

            setApiMatches(matches);
            if (!matches.length) {
                setApiError("Connected to API, but no direct title matches were found for this era.");
            }
        } catch (error) {
            setApiMatches([]);
            setApiError("Could not load era anime from backend right now.");
        } finally {
            setApiLoading(false);
        }
    };

    return (
        <main className="decade-page" aria-live="polite">
            <section className="decade-stage decade-stage--popup">
                <div className="decade-frame">
                    <p className="decade-kicker">Japanese Animation History Archive</p>
                    <div className="decade-header">
                        <span aria-hidden="true"></span>
                        <h1>{decade}</h1>
                        <span aria-hidden="true"></span>
                    </div>

                    <nav className="decade-timeline-nav" aria-label="Navigate decades">
                        <button
                            type="button"
                            className="timeline-arrow"
                            disabled={!prevEra}
                            onClick={() => prevEra && navigate(`/${prevEra}`)}
                        >
                            {"\u2190"} {prevEra || "Start"}
                        </button>
                        <span className="timeline-current">{decade}</span>
                        <button
                            type="button"
                            className="timeline-arrow"
                            disabled={!nextEra}
                            onClick={() => nextEra && navigate(`/${nextEra}`)}
                        >
                            {nextEra || "End"} {"\u2192"}
                        </button>
                    </nav>

                    <div className="decade-columns">
                        <section className="decade-key decade-card">
                            <div className="decade-section-header">
                                <h2>Key Developments</h2>
                                <button
                                    type="button"
                                    className="decade-section-toggle"
                                    onClick={() => toggleSection("keyDevelopments")}
                                    aria-expanded={expandedSections.keyDevelopments}
                                    aria-controls="key-developments-content"
                                >
                                    {expandedSections.keyDevelopments ? "−" : "+"}
                                </button>
                            </div>
                            {expandedSections.keyDevelopments && (
                                <ul id="key-developments-content">
                                    {data.keyDevelopments.map((item, index) => (
                                        <li key={item}>
                                            <span className="development-icon" aria-hidden="true">
                                                {iconCycle[index % iconCycle.length]}
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section className="decade-series decade-card">
                            <div className="decade-section-header">
                                <h2>Influential Series</h2>
                                <button
                                    type="button"
                                    className="decade-section-toggle"
                                    onClick={() => toggleSection("influentialSeries")}
                                    aria-expanded={expandedSections.influentialSeries}
                                    aria-controls="influential-series-content"
                                >
                                    {expandedSections.influentialSeries ? "−" : "+"}
                                </button>
                            </div>
                            {expandedSections.influentialSeries && (
                            <div id="influential-series-content" className="series-layout">
                                <div className="series-list">
                                    {data.series.map((item, index) => {
                                        const syncedImage = getSeriesImage(item);
                                        return (
                                        <article
                                            className={`series-item ${
                                                activeSeriesIndex === index ? "is-active" : ""
                                            }`}
                                            key={item.name}
                                            onMouseEnter={() => setActiveSeriesIndex(index)}
                                            onFocus={() => setActiveSeriesIndex(index)}
                                            tabIndex={0}
                                        >
                                            {syncedImage && (
                                                <img
                                                    src={syncedImage}
                                                    alt={`${item.name} key art`}
                                                    className="series-thumb"
                                                    loading="lazy"
                                                />
                                            )}
                                            <h3>
                                                <span>{item.year}</span> - {item.name}
                                            </h3>
                                            <p>{item.detail}</p>
                                            <div className="series-tags" aria-label={`${item.name} tags`}>
                                                {(seriesTags[decade]?.[item.name] || ["Classic"]).map((tag) => (
                                                    <span className="series-tag" key={`${item.name}-${tag}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                className="learn-more-btn"
                                                onClick={() => setFocusedSeries(item)}
                                            >
                                                Learn More {"\u2192"}
                                            </button>
                                        </article>
                                        );
                                    })}
                                </div>

                                <figure className="series-figure" aria-live="polite">
                                    <img
                                        key={activeSeries?.name || decade}
                                        src={activeSeriesImage}
                                        alt={`${activeSeries?.name || decade} featured visual`}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <figcaption>
                                        {activeSeries?.name || `${decade} featured anime`} · API synced
                                    </figcaption>
                                </figure>
                            </div>
                            )}
                        </section>
                    </div>

                    <section className="era-highlights decade-card" aria-label="Era highlights">
                        <div className="decade-section-header">
                            <h2>Era Highlights</h2>
                            <button
                                type="button"
                                className="decade-section-toggle"
                                onClick={() => toggleSection("eraHighlights")}
                                aria-expanded={expandedSections.eraHighlights}
                                aria-controls="era-highlights-content"
                            >
                                {expandedSections.eraHighlights ? "−" : "+"}
                            </button>
                        </div>
                        {expandedSections.eraHighlights && (
                        <ul id="era-highlights-content">
                            <li>
                                <strong>Top Genre:</strong> {highlight.topGenre}
                            </li>
                            <li>
                                <strong>Avg Episodes:</strong> {highlight.avgEpisodes}
                            </li>
                            <li>
                                <strong>Studios Rising:</strong> {highlight.studiosRising}
                            </li>
                            <li>
                                <strong>Global Impact:</strong> {highlight.globalImpact}
                            </li>
                        </ul>
                        )}
                    </section>

                    <section className="era-impact-grid">
                        <article className="impact-card decade-card">
                            <div className="decade-section-header">
                                <h2>Why It Matters</h2>
                                <button
                                    type="button"
                                    className="decade-section-toggle"
                                    onClick={() => toggleSection("eraImpact")}
                                    aria-expanded={expandedSections.eraImpact}
                                    aria-controls="era-impact-content"
                                >
                                    {expandedSections.eraImpact ? "−" : "+"}
                                </button>
                            </div>
                            {expandedSections.eraImpact && (
                            <>
                            <p id="era-impact-content">{impactStatement}</p>
                            </>
                            )}
                        </article>

                        <article className="connections-card decade-card">
                            <div className="decade-section-header">
                                <h2>Connections</h2>
                                <button
                                    type="button"
                                    className="decade-section-toggle"
                                    onClick={() => toggleSection("connections")}
                                    aria-expanded={expandedSections.connections}
                                    aria-controls="connections-content"
                                >
                                    {expandedSections.connections ? "−" : "+"}
                                </button>
                            </div>
                            {expandedSections.connections && (
                            <ul id="connections-content">
                                {(eraConnections[decade] || []).map((entry) => (
                                    <li key={entry}>{entry}</li>
                                ))}
                            </ul>
                            )}
                        </article>
                    </section>

                    <section className="era-api-explorer decade-card" aria-label="Backend era sync">
                        <div className="api-explorer-header">
                            <h2>Explore All Anime From This Era</h2>
                            <div className="api-explorer-controls">
                                <button
                                    type="button"
                                    className="decade-section-toggle"
                                    onClick={() => toggleSection("apiExplorer")}
                                    aria-expanded={expandedSections.apiExplorer}
                                    aria-controls="api-explorer-content"
                                >
                                    {expandedSections.apiExplorer ? "−" : "+"}
                                </button>
                                <button
                                    type="button"
                                    className="explore-era-btn"
                                    onClick={handleExploreAllFromEra}
                                    disabled={apiLoading}
                                >
                                    {apiLoading ? "Loading..." : "Sync With Backend"}
                                </button>
                            </div>
                        </div>

                        {expandedSections.apiExplorer && (
                        <div id="api-explorer-content">
                            {apiError && <p className="api-message api-error">{apiError}</p>}
                            {!apiError && apiMatches.length > 0 && (
                                <p className="api-message">{apiMatches.length} matching titles found in API.</p>
                            )}

                            {apiMatches.length > 0 && (
                                <ul className="api-match-list">
                                    {apiMatches.slice(0, 6).map((item) => (
                                        <li key={item.id || item.title}>{item.title}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        )}
                    </section>

                    {focusedSeries && (
                        <section
                            className="series-detail-modal"
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="series-detail-title"
                            onClick={() => setFocusedSeries(null)}
                        >
                            <div
                                className="series-detail-shell"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <div className="series-detail-header">
                                    <div>
                                        <p className="series-detail-kicker">Series spotlight</p>
                                        <h2 id="series-detail-title">{focusedSeries.name}</h2>
                                        <p className="series-detail-year">
                                            <strong>{focusedSeries.year}</strong>
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="series-detail-close"
                                        onClick={() => setFocusedSeries(null)}
                                        aria-label="Close modal"
                                    >
                                        Close
                                    </button>
                                </div>

                                <div className="series-detail-body">
                                    {getSeriesImage(focusedSeries) && (
                                        <img
                                            src={getSeriesImage(focusedSeries)}
                                            alt={`${focusedSeries.name} full art`}
                                            className="series-detail-image"
                                            loading="lazy"
                                        />
                                    )}

                                    <p
                                        className={`series-detail-summary ${
                                            isCompactDetailView ? "series-detail-summary--preview" : ""
                                        }`}
                                    >
                                        {focusedSeriesPreview}
                                    </p>

                                    <button
                                        type="button"
                                        className="series-detail-expand-btn"
                                        onClick={() => setFocusedSeriesExpanded((current) => !current)}
                                        aria-expanded={focusedSeriesExpanded}
                                        aria-controls="series-detail-more"
                                    >
                                        {focusedSeriesExpanded ? "Show less" : "Read more"}
                                    </button>

                                    <div
                                        id="series-detail-more"
                                        className={`series-detail-more ${
                                            focusedSeriesExpanded ? "is-open" : ""
                                        }`}
                                        hidden={!focusedSeriesExpanded}
                                    >
                                        <p className="series-detail-full">{focusedSeries.detail}</p>
                                        <div
                                            className="series-tags"
                                            aria-label={`${focusedSeries.name} tags`}
                                        >
                                            {(seriesTags[decade]?.[focusedSeries.name] || ["Classic"]).map(
                                                (tag) => (
                                                    <span
                                                        className="series-tag"
                                                        key={`${focusedSeries.name}-${tag}`}
                                                    >
                                                        {tag}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    <Link className="decade-close" to="/anime-eras">CLOSE</Link>
                </div>
            </section>
        </main>
    );
};

export default DecadePage;
