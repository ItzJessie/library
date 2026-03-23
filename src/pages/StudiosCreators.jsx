import { creators, studios } from "../data/siteData";
import "../css/StudiosCreatorsPage.css";
import ProfileCard from "../components/ProfileCard";

const StudiosCreators = () => {
    return (
        <main className="page-studios">
            <section className="studios-hero">
                <div className="studios-hero-inner">
                    <h1>Studios &amp; Creators</h1>
                    <p className="filter-title">Featured Profiles</p>
                    <div className="filter-bar" role="group" aria-label="Static filters">
                        <button type="button">1980s</button>
                        <button type="button">1990s</button>
                        <button type="button">2000s</button>
                        <button type="button">2010s</button>
                        <button type="button">2020s</button>
                    </div>
                </div>
            </section>

            <section className="studios-layout">
                <div className="studios-columns">
                    <div className="studios-column">
                        <h2>Studios Section</h2>
                        {studios.map((studio) => (
                            <ProfileCard key={studio.name} profile={studio} type="studio" />
                        ))}
                    </div>

                    <div className="studios-column">
                        <h2>Creators Section</h2>
                        {creators.map((creator) => (
                            <ProfileCard key={creator.name} profile={creator} type="creator" />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default StudiosCreators;
