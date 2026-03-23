import { Link } from "react-router-dom";
import { eraPanels } from "../data/siteData";
import "../css/AnimeErasPage.css";
import EraPanelCard from "../components/EraPanelCard";

const AnimeEras = () => {
    return (
        <main className="page-eras">
            <section className="eras-hero">
                <div className="eras-hero-inner">
                    <p className="eras-kicker">Japanese Animation History Archive</p>
                    <h1>Anime Eras</h1>
                    <p className="eras-subtitle">Where anime history comes to life, one era at a time.</p>
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
                            <li key={era.id}>
                                <Link className="era-trigger" to={`/${era.id}`}>
                                    {era.id}
                                </Link>
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
    );
};

export default AnimeEras;
