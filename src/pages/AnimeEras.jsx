import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { eraPanels } from "../data/siteData";
import "../css/AnimeErasPage.css";
import EraPanelCard from "../components/EraPanelCard";
import EraOverlay from "../components/EraOverlay";
import { useEraInteractions } from "../hooks/useEraInteractions";

const AnimeEras = () => {
    const [activeEra, setActiveEra] = useState(null);
    const [chapterCut, setChapterCut] = useState(null);
    const { openOverlay, closeOverlay } = useEraInteractions();
    const chapterCutIdRef = useRef(0);
    const orderedEraIds = eraPanels.map((era) => era.id);
    const eraGalleryCards = [
        {
            title: "1980s Innovation",
            description: "Revolutionary mecha and action anime",
            image: "anime-1.png",
            alt: "Iconic 1980s anime moment",
            decade: "1980s"
        },
        {
            title: "Golden Era",
            description: "The rise of shounen anime",
            image: "1980s img.png",
            alt: "Classic 1980s anime",
            decade: "1980s"
        },
        {
            title: "1990s Boom",
            description: "TV anime reaches new heights",
            image: "1990s img.png",
            alt: "1990s anime classic",
            decade: "1990s"
        },
        {
            title: "Digital Era",
            description: "Modern animation techniques emerge",
            image: "naruto-shippuden-anime-featured-image-naruto-uzumaki-from-naruto-shippuden 1.png",
            alt: "2000s anime milestone",
            decade: "2000s"
        },
        {
            title: "Modern Masterpieces",
            description: "Diverse storytelling and visual innovation",
            image: "best-2010s-anime-by-year-steins-gate-cropped 1.png",
            alt: "2010s modern anime",
            decade: "2010s"
        },
        {
            title: "Contemporary Wave",
            description: "Global streaming transforms anime",
            image: "jujutsu-kaisen 1.png",
            alt: "2020s contemporary anime",
            decade: "2020s"
        }
    ];

    const handleEraClick = (eraId) => {
        if (activeEra && activeEra !== eraId) {
            chapterCutIdRef.current += 1;
            setChapterCut({
                id: chapterCutIdRef.current,
                label: `${activeEra} to ${eraId}`
            });
        }

        const overlayElement = document.querySelector(
            `[data-era="${eraId}"].era-overlay`
        );
        if (overlayElement) {
            openOverlay(overlayElement, eraId);
            setActiveEra(eraId);
        }
    };

    const handleCloseOverlay = () => {
        const overlayElement = activeEra
            ? document.querySelector(`[data-era="${activeEra}"].era-overlay`)
            : null;
        if (overlayElement) {
            closeOverlay(overlayElement);
        }
        setActiveEra(null);
    };

    const handleNavigateEra = (targetEraId) => {
        if (!targetEraId) {
            return;
        }

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (!prefersReducedMotion && activeEra && activeEra !== targetEraId) {
            chapterCutIdRef.current += 1;
            setChapterCut({
                id: chapterCutIdRef.current,
                label: `${activeEra} to ${targetEraId}`
            });
        }

        const overlayElement = document.querySelector(
            `[data-era="${targetEraId}"].era-overlay`
        );

        if (overlayElement) {
            openOverlay(overlayElement, targetEraId);
            setActiveEra(targetEraId);
        }
    };

    return (
        <>
            {chapterCut ? (
                <div
                    key={chapterCut.id}
                    className="era-chapter-cut"
                    aria-hidden="true"
                    onAnimationEnd={() => {
                        setChapterCut((current) =>
                            current && current.id === chapterCut.id ? null : current
                        );
                    }}
                >
                    <span className="era-chapter-cut__label">
                        Chapter Cut: {chapterCut.label}
                    </span>
                </div>
            ) : null}

            <main className="page-eras decorative-element-container">
                {/* Japanese Decorative Elements - Cherry Blossoms */}
                <svg className="decorative-sakura" viewBox="0 0 100 100" width="60" height="60" style={{ top: "10%", left: "5%" }}>
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="30" cy="30" r="8" fill="currentColor"/>
                    <circle cx="70" cy="30" r="8" fill="currentColor"/>
                    <circle cx="50" cy="20" r="8" fill="currentColor"/>
                    <circle cx="30" cy="70" r="8" fill="currentColor"/>
                    <circle cx="70" cy="70" r="8" fill="currentColor"/>
                </svg>
                
                <svg className="decorative-sakura" viewBox="0 0 100 100" width="50" height="50" style={{ top: "60%", right: "8%", opacity: 0.05 }}>
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="30" cy="30" r="8" fill="currentColor"/>
                    <circle cx="70" cy="30" r="8" fill="currentColor"/>
                    <circle cx="50" cy="20" r="8" fill="currentColor"/>
                    <circle cx="30" cy="70" r="8" fill="currentColor"/>
                    <circle cx="70" cy="70" r="8" fill="currentColor"/>
                </svg>
                
                {/* Artistic Decorative Lines */}
                <svg className="decorative-line" viewBox="0 0 200 100" width="200" height="100" style={{ top: "30%", right: "2%" }}>
                    <path d="M 20 30 Q 80 10, 140 50 T 200 50" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
                    <path d="M 10 70 Q 80 90, 150 60" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                </svg>

                <section className="eras-hero">
                    <div className="eras-hero-inner" data-parallax="0.08">
                        <p className="eras-kicker">
                            Japanese Animation History Archive
                        </p>
                        <h1>Anime Eras</h1>
                        <p className="eras-subtitle">
                            Where anime history comes to life—one era at a time.
                        </p>
                        <div className="eras-hero-icons" aria-hidden="true">
                            <span className="era-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="12" r="9"></circle>
                                    <path d="M12 3v6M12 15v6M3 12h6M15 12h6"></path>
                                </svg>
                            </span>
                            <span className="era-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="12" r="9"></circle>
                                    <path d="M7 12h10M12 7v10"></path>
                                </svg>
                            </span>
                            <span className="era-icon">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="12" r="9"></circle>
                                    <path d="M8 8l8 8M16 8l-8 8"></path>
                                </svg>
                            </span>
                        </div>
                    </div>
                </section>

                <section className="eras-layout">
                    <aside className="eras-sidebar" aria-label="Years covered">
                        <h2>Years Covered</h2>
                        <ul>
                            {eraPanels.map((era) => (
                                <li
                                    key={era.id}
                                    data-era={era.id}
                                    className={activeEra === era.id ? "is-active" : ""}
                                >
                                    <button
                                        className="era-trigger"
                                        type="button"
                                        data-era={era.id}
                                        onClick={() => handleEraClick(era.id)}
                                        aria-label={`View ${era.id} era details`}
                                    >
                                        {era.id}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <div className="eras-timeline">
                        <div className="eras-track" aria-hidden="true"></div>
                        {eraPanels.map((era) => (
                            <EraPanelCard key={era.id} era={era} />
                        ))}
                    </div>
                </section>
            </main>

            {/* Era Gallery Section */}
            <section className="era-gallery decorative-element-container">
                {/* Decorative Line at Gallery Top */}
                <svg className="decorative-line" viewBox="0 0 300 60" width="300" height="60" style={{ position: "absolute", top: "20px", left: "50%", transform: "translateX(-50%)", opacity: 0.08 }}>
                    <line x1="10" y1="30" x2="290" y2="30" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="50" cy="30" r="3" fill="currentColor"/>
                    <circle cx="150" cy="30" r="3" fill="currentColor"/>
                    <circle cx="250" cy="30" r="3" fill="currentColor"/>
                </svg>

                <div className="gallery-inner">
                    <h2>Iconic Anime Moments Through the Ages</h2>
                    <p>Explore landmark series that defined each era</p>
                    <div className="gallery-grid">
                        {eraGalleryCards.map((card) => (
                            <Link
                                key={`${card.title}-${card.decade}`}
                                to={`/${card.decade}`}
                                className="gallery-card reveal tilt-card"
                                data-tilt
                                aria-label={`Explore ${card.decade} era`}
                            >
                                <img
                                    src={`${process.env.PUBLIC_URL}/images/${card.image}`}
                                    alt={card.alt}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="gallery-content">
                                    <h3>{card.title}</h3>
                                    <p>{card.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Era Overlay Modals */}
            {eraPanels.map((era, index) => {
                const prevEraId = index > 0 ? orderedEraIds[index - 1] : null;
                const nextEraId =
                    index < orderedEraIds.length - 1
                        ? orderedEraIds[index + 1]
                        : null;

                return (
                    <EraOverlay
                        key={`overlay-${era.id}`}
                        era={era}
                        isOpen={activeEra === era.id}
                        onClose={handleCloseOverlay}
                        onNavigateEra={handleNavigateEra}
                        prevEraId={prevEraId}
                        nextEraId={nextEraId}
                    />
                );
            })}
        </>
    );
};

export default AnimeEras;
