import { useEffect, useMemo, useState } from "react";
import fallbackStudiosCreatorsData from "../data/studiosCreators.json";
import "../css/StudiosCreatorsPage.css";
import ProfileCard from "../components/ProfileCard";
import { useEraInteractions } from "../hooks/useEraInteractions";

const getDefaultApiBaseUrl = () =>
    process.env.NODE_ENV === "production"
        ? "https://demo-backend.onrender.com"
        : "http://localhost:3001";

const isLocalhostUrl = (value) =>
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(String(value || "").trim());

const isLocalhostRuntime = () => {
    if (typeof window === "undefined") {
        return false;
    }

    return /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
};

const resolveStudiosCreatorsApiBaseUrl = () => {
    const explicitBaseUrl =
        process.env.REACT_APP_STUDIOS_CREATORS_API_URL ||
        process.env.REACT_APP_API_URL ||
        "";

    if (
        process.env.NODE_ENV === "production" &&
        isLocalhostUrl(explicitBaseUrl) &&
        !isLocalhostRuntime()
    ) {
        return getDefaultApiBaseUrl();
    }

    return (explicitBaseUrl || getDefaultApiBaseUrl()).replace(/\/+$/, "");
};

const API_BASE_URL = resolveStudiosCreatorsApiBaseUrl();
const MOBILE_BREAKPOINT = 860;
const MOBILE_BATCH_SIZE = 6;
const DESKTOP_COLLAPSE_COUNT = 10;

const ERA_OPTIONS = ["1980s", "1990s", "2000s", "2010s", "2020s"];
const CURRENT_YEAR = new Date().getFullYear();

const CREATOR_ERA_BY_NAME = {
    "Eiichiro Oda": "1990s",
    "Hideaki Anno": "1990s",
    "Yoshihiro Togashi": "1990s",
    "Hayao Miyazaki": "1980s",
    "Kohei Horikoshi": "2010s",
    "Kunihiko Ikuhara": "1990s",
    "Haruo Sotozaki": "2010s"
};

const TITLE_GENRE_MAP = {
    "Attack on Titan": "Action, Dark Fantasy",
    "Vinland Saga": "Historical, Action",
    "Chainsaw Man": "Dark Fantasy, Horror",
    "Violet Evergarden": "Drama, Slice of Life",
    "Dragon Ball": "Shonen, Adventure",
    "Dragon Ball Z": "Shonen, Action",
    "Sailor Moon": "Magical Girl, Shoujo",
    "Spirited Away": "Fantasy, Adventure",
    "Princess Mononoke": "Fantasy, Epic",
    "Fullmetal Alchemist": "Shonen, Adventure",
    "My Hero Academia": "Shonen, Superhero",
    "Demon Slayer": "Shonen, Dark Fantasy",
    "One Piece": "Shonen, Adventure",
    "Neon Genesis Evangelion": "Mecha, Psychological",
    "Yu Yu Hakusho": "Shonen, Supernatural",
    "Hunter x Hunter": "Shonen, Adventure",
    "Mob Psycho 100": "Psychological, Supernatural",
    "Soul Eater": "Action, Supernatural",
    Dororo: "Historical, Dark Fantasy",
    "Saint Seiya": "Action, Mythological",
    "Psycho-Pass": "Sci-Fi, Crime",
    "Re:Zero - Starting Life in Another World": "Fantasy, Psychological",
    Jormungand: "Action, Thriller",
    "The Promised Neverland": "Thriller, Mystery",
    Horimiya: "Romance, Slice of Life",
    "Blue Exorcist": "Action, Supernatural",
    Erased: "Mystery, Thriller",
    "Gurren Lagann": "Mecha, Adventure",
    FLCL: "Experimental, Comedy",
    "D.Gray-man": "Action, Supernatural",
    "Dr. Stone": "Sci-Fi, Adventure",
    "Natsume's Book of Friends": "Slice of Life, Supernatural",
    "Ergo Proxy": "Sci-Fi, Psychological",
    "Welcome to the NHK": "Psychological, Comedy",
    "Fire Force": "Action, Supernatural",
    "Black Clover": "Shonen, Fantasy",
    "Revolutionary Girl Utena": "Fantasy, Psychological",
    "The Apothecary Diaries": "Mystery, Historical",
    "Spy x Family": "Action, Comedy",
    "Kaguya-sama: Love Is War": "Romance, Comedy",
    "Cyberpunk: Edgerunners": "Sci-Fi, Action"
};

