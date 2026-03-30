import { useState } from "react";
import { Link } from "react-router-dom";
import { eraPanels } from "../data/siteData";
import "../css/AnimeErasPage.css";
import EraPanelCard from "../components/EraPanelCard";
import EraOverlay from "../components/EraOverlay";
import { useEraInteractions } from "../hooks/useEraInteractions";

const AnimeEras = () => {
    const [activeEra, setActiveEra] = useState(null);
    const { openOverlay, closeOverlay } = useEraInteractions();
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

    return (
        <>
            <main className="page-eras">
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
                                <li key={era.id} data-era={era.id}>
                                    <button
                                        className="era-trigger"
                                        type="button"
                                        data-era={era.id}
                                        onClick={() => handleEraClick(era.id)}
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
            <section className="era-gallery">
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
            {eraPanels.map((era) => (
                <EraOverlay
                    key={`overlay-${era.id}`}
                    era={era}
                    isOpen={activeEra === era.id}
                    onClose={handleCloseOverlay}
                />
            ))}
        </>
    );
};

export default AnimeEras;
