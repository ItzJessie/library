import "../css/Home.css";
import { Link, useOutletContext } from "react-router-dom";
import HomeFeatureCard from "../components/HomeFeatureCard";
import HomeArchiveCard from "../components/HomeArchiveCard";
import ContactForm from "../components/ContactForm";
import { useEraInteractions } from "../hooks/useEraInteractions";

const featuredCards = [
    {
        id: "popular-animation",
        title: "Popular Animation",
        period: "Mid 1980s",
        meta: "The rise of iconic sci-fi and action anime.",
        image: `${process.env.PUBLIC_URL}/images/image (1).png`,
        alt: "Popular animation still",
        toneClass: "gold-1"
    },
    {
        id: "longest-animation",
        title: "Longest Animation",
        period: "1980-1990s",
        meta: "Explore the longest-running anime series.",
        image: `${process.env.PUBLIC_URL}/images/image (2).png`,
        alt: "Longest animation still",
        toneClass: "gold-2"
    },
    {
        id: "color-animation",
        title: "Color Animation",
        period: "1990-2000s",
        meta: "Vibrant and colorful anime from the 90s and 2000s.",
        image: `${process.env.PUBLIC_URL}/images/image (3).png`,
        alt: "Color animation still",
        toneClass: "gold-3"
    }
];

const archiveCards = [
    {
        id: "early-1960s",
        title: "Early 1960s",
        subtitle: "Astro Boy (Tetsuwan Atom)",
        detail:
            "Japan's first major TV anime series established the production model that shaped the industry for decades.",
        image: `${process.env.PUBLIC_URL}/images/image (4).png`,
        alt: "Early 1960s still"
    },
    {
        id: "early-1980s",
        title: "Early 1980s",
        subtitle: "Nausicaa of the Valley of the Wind",
        detail: "A landmark film that signaled a new wave of environmental storytelling.",
        image: `${process.env.PUBLIC_URL}/images/image.png`,
        alt: "Early 1980s still"
    },
    {
        id: "late-1980s",
        title: "Late 1980s",
        subtitle: "Akira",
        detail: "A genre-defining breakthrough that redefined perceptions of anime through cinematic scale and cyberpunk themes.",
        image: `${process.env.PUBLIC_URL}/images/image (5).png`,
        alt: "Late 1980s still",
        wide: true
    }
];

const Home = () => {
    useEraInteractions();
    const outletContext = useOutletContext();
    const searchPreview = outletContext?.searchPreview;
    const hasLiveSearchPreview = Boolean(
        searchPreview?.isOpen &&
            searchPreview?.query?.trim() &&
            Array.isArray(searchPreview?.results) &&
            searchPreview.results.length > 0
    );

    return (
        <main className="page-home">
            <section className="hero">
                <div className="hero-parallax" aria-hidden="true"></div>
                <div className="hero-content reveal reveal-up">
                    <h1>Japanese Animation History Archive</h1>
                    <p>
                        Preserving the history, artistry, and cultural impact of Japanese animation
                        from pre-war experimentation to global modern anime.
                    </p>
                </div>
            </section>

            {hasLiveSearchPreview && (
                <section className="home-search-preview reveal reveal-up" aria-label="Live search results">
                    <div className="home-search-preview-header">
                        <h2>Live Search Preview</h2>
                        <p>
                            Showing matches for <strong>{searchPreview.query}</strong>
                        </p>
                    </div>
                    <div className="home-search-preview-grid">
                        {searchPreview.results.slice(0, 6).map((entry) => (
                            <article className="home-search-result-card" key={entry.id}>
                                <p className="home-search-result-type">{entry.type}</p>
                                <h3>{entry.title}</h3>
                                <p>{entry.subtitle}</p>
                                <div className="home-search-result-meta">
                                    {entry.era && <span>{entry.era}</span>}
                                    {entry.mood && <span>{entry.mood}</span>}
                                </div>
                                <Link className="home-search-result-link" to={entry.route}>
                                    Open
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <section className="content-grid">
                <div className="featured reveal reveal-left">
                    <h2>Featured Sections</h2>
                    <p className="section-tag">Anime Eras</p>
                    <div className="card-grid">
                        {featuredCards.map((card) => (
                            <HomeFeatureCard key={card.id} {...card} />
                        ))}
                    </div>
                </div>

                <div className="archive reveal reveal-right">
                    <h2>From the Archive</h2>
                    <div className="archive-grid">
                        {archiveCards.map((card) => (
                            <HomeArchiveCard key={card.id} {...card} />
                        ))}
                    </div>
                </div>

                <aside className="timeline">
                    <div className="timeline-card tilt-card reveal reveal-up">
                        <div className="timeline-illustration" aria-hidden="true"></div>
                        <h3>Timeline of Japanese Animation</h3>
                        <p>1917-2020s</p>
                        <Link className="timeline-button" to="/anime-eras">View Timeline</Link>
                    </div>
                    <div className="timeline-links reveal reveal-up">
                        <p>1917 - 1930s - 1960s - 1980s - 2000s - 2020s</p>
                    </div>
                </aside>

                <section className="video-section reveal reveal-up" aria-labelledby="video-feature-heading">
                    <h2 id="video-feature-heading">Watch: The Evolution of Anime</h2>
                    <p className="video-description">
                        Discover how Japanese animation evolved from its earliest roots to modern masterpieces.
                    </p>
                    <div className="video-wrapper">
                        <iframe
                            src="https://www.youtube.com/embed/cqoURVPgGPo"
                            title="YouTube video: The Evolution of Anime"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </section>

                <ContactForm />

            </section>
        </main>
    );
};

export default Home;