const normalizeStudiosCreatorsData = (payload) => {
    if (!payload || typeof payload !== "object") {
        return fallbackStudiosCreatorsData;
    }

    const studios = Array.isArray(payload.studios) ? payload.studios : fallbackStudiosCreatorsData.studios;
    const creators = Array.isArray(payload.creators) ? payload.creators : fallbackStudiosCreatorsData.creators;

    return { studios, creators };
};

const resolveBackendImageUrl = (imagePath, baseUrl) => {
    if (!imagePath) {
        return "";
    }

    const normalizedImagePath = String(imagePath).trim();
    if (!normalizedImagePath) {
        return "";
    }

    if (/^https?:\/\//i.test(normalizedImagePath)) {
        return normalizedImagePath;
    }

    const normalizedBaseUrl = String(baseUrl || "").replace(/\/$/, "");
    const normalizedRelativePath = normalizedImagePath.replace(/^\/+/, "");
    return `${normalizedBaseUrl}/${normalizedRelativePath}`;
};

const withResolvedImages = (data, baseUrl) => ({
    studios: (data.studios || []).map((studio) => ({
        ...studio,
        image: resolveBackendImageUrl(studio.image, baseUrl)
    })),
    creators: (data.creators || []).map((creator) => ({
        ...creator,
        image: resolveBackendImageUrl(creator.image, baseUrl)
    }))
});

const extractEra = (meta = "") => {
    const match = meta.match(/Era:\s*([^;]+)/i);
    return match ? match[1].trim() : null;
};

const getRoles = (roleValue = "") =>
    roleValue
        .replace(/^Role:\s*/i, "")
        .split(",")
        .map((role) => role.trim())
        .filter(Boolean);

const normalizeStudioName = (studioName = "") =>
    studioName.replace(/,\s*Inc\.?$/i, "").trim();

const extractStartYear = (profile, type) => {
    if (type === "studio") {
        const foundYear = profile.meta?.match(/(19|20)\d{2}/)?.[0];
        return foundYear ? Number(foundYear) : null;
    }

    const creatorEra = CREATOR_ERA_BY_NAME[profile.name];
    if (!creatorEra) {
        return null;
    }

    return Number.parseInt(creatorEra, 10);
};

const getYearsActiveLabel = (startYear) => {
    if (!startYear || Number.isNaN(startYear)) {
        return "N/A";
    }

    const yearsActive = Math.max(CURRENT_YEAR - startYear + 1, 1);
    return `${yearsActive} yrs active`;
};

const getProfileGenres = (profile) => {
    const genres = profile.related
        .map((title) => TITLE_GENRE_MAP[title])
        .filter(Boolean)
        .flatMap((genreEntry) => genreEntry.split(","))
        .map((genre) => genre.trim());

    return [...new Set(genres)].slice(0, 4);
};

const getProfileBadges = (profile, type) => {
    const badgeList = [];
    const worksCount = profile.related.length;
    const primaryGenres = getProfileGenres(profile).map((genre) => genre.toLowerCase());
    const startYear = extractStartYear(profile, type);

    if (type === "studio" && worksCount >= 2) {
        badgeList.push("Top 10 Influential Studio");
    }

    if (primaryGenres.some((genre) => genre.includes("shonen"))) {
        badgeList.push("Shonen Legend");
    }

    if (startYear && startYear >= 2010) {
        badgeList.push("Modern Era Pioneer");
    }

    if (type === "creator" && worksCount >= 2) {
        badgeList.push("Visionary Storyteller");
    }

    return badgeList.slice(0, 3);
};

const getTimelineOfWorks = (profile, type) => {
    const startYear = extractStartYear(profile, type) || CURRENT_YEAR - 8;
    return profile.related.map((title, index) => ({
        year: startYear + index * 2,
        title,
        note: `Impact highlight: ${title}`
    }));
};

const normalizeConnectedAnime = (payload, fallbackList) => {
    if (!payload) {
        return fallbackList;
    }

    if (Array.isArray(payload)) {
        return payload.map((entry) => (typeof entry === "string" ? entry : entry.title || entry.name)).filter(Boolean);
    }

    if (Array.isArray(payload.results)) {
        return payload.results
            .map((entry) => (typeof entry === "string" ? entry : entry.title || entry.name))
            .filter(Boolean);
    }

    return fallbackList;
};

