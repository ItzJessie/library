import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SeriesListCard from "../components/SeriesListCard";
import Slideshow from "../components/Slideshow";
import { archiveSeries, featuredSeries } from "../data/siteData";
import animeSeries from "../data/animeSeries.json";
import { useEraInteractions } from "../hooks/useEraInteractions";
import "../css/InfluentialSeriesPage.css";

const buildSeriesId = (title) =>
    `series-${title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")}`;

const InfluentialSeries = () => {
    const navigate = useNavigate();
    useEraInteractions();

    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [activeArchiveFilter, setActiveArchiveFilter] = useState("All");
    const [archiveRotationIndex, setArchiveRotationIndex] = useState(0);
    const searchFormRef = useRef(null);

    const animeDatabase = useMemo(() => {
        const uniqueTitles = Array.from(
            new Set(
                animeSeries
                    .map((entry) => String(entry.title || "").trim())
                    .filter(Boolean)
            )
        );

        return uniqueTitles.map((name) => ({
            name,
            id: buildSeriesId(name)
        }));
    }, []);

    const trimmedSearchTerm = searchTerm.toLowerCase().trim();

    const suggestions = useMemo(() => {
        if (trimmedSearchTerm.length < 1) {
            return [];
        }

        return animeDatabase
            .filter((anime) => anime.name.toLowerCase().includes(trimmedSearchTerm))
            .slice(0, 6);
    }, [animeDatabase, trimmedSearchTerm]);

    const showSuggestions = isSearchFocused && suggestions.length > 0;

    const archiveFilters = ["All", "Classics", "Modern Hits", "Underrated", "Global Impact"];

    const filteredArchiveSeries = useMemo(() => {
        if (activeArchiveFilter === "All") {
            return archiveSeries;
        }

        if (activeArchiveFilter === "Classics") {
            return archiveSeries.filter((series) => series.year <= 2009);
        }

        if (activeArchiveFilter === "Modern Hits") {
            return archiveSeries.filter((series) => series.year >= 2018);
        }

        if (activeArchiveFilter === "Underrated") {
            return archiveSeries.filter((series) => {
                const genre = series.genre.toLowerCase();
                return (
                    genre.includes("mystery") ||
                    genre.includes("crime") ||
                    genre.includes("historical") ||
                    genre.includes("thriller")
                );
            });
        }

        return archiveSeries.filter((series) => {
            const genre = series.genre.toLowerCase();
            return (
                genre.includes("action") ||
                genre.includes("adventure") ||
                series.studio.toLowerCase().includes("wit") ||
                series.studio.toLowerCase().includes("toei")
            );
        });
    }, [activeArchiveFilter]);

    const visibleArchiveTitleMatches = useMemo(
        () =>
            filteredArchiveSeries.some((series) =>
                series.title.toLowerCase().includes(trimmedSearchTerm)
            ),
        [filteredArchiveSeries, trimmedSearchTerm]
    );

    const visibleFeaturedTitleMatches = useMemo(
        () =>
            featuredSeries.some((series) =>
                series.title.toLowerCase().includes(trimmedSearchTerm)
            ),
        [trimmedSearchTerm]
    );

    const hasVisibleCards =
        trimmedSearchTerm.length === 0 ||
        visibleArchiveTitleMatches ||
        visibleFeaturedTitleMatches;

    const rotatedArchiveSeries = useMemo(() => {
        if (filteredArchiveSeries.length <= 1) {
            return filteredArchiveSeries;
        }

        const normalizedIndex = archiveRotationIndex % filteredArchiveSeries.length;
        return [
            ...filteredArchiveSeries.slice(normalizedIndex),
            ...filteredArchiveSeries.slice(0, normalizedIndex)
        ];
    }, [archiveRotationIndex, filteredArchiveSeries]);

    useEffect(() => {
        setArchiveRotationIndex(0);
    }, [activeArchiveFilter]);

    useEffect(() => {
        if (filteredArchiveSeries.length <= 1) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setArchiveRotationIndex((prev) => (prev + 1) % filteredArchiveSeries.length);
        }, 7000);

        return () => {
            window.clearInterval(timer);
        };
    }, [filteredArchiveSeries.length]);

    const featuredArchiveSeries = rotatedArchiveSeries[0] || null;
    const compactArchiveSeries = rotatedArchiveSeries.slice(1);

    useEffect(() => {
        const seriesCards = Array.from(document.querySelectorAll(".series-card"));
        const carouselCards = Array.from(document.querySelectorAll(".carousel-card"));
        const allCards = [...seriesCards, ...carouselCards];

        allCards.forEach((card) => {
            const animeTitle =
                card.querySelector("span")?.textContent?.toLowerCase() ||
                card.querySelector("h2")?.textContent?.toLowerCase() ||
                "";
            const matches = animeTitle.includes(trimmedSearchTerm);

            if (trimmedSearchTerm.length === 0 || matches) {
                card.style.display = "";
                card.style.opacity = "1";
                card.style.pointerEvents = "auto";
            } else {
                card.style.opacity = "0.2";
                card.style.pointerEvents = "none";
            }
        });
    }, [trimmedSearchTerm]);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (!searchFormRef.current?.contains(event.target)) {
                setIsSearchFocused(false);
                setSelectedSuggestionIndex(-1);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    const navigateToAnime = (anime) => {
        navigate(`/all-influential-series#${anime.id}`);
        setIsSearchFocused(false);
        setSelectedSuggestionIndex(-1);
    };

    const handleKeyNavigation = (event) => {
        if (!showSuggestions) {
            if (event.key === "Escape") {
                setIsSearchFocused(false);
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) =>
                Math.min(prev + 1, suggestions.length - 1)
            );
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) => Math.max(prev - 1, -1));
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (selectedSuggestionIndex >= 0) {
                const selectedAnime = suggestions[selectedSuggestionIndex];
                if (selectedAnime) {
                    navigateToAnime(selectedAnime);
                }
            }
        } else if (event.key === "Escape") {
            setIsSearchFocused(false);
            setSelectedSuggestionIndex(-1);
        }
    };

    return (
        <main>
            <section className="series-hero reveal">
                <div className="series-search-wrap">
                    <form
                        className="series-search"
                        aria-label="Search anime"
                        onSubmit={(event) => {
                            event.preventDefault();
                        }}
                        ref={searchFormRef}
                    >
                        <input
                            type="search"
                            name="search"
                            placeholder="search anime"
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setSelectedSuggestionIndex(-1);
                            }}
                            onFocus={() => setIsSearchFocused(true)}
                            onKeyDown={handleKeyNavigation}
                        />
                        <button type="submit" aria-label="Search">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <circle cx="11" cy="11" r="7"></circle>
                                <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
                            </svg>
                        </button>

                        {showSuggestions && (
                            <div className="search-suggestions">
                                {suggestions.map((anime, index) => (
                                    <div
                                        className={`suggestion-item ${
                                            selectedSuggestionIndex === index
                                                ? "selected"
                                                : ""
                                        }`.trim()}
                                        key={anime.id}
                                        onClick={() => navigateToAnime(anime)}
                                        onMouseEnter={() =>
                                            setSelectedSuggestionIndex(index)
                                        }
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === "Enter" ||
                                                event.key === " "
                                            ) {
                                                event.preventDefault();
                                                navigateToAnime(anime);
                                            }
                                        }}
                                    >
                                        {anime.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                </div>
                <div className="series-hero-inner">
                    <h1 className="reveal">Influential Series</h1>
                </div>
            </section>

            <section className="series-carousel">
                <Slideshow
                    slides={featuredSeries.map((series) => ({
                        ...series,
                        image: `${process.env.PUBLIC_URL}/${series.image}`
                    }))}
                />
            </section>

            <section className="series-archive">
                <div className="archive-shell reveal">
                    <div className="archive-heading">
                        <h2 className="reveal">Archive Highlights</h2>
                        <div className="archive-filters" role="tablist" aria-label="Archive category filters">
                            {archiveFilters.map((filterName) => {
                                const isActive = activeArchiveFilter === filterName;
                                return (
                                    <button
                                        key={filterName}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        className={`archive-filter-chip ${isActive ? "is-active" : ""}`.trim()}
                                        onClick={() => setActiveArchiveFilter(filterName)}
                                    >
                                        {filterName}
                                    </button>
                                );
                            })}
                        </div>
                        <Link className="archive-see-all" to="/all-influential-series">
                            See All
                        </Link>
                    </div>
                    <div className="series-grid">
                        {featuredArchiveSeries && (
                            <div className="series-grid__featured">
                                <SeriesListCard
                                    key={`${featuredArchiveSeries.id}-${archiveRotationIndex}`}
                                    series={{
                                        ...featuredArchiveSeries,
                                        image: `${process.env.PUBLIC_URL}/${featuredArchiveSeries.image}`
                                    }}
                                    variant="archive"
                                    featured
                                    animated
                                    interactive={{
                                        tabIndex: 0,
                                        role: "link",
                                        ariaLabel: `Open ${featuredArchiveSeries.title || "series"} in archive`,
                                        onClick: () => navigate(`/all-influential-series#${featuredArchiveSeries.id}`),
                                        onKeyDown: (event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                navigate(`/all-influential-series#${featuredArchiveSeries.id}`);
                                            }
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="series-grid__compact">
                            {compactArchiveSeries.map((series) => (
                                <SeriesListCard
                                    key={series.id}
                                    series={{
                                        ...series,
                                        image: `${process.env.PUBLIC_URL}/${series.image}`
                                    }}
                                    variant="archive"
                                    interactive={{
                                        tabIndex: 0,
                                        role: "link",
                                        ariaLabel: `Open ${series.title || "series"} in archive`,
                                        onClick: () => navigate(`/all-influential-series#${series.id}`),
                                        onKeyDown: (event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                navigate(`/all-influential-series#${series.id}`);
                                            }
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {trimmedSearchTerm.length > 0 && !hasVisibleCards && (
                        <div className="series-no-results" style={{ display: "block" }}>
                            <p>
                                No anime found matching "<strong>{trimmedSearchTerm}</strong>"
                            </p>
                            <p className="coming-soon">
                                New anime series coming soon! Stay tuned 🎬
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default InfluentialSeries;
