import "../css/Home.css";
import { Link } from "react-router-dom";
import HomeFeatureCard from "../components/HomeFeatureCard";
import HomeArchiveCard from "../components/HomeArchiveCard";

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

            </section>
        </main>
    );
};

export default Home;