const StudiosCreators = () => {
    useEraInteractions();

    const [studiosCreators, setStudiosCreators] = useState(fallbackStudiosCreatorsData);
    const [openMenu, setOpenMenu] = useState(null);
    const [activeTab, setActiveTab] = useState("studios");
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
    const [showJumpTop, setShowJumpTop] = useState(false);
    const [visibleCount, setVisibleCount] = useState({
        studio: MOBILE_BATCH_SIZE,
        creator: MOBILE_BATCH_SIZE
    });
    const [desktopCollapsed, setDesktopCollapsed] = useState({
        studio: true,
        creator: true
    });
    const [expandedCards, setExpandedCards] = useState({
        studio: {},
        creator: {}
    });
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [connectedAnime, setConnectedAnime] = useState([]);
    const [isLoadingConnectedAnime, setIsLoadingConnectedAnime] = useState(false);
    const [compareSelection, setCompareSelection] = useState({
        studio: [],
        creator: []
    });
    const [activeFilters, setActiveFilters] = useState({
        era: null,
        role: null,
        studio: null
    });

    useEffect(() => {
        const controller = new AbortController();

        const loadStudiosCreators = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/studios-creators`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error("Studios/creators API unavailable");
                }

                const payload = await response.json();
                const normalizedData = normalizeStudiosCreatorsData(payload);
                setStudiosCreators(withResolvedImages(normalizedData, API_BASE_URL));
            } catch (error) {
                if (error.name !== "AbortError") {
                    setStudiosCreators(withResolvedImages(fallbackStudiosCreatorsData, API_BASE_URL));
                }
            }
        };

        loadStudiosCreators();

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const onResize = () => {
            setIsMobileView(window.innerWidth <= MOBILE_BREAKPOINT);
        };

        const onScroll = () => {
            setShowJumpTop(window.scrollY > 400);
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("scroll", onScroll, { passive: true });
        onResize();
        onScroll();

        return () => {
            window.removeEventListener("resize", onResize);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    useEffect(() => {
        setVisibleCount({
            studio: MOBILE_BATCH_SIZE,
            creator: MOBILE_BATCH_SIZE
        });
    }, [activeFilters, searchTerm, activeTab]);

    const { creators, studios } = studiosCreators;

    const roleOptions = useMemo(() => {
        const allRoles = creators.flatMap((creator) => getRoles(creator.role));
        return [...new Set(allRoles)].sort((a, b) => a.localeCompare(b));
    }, [creators]);

    const studioOptions = useMemo(() => {
        const allStudios = studios.map((studio) => normalizeStudioName(studio.name));
        return [...new Set(allStudios)].sort((a, b) => a.localeCompare(b));
    }, [studios]);

    const filteredStudios = useMemo(() => {
        return studios.filter((studio) => {
            const studioEra = extractEra(studio.meta);
            const studioName = normalizeStudioName(studio.name);
            const query = searchTerm.trim().toLowerCase();

            if (activeFilters.era && studioEra !== activeFilters.era) {
                return false;
            }

            if (
                activeFilters.studio &&
                studioName.toLowerCase() !== activeFilters.studio.toLowerCase()
            ) {
                return false;
            }

            if (query) {
                const searchable = [studio.name, studio.detail, studio.meta, ...(studio.related || [])]
                    .join(" ")
                    .toLowerCase();

                if (!searchable.includes(query)) {
                    return false;
                }
            }

            return true;
        });
    }, [activeFilters, studios, searchTerm]);

    const filteredCreators = useMemo(() => {
        return creators.filter((creator) => {
            const creatorEra = CREATOR_ERA_BY_NAME[creator.name] || null;
            const creatorRoles = getRoles(creator.role).map((role) => role.toLowerCase());
            const creatorAffiliations = (creator.affiliation || "").toLowerCase();
            const query = searchTerm.trim().toLowerCase();

            if (activeFilters.era && creatorEra !== activeFilters.era) {
                return false;
            }

            if (
                activeFilters.role &&
                !creatorRoles.includes(activeFilters.role.toLowerCase())
            ) {
                return false;
            }

            if (
                activeFilters.studio &&
                !creatorAffiliations.includes(activeFilters.studio.toLowerCase())
            ) {
                return false;
            }

            if (query) {
                const searchable = [creator.name, creator.detail, creator.role, creator.affiliation, ...(creator.related || [])]
                    .join(" ")
                    .toLowerCase();

                if (!searchable.includes(query)) {
                    return false;
                }
            }

            return true;
        });
    }, [activeFilters, creators, searchTerm]);

    useEffect(() => {
        if (!selectedProfile) {
            return;
        }

        const controller = new AbortController();
        const { profile, type } = selectedProfile;

        const fetchConnectedAnime = async () => {
            setIsLoadingConnectedAnime(true);
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/connected-anime?name=${encodeURIComponent(profile.name)}&type=${type}`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Connected anime API unavailable");
                }

                const payload = await response.json();
                const normalizedTitles = normalizeConnectedAnime(payload, profile.related);
                setConnectedAnime(normalizedTitles.length > 0 ? normalizedTitles : profile.related);
            } catch (error) {
                if (error.name !== "AbortError") {
                    setConnectedAnime(profile.related);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoadingConnectedAnime(false);
                }
            }
        };

        fetchConnectedAnime();

        return () => {
            controller.abort();
        };
    }, [selectedProfile]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest(".filter-bar")) {
                setOpenMenu(null);
            }
        };

        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedProfile(null);
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        const frameId = window.requestAnimationFrame(() => {
            document
                .querySelectorAll(".page-studios .reveal")
                .forEach((element) => element.classList.add("is-visible"));
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [studiosCreators, activeTab, activeFilters]);

    const toggleMenu = (menuName) => {
        setOpenMenu((currentMenu) => (currentMenu === menuName ? null : menuName));
    };

    const applyFilter = (filterType, value) => {
        setActiveFilters((currentFilters) => ({
            ...currentFilters,
            [filterType]: value
        }));
        setOpenMenu(null);
    };

    const clearFilters = () => {
        setActiveFilters({
            era: null,
            role: null,
            studio: null
        });
        setSearchTerm("");
        setOpenMenu(null);
        setIsMobileFiltersOpen(false);
    };

    const toggleExpandCard = (profile, type) => {
        setExpandedCards((current) => {
            const currentMap = current[type];
            const currentlyExpanded = Boolean(currentMap[profile.name]);

            return {
                ...current,
                [type]: {
                    ...currentMap,
                    [profile.name]: !currentlyExpanded
                }
            };
        });
    };

    const handleMobileCardTap = (profile, type) => {
        if (isMobileView) {
            toggleExpandCard(profile, type);
            return;
        }

        openDeepDive(profile, type);
    };

    const loadMoreCards = (type) => {
        setVisibleCount((current) => ({
            ...current,
            [type]: current[type] + MOBILE_BATCH_SIZE
        }));
    };

    const toggleDesktopCollapsed = (type) => {
        setDesktopCollapsed((current) => ({
            ...current,
            [type]: !current[type]
        }));
    };

    const openDeepDive = (profile, type) => {
        setSelectedProfile({ profile, type });
        setConnectedAnime(profile.related);
    };

    const closeDeepDive = () => {
        setSelectedProfile(null);
    };

    const handleToggleCompare = (profile, type) => {
        setCompareSelection((current) => {
            const currentSelection = current[type];
            const alreadySelected = currentSelection.some((entry) => entry.name === profile.name);

            if (alreadySelected) {
                return {
                    ...current,
                    [type]: currentSelection.filter((entry) => entry.name !== profile.name)
                };
            }

            if (currentSelection.length >= 2) {
                return {
                    ...current,
                    [type]: [...currentSelection.slice(1), profile]
                };
            }

            return {
                ...current,
                [type]: [...currentSelection, profile]
            };
        });
    };

    const activeCompareType = activeTab === "studios" ? "studio" : "creator";
    const activeCompareSelection = compareSelection[activeCompareType];

    const renderCard = (profile, type, index, delayStart) => {
        const profileStartYear = extractStartYear(profile, type);
        const quickStats = {
            worksCount: profile.related.length,
            yearsActive: getYearsActiveLabel(profileStartYear)
        };
        const isCompared = compareSelection[type].some((entry) => entry.name === profile.name);
        const isExpanded = Boolean(expandedCards[type][profile.name]);
        const cardDelay = `${Math.min(index * 0.07 + delayStart, 0.72)}s`;

        return (
            <div key={profile.name} className="reveal studios-reveal" style={{ "--reveal-delay": cardDelay }}>
                <ProfileCard
                    profile={profile}
                    type={type}
                    quickStats={quickStats}
                    badges={getProfileBadges(profile, type)}
                    onClick={handleMobileCardTap}
                    onDeepDive={openDeepDive}
                    onToggleCompare={handleToggleCompare}
                    onToggleExpand={toggleExpandCard}
                    isMobile={isMobileView}
                    isExpanded={isExpanded}
                    isCompared={isCompared}
                />
            </div>
        );
    };

    const visibleStudios = isMobileView
        ? filteredStudios.slice(0, visibleCount.studio)
        : desktopCollapsed.studio
            ? filteredStudios.slice(0, DESKTOP_COLLAPSE_COUNT)
            : filteredStudios;
    const visibleCreators = isMobileView
        ? filteredCreators.slice(0, visibleCount.creator)
        : desktopCollapsed.creator
            ? filteredCreators.slice(0, DESKTOP_COLLAPSE_COUNT)
            : filteredCreators;
    const hasMoreStudios = isMobileView && filteredStudios.length > visibleStudios.length;
    const hasMoreCreators = isMobileView && filteredCreators.length > visibleCreators.length;
    const hasDesktopOverflowStudios = !isMobileView && filteredStudios.length > DESKTOP_COLLAPSE_COUNT;
    const hasDesktopOverflowCreators = !isMobileView && filteredCreators.length > DESKTOP_COLLAPSE_COUNT;

    return (
        <main className="page-studios">
            <section className="studios-hero">
                <div className="studios-hero-inner reveal studios-reveal" style={{ "--reveal-delay": "0.04s" }}>
                    <h1 className="reveal studios-reveal" style={{ "--reveal-delay": "0.1s" }}>Studios &amp; Creators</h1>
                    <p className="filter-title reveal studios-reveal" style={{ "--reveal-delay": "0.16s" }}>Filter Bar</p>

                    <div className="mobile-sticky-tools" aria-label="Quick mobile tools">
                        <input
                            type="search"
                            value={searchTerm}
                            placeholder="Search studios or creators"
                            onChange={(event) => setSearchTerm(event.target.value)}
                            aria-label="Search studios or creators"
                        />
                        <button
                            type="button"
                            className="mobile-filter-toggle"
                            onClick={() => setIsMobileFiltersOpen(true)}
                            aria-label="Open mobile filters"
                        >
                            Filter
                        </button>
                    </div>

                    <div className="studios-tabs reveal studios-reveal" role="tablist" aria-label="Studios and creators tabs" style={{ "--reveal-delay": "0.18s" }}>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "studios"}
                            className={`studios-tab-btn ${activeTab === "studios" ? "is-active" : ""}`}
                            onClick={() => setActiveTab("studios")}
                        >
                            Studios
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={activeTab === "creators"}
                            className={`studios-tab-btn ${activeTab === "creators" ? "is-active" : ""}`}
                            onClick={() => setActiveTab("creators")}
                        >
                            Creators
                        </button>
                    </div>

                    <div
                        className="filter-bar reveal studios-reveal"
                        role="group"
                        aria-label="Filters"
                        style={{ "--reveal-delay": "0.22s" }}
                    >
                        <div className={`filter-dropdown ${openMenu === "era" ? "is-open" : ""}`}>
                            <button
                                type="button"
                                className="filter-toggle"
                                id="era-toggle"
                                aria-haspopup="true"
                                aria-expanded={openMenu === "era"}
                                onClick={() => toggleMenu("era")}
                            >
                                {activeFilters.era || "Filter by Era"}
                            </button>
                            <div className="filter-menu" role="menu" aria-label="Era options">
                                {ERA_OPTIONS.map((era) => (
                                    <button
                                        key={era}
                                        type="button"
                                        role="menuitem"
                                        className={activeFilters.era === era ? "is-selected" : ""}
                                        onClick={() => applyFilter("era", era)}
                                    >
                                        {era}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={`filter-dropdown ${openMenu === "role" ? "is-open" : ""}`}>
                            <button
                                type="button"
                                className="filter-toggle"
                                id="creator-role-toggle"
                                aria-haspopup="true"
                                aria-expanded={openMenu === "role"}
                                onClick={() => toggleMenu("role")}
                            >
                                {activeFilters.role || "Filter by Role"}
                            </button>
                            <div className="filter-menu" role="menu" aria-label="Creator role options">
                                {roleOptions.map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        role="menuitem"
                                        className={activeFilters.role === role ? "is-selected" : ""}
                                        onClick={() => applyFilter("role", role)}
                                    >
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            className={`filter-dropdown ${openMenu === "studio" ? "is-open" : ""}`}
                        >
                            <button
                                type="button"
                                className="filter-toggle"
                                id="studio-toggle"
                                aria-haspopup="true"
                                aria-expanded={openMenu === "studio"}
                                onClick={() => toggleMenu("studio")}
                            >
                                {activeFilters.studio || "Filter by Studio"}
                            </button>
                            <div className="filter-menu" role="menu" aria-label="Studio options">
                                {studioOptions.map((studio) => (
                                    <button
                                        key={studio}
                                        type="button"
                                        role="menuitem"
                                        className={
                                            activeFilters.studio === studio ? "is-selected" : ""
                                        }
                                        onClick={() => applyFilter("studio", studio)}
                                    >
                                        {studio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="button"
                            id="clear-filters"
                            className="clear-filters-btn"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>

                    <div className="filter-divider reveal studios-reveal" aria-hidden="true" style={{ "--reveal-delay": "0.28s" }}>
                        <span></span>
                        <div className="filter-star">&#9733;</div>
                        <span></span>
                    </div>
                </div>
            </section>

            <section className="studios-layout reveal studios-reveal" style={{ "--reveal-delay": "0.12s" }}>
                <div className="compare-panel reveal studios-reveal" style={{ "--reveal-delay": "0.16s" }}>
                    <h3>
                        Compare {activeTab === "studios" ? "Studios" : "Creators"}
                    </h3>
                    <p>Select up to two cards, then compare works, active years, and genres.</p>
                    <p className="compare-hint">
                        {activeCompareSelection.length === 2
                            ? "Two profiles selected. Pick one to replace it, or click Selected to remove it."
                            : `Select ${2 - activeCompareSelection.length} more ${activeTab === "studios" ? "studio" : "creator"}${2 - activeCompareSelection.length === 1 ? "" : "s"} to unlock comparison.`}
                    </p>
                    {activeCompareSelection.length === 2 && (
                        <div className="compare-grid">
                            {activeCompareSelection.map((profile) => {
                                const genres = getProfileGenres(profile);
                                const startYear = extractStartYear(profile, activeCompareType);

                                return (
                                    <article key={`compare-${profile.name}`} className="compare-card">
                                        <h4>{profile.name}</h4>
                                        <p>
                                            <strong>Works:</strong> {profile.related.length}
                                        </p>
                                        <p>
                                            <strong>Years active:</strong> {getYearsActiveLabel(startYear)}
                                        </p>
                                        <p>
                                            <strong>Genres:</strong> {genres.length > 0 ? genres.join(", ") : "N/A"}
                                        </p>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="studios-columns studios-single-column">
                    {activeTab === "studios" && (
                        <div className="studios-column reveal studios-reveal" style={{ "--reveal-delay": "0.22s" }}>
                            <h2 className="reveal studios-reveal" style={{ "--reveal-delay": "0.26s" }}>Studios Section</h2>
                            {hasDesktopOverflowStudios && (
                                <button
                                    type="button"
                                    className="collapse-toggle-btn"
                                    onClick={() => toggleDesktopCollapsed("studio")}
                                >
                                    {desktopCollapsed.studio ? `Show All (${filteredStudios.length})` : `Show First ${DESKTOP_COLLAPSE_COUNT}`}
                                </button>
                            )}
                            {visibleStudios.map((studio, index) => renderCard(studio, "studio", index, 0.3))}
                            {filteredStudios.length === 0 && (
                                <p className="filter-empty reveal studios-reveal" style={{ "--reveal-delay": "0.34s" }}>
                                    No studios match the selected filters.
                                </p>
                            )}
                            {hasMoreStudios && (
                                <button type="button" className="load-more-btn" onClick={() => loadMoreCards("studio")}>
                                    Load More Studios
                                </button>
                            )}
                        </div>
                    )}

                    {activeTab === "creators" && (
                        <div className="studios-column reveal studios-reveal" style={{ "--reveal-delay": "0.22s" }}>
                            <h2 className="reveal studios-reveal" style={{ "--reveal-delay": "0.26s" }}>Creators Section</h2>
                            {hasDesktopOverflowCreators && (
                                <button
                                    type="button"
                                    className="collapse-toggle-btn"
                                    onClick={() => toggleDesktopCollapsed("creator")}
                                >
                                    {desktopCollapsed.creator ? `Show All (${filteredCreators.length})` : `Show First ${DESKTOP_COLLAPSE_COUNT}`}
                                </button>
                            )}
                            {visibleCreators.map((creator, index) => renderCard(creator, "creator", index, 0.3))}
                            {filteredCreators.length === 0 && (
                                <p className="filter-empty reveal studios-reveal" style={{ "--reveal-delay": "0.34s" }}>
                                    No creators match the selected filters.
                                </p>
                            )}
                            {hasMoreCreators && (
                                <button type="button" className="load-more-btn" onClick={() => loadMoreCards("creator")}>
                                    Load More Creators
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {isMobileFiltersOpen && (
                <div className="mobile-filter-sheet" onClick={() => setIsMobileFiltersOpen(false)}>
                    <div className="mobile-filter-sheet-panel" onClick={(event) => event.stopPropagation()}>
                        <div className="mobile-filter-sheet-header">
                            <h3>Filters</h3>
                            <button type="button" onClick={() => setIsMobileFiltersOpen(false)}>Close</button>
                        </div>

                        <label>
                            Era
                            <select
                                value={activeFilters.era || ""}
                                onChange={(event) => applyFilter("era", event.target.value || null)}
                            >
                                <option value="">All</option>
                                {ERA_OPTIONS.map((era) => (
                                    <option key={era} value={era}>{era}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Role
                            <select
                                value={activeFilters.role || ""}
                                onChange={(event) => applyFilter("role", event.target.value || null)}
                            >
                                <option value="">All</option>
                                {roleOptions.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Studio
                            <select
                                value={activeFilters.studio || ""}
                                onChange={(event) => applyFilter("studio", event.target.value || null)}
                            >
                                <option value="">All</option>
                                {studioOptions.map((studio) => (
                                    <option key={studio} value={studio}>{studio}</option>
                                ))}
                            </select>
                        </label>

                        <button type="button" className="load-more-btn" onClick={clearFilters}>Reset Filters</button>
                    </div>
                </div>
            )}

            {showJumpTop && (
                <button
                    type="button"
                    className="jump-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    Top
                </button>
            )}

            {selectedProfile && (
                <div className="deep-dive-modal-backdrop" onClick={closeDeepDive}>
                    <div className="deep-dive-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
                        <button type="button" className="deep-dive-close" onClick={closeDeepDive}>
                            Close
                        </button>

                        <h3>{selectedProfile.profile.name}</h3>
                        <p className="deep-dive-meta">
                            {selectedProfile.type === "creator"
                                ? selectedProfile.profile.role
                                : selectedProfile.profile.meta}
                        </p>
                        {selectedProfile.type === "creator" && (
                            <p className="deep-dive-sub">{selectedProfile.profile.affiliation}</p>
                        )}

                        <section>
                            <h4>Full Bio</h4>
                            <p>{selectedProfile.profile.detail}</p>
                        </section>

                        <section>
                            <h4>Timeline of Works</h4>
                            <ul className="timeline-list">
                                {getTimelineOfWorks(selectedProfile.profile, selectedProfile.type).map((entry) => (
                                    <li key={`${selectedProfile.profile.name}-${entry.title}`}>
                                        <span>{entry.year}</span>
                                        <div>
                                            <strong>{entry.title}</strong>
                                            <p>{entry.note}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h4>Connected Anime</h4>
                            {isLoadingConnectedAnime ? (
                                <p>Loading connected anime...</p>
                            ) : (
                                <div className="connected-anime-list">
                                    {connectedAnime.map((title) => (
                                        <span key={`${selectedProfile.profile.name}-${title}`}>{title}</span>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            )}
        </main>
    );
};

export default StudiosCreators;
