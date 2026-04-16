import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import animeSeries from "../data/animeSeries.json";
import studiosCreators from "../data/studiosCreators.json";
import { eraPanels } from "../data/siteData";
import { buildSearchDataset, runUniversalSearch } from "../utils/universalSearch";
import "../css/UniversalSearchOverlay.css";

const defaultFilters = {
    era: "All",
    genre: "All",
    mood: "All",
    influentialOnly: false,
    beginnerFriendly: false
};

const resultTypeLabel = {
    series: "Series",
    studio: "Studio",
    creator: "Creator",
    era: "Era"
};

const getResultTypeLabel = (type) => resultTypeLabel[type] || "Result";

const UniversalSearchOverlay = ({ isOpen, onClose, onPreviewUpdate }) => {
    const [query, setQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState(defaultFilters);
    const [highlightedSuggestion, setHighlightedSuggestion] = useState(-1);
    const [activeResultId, setActiveResultId] = useState("");
    const inputRef = useRef(null);

    const dataset = useMemo(
        () => buildSearchDataset({ animeSeries, studiosCreators, eraPanels }),
        []
    );

    const searchState = useMemo(
        () => runUniversalSearch({ query, filters: activeFilters, dataset }),
        [query, activeFilters, dataset]
    );

    const activeResult = useMemo(
        () => searchState.results.find((entry) => entry.id === activeResultId) || searchState.results[0] || null,
        [searchState.results, activeResultId]
    );

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        setHighlightedSuggestion(-1);
        window.requestAnimationFrame(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                // Scroll input into view for mobile keyboards
                inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        });
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            onPreviewUpdate?.({ isOpen: false, query: "", results: [] });
            return;
        }

        onPreviewUpdate?.({
            isOpen: true,
            query,
            results: searchState.results.slice(0, 6)
        });
    }, [isOpen, onPreviewUpdate, query, searchState.results]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", onEscape);
        return () => document.removeEventListener("keydown", onEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        if (searchState.results.length === 0) {
            if (activeResultId) {
                setActiveResultId("");
            }
            return;
        }

        const activeResultStillExists = searchState.results.some(
            (entry) => entry.id === activeResultId
        );

        if (!activeResultStillExists) {
            setActiveResultId(searchState.results[0].id);
        }
    }, [activeResultId, isOpen, searchState.results]);

    if (!isOpen) {
        return null;
    }

    const showSuggestions = query.trim().length > 0 && searchState.suggestions.length > 0;
    const hasResults = searchState.results.length > 0;

    const applySuggestion = (entry) => {
        setQuery(entry.title);
        setHighlightedSuggestion(-1);
    };

    const handleInputKeyDown = (event) => {
        if (!showSuggestions) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setHighlightedSuggestion((prev) =>
                Math.min(prev + 1, searchState.suggestions.length - 1)
            );
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            setHighlightedSuggestion((prev) => Math.max(prev - 1, -1));
            return;
        }

        if (event.key === "Enter" && highlightedSuggestion >= 0) {
            event.preventDefault();
            const suggestion = searchState.suggestions[highlightedSuggestion];
            if (suggestion) {
                applySuggestion(suggestion);
            }
        }
    };

    return (
        <div className="universal-search-shell" role="dialog" aria-modal="true" aria-label="Universal anime search">
            <button
                type="button"
                className="universal-search-backdrop"
                onClick={onClose}
                aria-label="Close search"
            ></button>

            <section className="universal-search-panel">
                <header className="universal-search-header">
                    <h2>Discover Anime Instantly</h2>
                    <button type="button" className="universal-search-close" onClick={onClose}>
                        Close
                    </button>
                </header>

                <div className="universal-search-input-wrap">
                    <input
                        ref={inputRef}
                        type="search"
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setHighlightedSuggestion(-1);
                        }}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Try: show me 90s psychological anime"
                        aria-label="Universal search"
                    />
                    <span className="universal-search-shortcut">Press / to open</span>
                </div>

                {showSuggestions && (
                    <div
                        className="universal-search-suggestions"
                        aria-label="Predictive suggestions"
                        role="listbox"
                    >
                        {searchState.suggestions.map((entry, index) => (
                            <button
                                key={entry.id}
                                type="button"
                                className={`suggestion-pill ${highlightedSuggestion === index ? "is-active" : ""}`.trim()}
                                onMouseEnter={() => setHighlightedSuggestion(index)}
                                onClick={() => applySuggestion(entry)}
                                role="option"
                                aria-selected={highlightedSuggestion === index}
                            >
                                <span>{entry.title}</span>
                                <small>{getResultTypeLabel(entry.type)}</small>
                            </button>
                        ))}
                    </div>
                )}

                <div className="universal-search-chips" aria-label="Quick filters">
                    <label className="chip-select">
                        Era
                        <select
                            value={activeFilters.era}
                            onChange={(event) =>
                                setActiveFilters((prev) => ({ ...prev, era: event.target.value }))
                            }
                        >
                            {dataset.filters.eras.map((entry) => (
                                <option key={entry} value={entry}>
                                    {entry}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="chip-select">
                        Genre
                        <select
                            value={activeFilters.genre}
                            onChange={(event) =>
                                setActiveFilters((prev) => ({ ...prev, genre: event.target.value }))
                            }
                        >
                            {dataset.filters.genres.map((entry) => (
                                <option key={entry} value={entry}>
                                    {entry}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="chip-select">
                        Mood
                        <select
                            value={activeFilters.mood}
                            onChange={(event) =>
                                setActiveFilters((prev) => ({ ...prev, mood: event.target.value }))
                            }
                        >
                            {dataset.filters.moods.map((entry) => (
                                <option key={entry} value={entry}>
                                    {entry}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="button"
                        className={`toggle-chip ${activeFilters.influentialOnly ? "is-active" : ""}`.trim()}
                        onClick={() =>
                            setActiveFilters((prev) => ({
                                ...prev,
                                influentialOnly: !prev.influentialOnly
                            }))
                        }
                    >
                        Influential only
                    </button>
                    <button
                        type="button"
                        className={`toggle-chip ${activeFilters.beginnerFriendly ? "is-active" : ""}`.trim()}
                        onClick={() =>
                            setActiveFilters((prev) => ({
                                ...prev,
                                beginnerFriendly: !prev.beginnerFriendly
                            }))
                        }
                    >
                        Beginner friendly
                    </button>
                    <button
                        type="button"
                        className="toggle-chip reset-chip"
                        onClick={() => setActiveFilters(defaultFilters)}
                    >
                        Reset
                    </button>
                </div>

                <div className="universal-search-results-layout">
                    <div className="results-column">
                        <h3>Quick Results</h3>
                        {hasResults && (
                            <div className="result-grid" aria-live="polite">
                                {searchState.results.slice(0, 8).map((entry) => (
                                    <button
                                        key={entry.id}
                                        type="button"
                                        className={`result-card ${activeResult?.id === entry.id ? "is-active" : ""}`.trim()}
                                        onClick={() => setActiveResultId(entry.id)}
                                        aria-pressed={activeResult?.id === entry.id}
                                        aria-label={`Preview ${entry.title}`}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                setActiveResultId(entry.id);
                                            }
                                        }}
                                    >
                                        <p className="result-type">{getResultTypeLabel(entry.type)}</p>
                                        <h4>{entry.title}</h4>
                                        <p>{entry.subtitle}</p>
                                        <div className="result-meta-row">
                                            {entry.era && <span>{entry.era}</span>}
                                            {entry.mood && <span>{entry.mood}</span>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {!hasResults && (
                            <section className="empty-state" aria-live="polite">
                                <h4>No direct matches yet</h4>
                                {searchState.correction && (
                                    <p>
                                        Did you mean <button type="button" onClick={() => setQuery(searchState.correction)}>{searchState.correction}</button>?
                                    </p>
                                )}
                                {searchState.closestMatches.length > 0 && (
                                    <div>
                                        <p>Closest matches</p>
                                        <div className="empty-links">
                                            {searchState.closestMatches.map((entry) => (
                                                <button key={entry.id} type="button" onClick={() => setQuery(entry.title)}>
                                                    {entry.title}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <p>Popular alternatives</p>
                                    <div className="empty-links">
                                        {searchState.popularAlternatives.map((entry) => (
                                            <button key={entry.id} type="button" onClick={() => setQuery(entry.title)}>
                                                {entry.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="insight-column">
                        <h3>Preview</h3>
                        {activeResult ? (
                            <article className="preview-card">
                                <p className="result-type">{getResultTypeLabel(activeResult.type)}</p>
                                <h4>{activeResult.title}</h4>
                                <p>{activeResult.description}</p>
                                <div className="preview-tags">
                                    {activeResult.era && <span>{activeResult.era}</span>}
                                    {activeResult.mood && <span>{activeResult.mood}</span>}
                                    {activeResult.influential && <span>Influential</span>}
                                </div>
                                <Link className="preview-link" to={activeResult.route} onClick={onClose}>
                                    Open destination
                                </Link>
                            </article>
                        ) : (
                            <p className="preview-empty">Start typing to explore series, studios, creators, and eras.</p>
                        )}

                        {searchState.peopleAlsoExplore.length > 0 && (
                            <section className="people-explore">
                                <h4>People also explore</h4>
                                <div className="people-links">
                                    {searchState.peopleAlsoExplore.map((entry) => (
                                        <button key={`people-${entry.id}`} type="button" onClick={() => setQuery(entry.title)}>
                                            {entry.title}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>
                </div>
            </section>
        </div>
    );
};

export default UniversalSearchOverlay;
