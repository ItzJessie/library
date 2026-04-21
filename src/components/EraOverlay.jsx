import { useCallback, useEffect, useRef, useState } from "react";
import animeSeries from "../data/animeSeries.json";

const SHEET_CLOSE_THRESHOLD = 96;

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

const findLocalSeriesDetails = (seriesTitle) =>
    animeSeries.find(
        (anime) => anime.title.toLowerCase() === seriesTitle.toLowerCase()
    );

const EraOverlay = ({
    era,
    isOpen,
    onClose,
    onNavigateEra,
    prevEraId,
    nextEraId,
}) => {
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [seriesDetails, setSeriesDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sheetOffset, setSheetOffset] = useState(0);
    const [selectedSeriesExpanded, setSelectedSeriesExpanded] = useState(false);
    const [isCompactDetailView, setIsCompactDetailView] = useState(false);
    const [collapsedSections, setCollapsedSections] = useState({
        keyDevelopments: false,
        influentialSeries: false,
        whyThisEraMatters: false,
        recommendations: false,
    });
    const sheetStartYRef = useRef(null);
    const sheetOffsetRef = useRef(0);
    const requestIdRef = useRef(0);
    const closeButtonRef = useRef(null);

    const API_URL = resolveApiBaseUrl();

    const handleClose = useCallback(() => {
        requestIdRef.current += 1;
        setSheetOffset(0);
        sheetOffsetRef.current = 0;
        sheetStartYRef.current = null;
        setSelectedSeriesExpanded(false);
        setLoading(false);
        setError(null);
        onClose();
    }, [onClose]);

    const handleBackToList = useCallback(() => {
        requestIdRef.current += 1;
        setSelectedSeries(null);
        setSeriesDetails(null);
        setError(null);
        setLoading(false);
        setSelectedSeriesExpanded(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                if (selectedSeries) {
                    handleBackToList();
                } else {
                    handleClose();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, era, handleBackToList, handleClose, selectedSeries]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        closeButtonRef.current?.focus();
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            requestIdRef.current += 1;
            setSheetOffset(0);
            sheetOffsetRef.current = 0;
            sheetStartYRef.current = null;
            setSelectedSeriesExpanded(false);
            setLoading(false);
            return;
        }

        requestIdRef.current += 1;
        setSelectedSeries(null);
        setSeriesDetails(null);
        setError(null);
        setSheetOffset(0);
        sheetOffsetRef.current = 0;
        sheetStartYRef.current = null;
        setSelectedSeriesExpanded(false);

        const mediaQuery = window.matchMedia("(max-width: 720px)");
        const updateCompactView = () => {
            setIsCompactDetailView(mediaQuery.matches);
        };
        let removeListener = () => {};

        updateCompactView();

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener("change", updateCompactView);
            removeListener = () => mediaQuery.removeEventListener("change", updateCompactView);
        } else {
            mediaQuery.addListener(updateCompactView);
            removeListener = () => mediaQuery.removeListener(updateCompactView);
        }

        const mobileDefaults = mediaQuery.matches;

        setCollapsedSections({
            keyDevelopments: false,
            influentialSeries: false,
            whyThisEraMatters: mobileDefaults,
            recommendations: mobileDefaults,
        });

        return () => {
            removeListener();
        };
    }, [isOpen, era.id]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleSheetTouchStart = (event) => {
        const touch = event.touches[0];
        if (!touch) {
            return;
        }

        sheetStartYRef.current = touch.clientY;
        sheetOffsetRef.current = 0;
        setSheetOffset(0);
    };

    const handleSheetTouchMove = (event) => {
        if (sheetStartYRef.current === null) {
            return;
        }

        const touch = event.touches[0];
        if (!touch) {
            return;
        }

        const deltaY = touch.clientY - sheetStartYRef.current;
        if (deltaY <= 0) {
            sheetOffsetRef.current = 0;
            setSheetOffset(0);
            return;
        }

        const nextOffset = Math.min(deltaY, 140);
        sheetOffsetRef.current = nextOffset;
        setSheetOffset(nextOffset);
    };

    const resetSheetDrag = () => {
        sheetStartYRef.current = null;
        sheetOffsetRef.current = 0;
        setSheetOffset(0);
    };

    const handleSheetTouchEnd = () => {
        const finalOffset = sheetOffsetRef.current;
        sheetStartYRef.current = null;

        if (finalOffset >= SHEET_CLOSE_THRESHOLD) {
            handleClose();
            return;
        }

        resetSheetDrag();
    };

    const fetchSeriesDetails = async (seriesTitle) => {
        const requestId = requestIdRef.current + 1;
        requestIdRef.current = requestId;

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/api/anime`);

            if (requestId !== requestIdRef.current) {
                return;
            }

            if (!response.ok) {
                const localSeries = findLocalSeriesDetails(seriesTitle);
                if (localSeries) {
                    setSeriesDetails(localSeries);
                    return;
                }

                throw new Error(`Failed to fetch anime data: ${response.status}`);
            }
            const animeList = await response.json();

            if (requestId !== requestIdRef.current) {
                return;
            }

            const foundAnime = animeList.find(
                (anime) => anime.title.toLowerCase() === seriesTitle.toLowerCase()
            );

            if (!foundAnime) {
                const localSeries = findLocalSeriesDetails(seriesTitle);
                if (localSeries) {
                    setSeriesDetails(localSeries);
                    setError(null);
                } else {
                    setError(`"${seriesTitle}" not found in database`);
                    setSeriesDetails(null);
                }
            } else {
                setSeriesDetails(foundAnime);
            }
        } catch (err) {
            if (requestId !== requestIdRef.current) {
                return;
            }

            const localSeries = findLocalSeriesDetails(seriesTitle);
            if (localSeries) {
                setSeriesDetails(localSeries);
                setError(null);
            } else {
                console.error("Error fetching series details:", err);
                setError("Unable to load details. Please try again.");
            }
        } finally {
            if (requestId === requestIdRef.current) {
                setLoading(false);
            }
        }
    };

    const handleSeriesClick = (series) => {
        if (!series?.title) {
            return;
        }

        setSelectedSeries(series);
        setSeriesDetails(null);
        setError(null);
        setSelectedSeriesExpanded(false);
        fetchSeriesDetails(series.title);
    };

    const toggleSection = (sectionName) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [sectionName]: !prev[sectionName],
        }));
    };

    const renderCollapsibleSection = (sectionName, title, content) => {
        const isCollapsed = collapsedSections[sectionName];

        return (
            <section className="decade-section-card">
                <button
                    type="button"
                    className="decade-section-toggle"
                    onClick={() => toggleSection(sectionName)}
                    aria-expanded={!isCollapsed}
                >
                    <span>{title}</span>
                    <span
                        className={`decade-section-caret ${
                            isCollapsed ? "is-collapsed" : ""
                        }`}
                        aria-hidden="true"
                    >
                        ▾
                    </span>
                </button>
                <div
                    className={`decade-section-panel ${
                        isCollapsed ? "is-collapsed" : ""
                    }`}
                    hidden={isCollapsed}
                >
                    {content}
                </div>
            </section>
        );
    };

    return (
        <section
            className={`era-overlay ${isOpen ? "is-open" : ""}`}
            id={`era-overlay-${era.id}`}
            data-era={era.id}
            aria-hidden={!isOpen}
            aria-labelledby={`era-title-${era.id}`}
            role="dialog"
            aria-modal={isOpen}
            onClick={handleBackdropClick}
        >
            <div
                className="era-overlay__panel"
                role="document"
                style={{
                    "--sheet-offset": `${sheetOffset}px`,
                }}
            >
                <div className="decade-stage">
                    <div className="decade-frame">
                        <div
                            className="era-overlay__drag-handle"
                            aria-hidden="true"
                            onTouchStart={handleSheetTouchStart}
                            onTouchMove={handleSheetTouchMove}
                            onTouchEnd={handleSheetTouchEnd}
                            onTouchCancel={resetSheetDrag}
                        ></div>

                        <div className="decade-topbar">
                            <p className="decade-kicker">
                                Japanese Animation History Archive
                            </p>
                            <div className="decade-header">
                                <span aria-hidden="true"></span>
                                <h1 id={`era-title-${era.id}`}>{era.id}</h1>
                                <span aria-hidden="true"></span>
                            </div>

                            <nav className="era-inline-nav" aria-label="Era navigation">
                                <button
                                    type="button"
                                    className="era-inline-nav__button"
                                    onClick={() => onNavigateEra?.(prevEraId)}
                                    disabled={!prevEraId}
                                >
                                    {"\u2190"} Previous Era {prevEraId ? `(${prevEraId})` : ""}
                                </button>
                                <button
                                    type="button"
                                    className="era-inline-nav__button"
                                    onClick={() => onNavigateEra?.(nextEraId)}
                                    disabled={!nextEraId}
                                >
                                    Next Era {nextEraId ? `(${nextEraId})` : ""} {"\u2192"}
                                </button>
                            </nav>
                        </div>

                        <div className="era-overlay__content">
                            {!selectedSeries ? (
                                <>
                                    <div className="decade-columns">
                                        <div className="decade-key">
                                            {renderCollapsibleSection(
                                                "keyDevelopments",
                                                "Key Developments",
                                                <ul>
                                                    {era.keyDevelopments &&
                                                        era.keyDevelopments.map(
                                                            (development, idx) => (
                                                                <li key={idx}>
                                                                    {development}
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            )}
                                        </div>

                                        <div className="decade-series">
                                            {renderCollapsibleSection(
                                                "influentialSeries",
                                                "Influential Series",
                                                <div className="series-layout">
                                                    <div className="series-list">
                                                        {era.influentialSeries &&
                                                            era.influentialSeries.map(
                                                                (series, idx) => (
                                                                    <button
                                                                        type="button"
                                                                        key={idx}
                                                                        className="series-item"
                                                                        onClick={() =>
                                                                            handleSeriesClick(series)
                                                                        }
                                                                        aria-label={`Learn more about ${series.title}`}
                                                                    >
                                                                        {series.image && (
                                                                            <div className="series-image-wrapper">
                                                                                <img
                                                                                    src={`${process.env.PUBLIC_URL}/${series.image}`}
                                                                                    alt={`${series.title} poster`}
                                                                                    className="series-poster"
                                                                                    loading="lazy"
                                                                                />
                                                                                <div className="series-overlay-hover"></div>
                                                                            </div>
                                                                        )}
                                                                        <div className="series-content">
                                                                            <h3>
                                                                                <span>
                                                                                    {series.year}
                                                                                </span>{" "}
                                                                                -{" "}
                                                                                {series.title}
                                                                            </h3>
                                                                            <p>{series.description}</p>
                                                                        </div>
                                                                    </button>
                                                                )
                                                            )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="decade-context-grid">
                                        {renderCollapsibleSection(
                                            "whyThisEraMatters",
                                            `Why the ${era.id} mattered`,
                                            <ul className="era-context-list">
                                                {(era.whyThisEraMatters || []).map(
                                                    (point, idx) => (
                                                        <li key={idx}>{point}</li>
                                                    )
                                                )}
                                            </ul>
                                        )}

                                        {renderCollapsibleSection(
                                            "recommendations",
                                            "If you like this era...",
                                            <div className="era-recommendations-list">
                                                {(era.eraRecommendations || []).map(
                                                    (recommendation, idx) => (
                                                        <article
                                                            className="era-recommendation"
                                                            key={idx}
                                                        >
                                                            <h3>{recommendation.title}</h3>
                                                            <p>{recommendation.description}</p>
                                                            {recommendation.targetEraId && (
                                                                <button
                                                                    type="button"
                                                                    className="era-jump-btn"
                                                                    onClick={() =>
                                                                        onNavigateEra?.(
                                                                            recommendation.targetEraId
                                                                        )
                                                                    }
                                                                >
                                                                    Explore {recommendation.targetEraId}
                                                                </button>
                                                            )}
                                                        </article>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="series-detail-view">
                                    <button
                                        type="button"
                                        className="back-button"
                                        onClick={handleBackToList}
                                        aria-label="Back to list"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            aria-hidden="true"
                                        >
                                            <path d="M15 19l-7-7 7-7"></path>
                                        </svg>
                                        Back
                                    </button>

                                    <div className="detail-content">
                                        <div className="detail-image-section">
                                            {selectedSeries.image && (
                                                <img
                                                    src={`${process.env.PUBLIC_URL}/${selectedSeries.image}`}
                                                    alt={`${selectedSeries.title} poster`}
                                                    className="detail-poster"
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            )}
                                        </div>

                                        <div className="detail-info-section">
                                            <h2>{selectedSeries.title}</h2>
                                            <div className="detail-meta">
                                                <span className="year-badge">
                                                    {selectedSeries.year}
                                                </span>
                                            </div>
                                            <p className="detail-description">
                                                {selectedSeries.description}
                                            </p>

                                            {isCompactDetailView ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        className="series-detail-expand-btn"
                                                        onClick={() =>
                                                            setSelectedSeriesExpanded(
                                                                (current) => !current
                                                            )
                                                        }
                                                        aria-expanded={selectedSeriesExpanded}
                                                    >
                                                        {selectedSeriesExpanded
                                                            ? "Show less"
                                                            : "Read more"}
                                                    </button>

                                                    <div
                                                        className="detail-extra"
                                                        hidden={!selectedSeriesExpanded}
                                                    >
                                                        <div className="detail-extra-stack">
                                                            {loading && (
                                                                <div className="loading-state">
                                                                    <div className="anime-silhouette-loader" aria-hidden="true">
                                                                        <span className="anime-silhouette-loader__halo"></span>
                                                                        <span className="anime-silhouette-loader__head"></span>
                                                                        <span className="anime-silhouette-loader__hair"></span>
                                                                        <span className="anime-silhouette-loader__torso"></span>
                                                                        <span className="anime-silhouette-loader__blade"></span>
                                                                    </div>
                                                                    <p className="loading-text">
                                                                        Summoning character dossier...
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {error && (
                                                                <div className="error-state">
                                                                    <p className="error-text">
                                                                        Unable to load details. Please try again.
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {!loading && !error && seriesDetails && (
                                                                <div className="series-info-grid">
                                                                    {seriesDetails.studio && (
                                                                        <div className="info-item">
                                                                            <span className="info-label">
                                                                                Studio:
                                                                            </span>
                                                                            <span className="info-value">
                                                                                {seriesDetails.studio}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {seriesDetails.episodes && (
                                                                        <div className="info-item">
                                                                            <span className="info-label">
                                                                                Episodes:
                                                                            </span>
                                                                            <span className="info-value">
                                                                                {seriesDetails.episodes}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                    {seriesDetails.genre && (
                                                                        <div className="info-item">
                                                                            <span className="info-label">
                                                                                Genre:
                                                                            </span>
                                                                            <span className="info-value">
                                                                                {seriesDetails.genre}
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="media-showcase">
                                                                <h3>Trailer / Clip Section</h3>
                                                                {selectedSeries.media ? (
                                                                    <div className="media-grid">
                                                                        {selectedSeries.media.trailerEmbed && (
                                                                            <div className="media-card">
                                                                                <h4>
                                                                                    {selectedSeries.media.trailerLabel ||
                                                                                        `${selectedSeries.title} trailer`}
                                                                                </h4>
                                                                                <iframe
                                                                                    src={selectedSeries.media.trailerEmbed}
                                                                                    title={`${selectedSeries.title} trailer`}
                                                                                    loading="lazy"
                                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                    allowFullScreen
                                                                                ></iframe>
                                                                            </div>
                                                                        )}

                                                                        {selectedSeries.media.clipEmbed && (
                                                                            <div className="media-card">
                                                                                <h4>
                                                                                    {selectedSeries.media.clipLabel ||
                                                                                        `${selectedSeries.title} opening clip`}
                                                                                </h4>
                                                                                <iframe
                                                                                    src={selectedSeries.media.clipEmbed}
                                                                                    title={`${selectedSeries.title} clip`}
                                                                                    loading="lazy"
                                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                    allowFullScreen
                                                                                ></iframe>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <p className="placeholder-text">
                                                                        Media highlights for this title are coming soon.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="detail-extra is-open">
                                                    <div className="detail-extra-stack">
                                                        {loading && (
                                                            <div className="loading-state">
                                                                <div className="anime-silhouette-loader" aria-hidden="true">
                                                                    <span className="anime-silhouette-loader__halo"></span>
                                                                    <span className="anime-silhouette-loader__head"></span>
                                                                    <span className="anime-silhouette-loader__hair"></span>
                                                                    <span className="anime-silhouette-loader__torso"></span>
                                                                    <span className="anime-silhouette-loader__blade"></span>
                                                                </div>
                                                                <p className="loading-text">
                                                                    Summoning character dossier...
                                                                </p>
                                                            </div>
                                                        )}
                                                        {error && (
                                                            <div className="error-state">
                                                                <p className="error-text">
                                                                    Unable to load details. Please try again.
                                                                </p>
                                                            </div>
                                                        )}
                                                        {!loading && !error && seriesDetails && (
                                                            <div className="series-info-grid">
                                                                {seriesDetails.studio && (
                                                                    <div className="info-item">
                                                                        <span className="info-label">
                                                                            Studio:
                                                                        </span>
                                                                        <span className="info-value">
                                                                            {seriesDetails.studio}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {seriesDetails.episodes && (
                                                                    <div className="info-item">
                                                                        <span className="info-label">
                                                                            Episodes:
                                                                        </span>
                                                                        <span className="info-value">
                                                                            {seriesDetails.episodes}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {seriesDetails.genre && (
                                                                    <div className="info-item">
                                                                        <span className="info-label">
                                                                            Genre:
                                                                        </span>
                                                                        <span className="info-value">
                                                                            {seriesDetails.genre}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        <div className="media-showcase">
                                                            <h3>Trailer / Clip Section</h3>
                                                            {selectedSeries.media ? (
                                                                <div className="media-grid">
                                                                    {selectedSeries.media.trailerEmbed && (
                                                                        <div className="media-card">
                                                                            <h4>
                                                                                {selectedSeries.media.trailerLabel ||
                                                                                    `${selectedSeries.title} trailer`}
                                                                            </h4>
                                                                            <iframe
                                                                                src={selectedSeries.media.trailerEmbed}
                                                                                title={`${selectedSeries.title} trailer`}
                                                                                loading="lazy"
                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                allowFullScreen
                                                                            ></iframe>
                                                                        </div>
                                                                    )}

                                                                    {selectedSeries.media.clipEmbed && (
                                                                        <div className="media-card">
                                                                            <h4>
                                                                                {selectedSeries.media.clipLabel ||
                                                                                    `${selectedSeries.title} opening clip`}
                                                                            </h4>
                                                                            <iframe
                                                                                src={selectedSeries.media.clipEmbed}
                                                                                title={`${selectedSeries.title} clip`}
                                                                                loading="lazy"
                                                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                                allowFullScreen
                                                                            ></iframe>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="placeholder-text">
                                                                    Media highlights for this title are coming soon.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className="modal-close"
                            data-close
                            ref={closeButtonRef}
                            onClick={handleClose}
                            aria-label="Close modal"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EraOverlay;