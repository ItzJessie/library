import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SeriesListCard from "../components/SeriesListCard";
import { archiveSeries, featuredSeries } from "../data/siteData";
import "../css/AllInfluentialSeriesPage.css";

const buildSeriesId = (title) =>
    `series-${title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")}`;

const seededSeries = [
    ...featuredSeries,
    ...archiveSeries,
    {
        id: "series-neon-genesis-evangelion",
        title: "Neon Genesis Evangelion",
        image: "images/neon-genesis-evangelion.svg",
        year: 1995,
        studio: "Gainax",
        genre: "Psychological, mecha",
        episodes: 26,
        synopsis: "A defining 90s series that blended mecha action with deeply introspective storytelling."
    },
    {
        id: "series-spirited-away",
        title: "Spirited Away",
        image: "images/astro-boy.svg",
        year: 2001,
        studio: "Studio Ghibli",
        genre: "Fantasy, adventure",
        synopsis: "A globally celebrated feature film that introduced many audiences to modern anime cinema."
    }
];

const AllInfluentialSeries = () => {
    const [query, setQuery] = useState("");

    const allSeries = useMemo(
        () =>
            seededSeries.map((series) => ({
                id: series.id || buildSeriesId(series.title),
                title: series.title,
                image: `${process.env.PUBLIC_URL}/${series.image}`,
                year: series.year,
                studio: series.studio,
                genre: series.genre,
                episodes: series.episodes,
                synopsis: series.synopsis
            })),
        []
    );

    const filteredSeries = useMemo(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) {
            return allSeries;
        }

        return allSeries.filter(
            (series) =>
                series.title.toLowerCase().includes(trimmed) ||
                series.studio.toLowerCase().includes(trimmed) ||
                series.genre.toLowerCase().includes(trimmed)
        );
    }, [allSeries, query]);

    return (
        <main className="all-series-page">
            <Link className="close-button" to="/influential-series" aria-label="Back to Influential Series">
                X
            </Link>

            <section className="all-series-hero">
                <div className="all-series-search-wrap">
                    <div className="series-search all-series-search" aria-label="Search anime">
                        <input
                            type="search"
                            name="search"
                            placeholder="search anime"
                            autoComplete="off"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <button type="button" aria-label="Search">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <circle cx="11" cy="11" r="7"></circle>
                                <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="all-series-hero-inner">
                    <h1>All Influential Series</h1>
                </div>
            </section>

            <section className="all-series-shell">
                <div className="all-series-grid" aria-live="polite">
                    {filteredSeries.map((series) => (
                        <SeriesListCard key={series.id} series={series} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default AllInfluentialSeries;
