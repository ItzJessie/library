import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SeriesListCard from "../components/SeriesListCard";
import animeSeries from "../data/animeSeries.json";
import "../css/AllInfluentialSeriesPage.css";

const buildSeriesId = (title) =>
    `series-${title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")}`;

const AllInfluentialSeries = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [visibleCount, setVisibleCount] = useState(0);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const searchFormRef = useRef(null);
    const location = useLocation();

    const allSeries = useMemo(
        () =>
            animeSeries.map((series) => ({
                id: buildSeriesId(series.title),
                title: series.title,
                image: `${process.env.PUBLIC_URL}/${series.img_name}`,
                year: series.year,
                studio: series.studio,
                genre: series.genre,
                episodes: series.episodes,
                synopsis: series.synopsis
            })),
        []
    );

    const trimmedSearchTerm = searchTerm.toLowerCase().trim();

    const suggestions = useMemo(() => {
        if (trimmedSearchTerm.length < 1) {
            return [];
        }

        return allSeries
            .filter((anime) => anime.title.toLowerCase().includes(trimmedSearchTerm))
            .slice(0, 6)
            .map((anime) => ({ name: anime.title, id: anime.id }));
    }, [allSeries, trimmedSearchTerm]);

    const showSuggestions = isSearchFocused && suggestions.length > 0;

    useEffect(() => {
        const cards = Array.from(document.querySelectorAll(".all-series-card"));
        let localVisibleCount = 0;

        cards.forEach((card) => {
            const animeTitle = card.querySelector("h2")?.textContent?.toLowerCase() || "";
            const matches = animeTitle.includes(trimmedSearchTerm);

            if (trimmedSearchTerm.length === 0) {
                card.style.display = "";
                card.style.opacity = "1";
                card.style.pointerEvents = "auto";
                localVisibleCount += 1;
            } else if (matches) {
                card.style.display = "";
                card.style.opacity = "1";
                card.style.pointerEvents = "auto";
                localVisibleCount += 1;
            } else {
                card.style.opacity = "0.15";
                card.style.pointerEvents = "none";
            }
        });

        setVisibleCount(localVisibleCount);
    }, [trimmedSearchTerm, allSeries]);

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

    useEffect(() => {
        if (!location.hash) {
            return;
        }

        const targetId = decodeURIComponent(location.hash.slice(1));
        const targetCard = document.getElementById(targetId);

        if (!targetCard) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            targetCard.classList.add("highlight-anime");

            window.setTimeout(() => {
                targetCard.classList.remove("highlight-anime");
            }, 3000);
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [location.hash]);

    const navigateToAnime = (anime) => {
        const targetCard = document.getElementById(anime.id);
        if (!targetCard) {
            return;
        }

        setIsSearchFocused(false);
        setSelectedSuggestionIndex(-1);
        setSearchTerm("");

        targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
        targetCard.classList.add("highlight-anime");

        window.setTimeout(() => {
            targetCard.classList.remove("highlight-anime");
        }, 3000);
    };

    const handleKeyNavigation = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }

        if (!showSuggestions) {
            if (event.key === "Escape") {
                setIsSearchFocused(false);
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
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
        <main className="all-series-page">
            <Link className="close-button" to="/influential-series" aria-label="Back to Influential Series">
                X
            </Link>

            <section className="all-series-hero">
                <div className="all-series-search-wrap">
                    <form
                        className="series-search all-series-search"
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
                            autoComplete="off"
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
                                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
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
                <div className="all-series-hero-inner">
                    <h1>All Influential Series</h1>
                </div>
            </section>

            <section className="all-series-shell">
                <div className="all-series-grid" aria-live="polite">
                    {allSeries.map((series) => (
                        <SeriesListCard key={series.id} series={series} />
                    ))}

                    {trimmedSearchTerm.length > 0 && visibleCount === 0 && (
                        <div className="all-series-no-results" style={{ display: "block" }}>
                            <p>
                                No anime found matching "<strong>{trimmedSearchTerm}</strong>"
                            </p>
                            <p className="coming-soon">
                                New anime series adding soon! Check back later 🎬
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default AllInfluentialSeries;
