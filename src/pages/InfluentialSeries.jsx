import { Link } from "react-router-dom";
import SeriesListCard from "../components/SeriesListCard";
import { archiveSeries, featuredSeries } from "../data/siteData";
import "../css/InfluentialSeriesPage.css";

const InfluentialSeries = () => {
    return (
        <main>
            <section className="series-hero reveal">
                <div className="series-search-wrap">
                    <form className="series-search" aria-label="Search anime" onSubmit={(event) => event.preventDefault()}>
                        <input type="search" name="search" placeholder="search anime" />
                        <button type="submit" aria-label="Search">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <circle cx="11" cy="11" r="7"></circle>
                                <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
                            </svg>
                        </button>
                    </form>
                </div>
                <div className="series-hero-inner">
                    <h1 className="reveal">Influential Series</h1>
                </div>
            </section>

            <section className="series-carousel">
                <div className="carousel-shell reveal">
                    <div className="carousel-progress" aria-hidden="true">
                        <span className="carousel-progress__bar"></span>
                    </div>
                    <button className="carousel-arrow" aria-label="Previous" type="button">
                        <span aria-hidden="true">&#8249;</span>
                    </button>
                    <div className="carousel-track">
                        {featuredSeries.map((series) => (
                            <SeriesListCard key={series.id} series={{
                                ...series,
                                image: `${process.env.PUBLIC_URL}/${series.image}`
                            }} compact />
                        ))}
                    </div>
                    <button className="carousel-arrow" aria-label="Next" type="button">
                        <span aria-hidden="true">&#8250;</span>
                    </button>
                </div>
            </section>

            <section className="series-archive">
                <div className="archive-shell reveal">
                    <div className="archive-heading">
                        <h2 className="reveal">Archive Highlights</h2>
                        <Link to="/all-influential-series">See All</Link>
                    </div>
                    <div className="series-grid">
                        {archiveSeries.map((series) => (
                            <SeriesListCard
                                key={series.id}
                                series={{
                                    ...series,
                                    image: `${process.env.PUBLIC_URL}/${series.image}`
                                }}
                                variant="archive"
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default InfluentialSeries;
