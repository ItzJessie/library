import "../css/AboutPage.css";

const About = () => {
    return (
        <main className="about-page">
            <section className="about-hero">
                <h1>About the Project</h1>
                <p className="about-hero-subtitle">
                    Exploring the evolution and impact of Japanese animation through interactive storytelling
                </p>
            </section>

            <section className="about-layout" aria-label="Project summary">
                <div className="about-column">
                    <h2>Project Overview</h2>
                    <div className="about-stack">
                        <article className="about-card">
                            <div className="card-header">
                                <h3>Goals</h3>
                            </div>
                            <p>
                                Present a clear, era-by-era overview of Japanese animation while highlighting
                                the studios, creators, and series that influenced global media.
                            </p>
                            <p>
                                Offer an accessible entry point for newcomers and a structured reference for
                                longtime fans.
                            </p>
                        </article>
                        <article className="about-card">
                            <div className="card-header">
                                <h3>Disclaimer</h3>
                            </div>
                            <p>
                                This is a student project created for educational purposes. The information is summarized
                                from publicly available sources and may not be exhaustive.
                            </p>
                        </article>
                        <article className="about-card">
                            <div className="card-header">
                                <h3>About This Archive</h3>
                            </div>
                            <p>
                                The Japanese Animation History Archive curates timelines, studio spotlights, and influential
                                works from the 1980s through the 2020s. Each section pairs historical context with curated
                                examples so visitors can trace how styles, technology, and storytelling evolved.
                            </p>
                        </article>
                    </div>
                </div>

                <div className="about-column">
                    <h2>Technologies Used</h2>
                    <article className="about-card is-tall">
                        <div className="card-header">
                            <h3>Stack</h3>
                        </div>
                        <p>
                            Built with semantic HTML and CSS for responsive layout, typography, and cards.
                            JavaScript powers interactive elements such as filtering, navigation enhancements,
                            and dynamic data rendering.
                        </p>
                        <ul className="tech-list">
                            <li><strong>HTML5</strong> - Structure and accessibility</li>
                            <li><strong>CSS3</strong> - Custom typography and responsive layout</li>
                            <li><strong>JavaScript</strong> - Client-side interactivity</li>
                        </ul>
                    </article>
                </div>

                <div className="about-column">
                    <h2>References &amp; Sources</h2>
                    <article className="about-card is-taller">
                        <div className="card-header">
                            <h3>Data Sources</h3>
                        </div>
                        <p>
                            Historical summaries and production details were compiled from reputable animation
                            databases and studio documentation:
                        </p>
                        <ul className="reference-list">
                            <li><a href="https://www.animenewsnetwork.com/">Anime News Network</a></li>
                            <li><a href="https://myanimelist.net/">MyAnimeList</a></li>
                            <li><a href="https://www.imdb.com/">IMDb</a></li>
                            <li><a href="https://www.studio-ghibli.jp/">Studio Ghibli Official Site</a></li>
                        </ul>
                    </article>
                </div>
            </section>
        </main>
    );
};

export default About;