import { useEffect, useMemo, useState } from "react";
import { creators, studios } from "../data/siteData";
import "../css/StudiosCreatorsPage.css";
import ProfileCard from "../components/ProfileCard";
import { useEraInteractions } from "../hooks/useEraInteractions";

const ERA_OPTIONS = ["1980s", "1990s", "2000s", "2010s", "2020s"];

const CREATOR_ERA_BY_NAME = {
    "Eiichiro Oda": "1990s",
    "Hideaki Anno": "1990s",
    "Yoshihiro Togashi": "1990s",
    "Hayao Miyazaki": "1980s",
    "Kohei Horikoshi": "2010s",
    "Kunihiko Ikuhara": "1990s",
    "Haruo Sotozaki": "2010s"
};

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

const StudiosCreators = () => {
    useEraInteractions();

    const [openMenu, setOpenMenu] = useState(null);
    const [activeFilters, setActiveFilters] = useState({
        era: null,
        role: null,
        studio: null
    });

    const roleOptions = useMemo(() => {
        const allRoles = creators.flatMap((creator) => getRoles(creator.role));
        return [...new Set(allRoles)].sort((a, b) => a.localeCompare(b));
    }, []);

    const studioOptions = useMemo(() => {
        const allStudios = studios.map((studio) => normalizeStudioName(studio.name));
        return [...new Set(allStudios)].sort((a, b) => a.localeCompare(b));
    }, []);

    const filteredStudios = useMemo(() => {
        return studios.filter((studio) => {
            const studioEra = extractEra(studio.meta);
            const studioName = normalizeStudioName(studio.name);

            if (activeFilters.era && studioEra !== activeFilters.era) {
                return false;
            }

            if (
                activeFilters.studio &&
                studioName.toLowerCase() !== activeFilters.studio.toLowerCase()
            ) {
                return false;
            }

            return true;
        });
    }, [activeFilters]);

    const filteredCreators = useMemo(() => {
        return creators.filter((creator) => {
            const creatorEra = CREATOR_ERA_BY_NAME[creator.name] || null;
            const creatorRoles = getRoles(creator.role).map((role) => role.toLowerCase());
            const creatorAffiliations = (creator.affiliation || "").toLowerCase();

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

            return true;
        });
    }, [activeFilters]);

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
        setOpenMenu(null);
    };

    return (
        <main className="page-studios">
            <section className="studios-hero">
                <div className="studios-hero-inner reveal studios-reveal" style={{ "--reveal-delay": "0.04s" }}>
                    <h1 className="reveal studios-reveal" style={{ "--reveal-delay": "0.1s" }}>Studios &amp; Creators</h1>
                    <p className="filter-title reveal studios-reveal" style={{ "--reveal-delay": "0.16s" }}>Filter Bar</p>

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
                <div className="studios-columns">
                    <div className="studios-column reveal studios-reveal" style={{ "--reveal-delay": "0.18s" }}>
                        <h2 className="reveal studios-reveal" style={{ "--reveal-delay": "0.22s" }}>Studios Section</h2>
                        {filteredStudios.map((studio, index) => (
                            <div
                                key={studio.name}
                                className="reveal studios-reveal"
                                style={{ "--reveal-delay": `${Math.min(index * 0.07 + 0.24, 0.66)}s` }}
                            >
                                <ProfileCard profile={studio} type="studio" />
                            </div>
                        ))}
                        {filteredStudios.length === 0 && (
                            <p className="filter-empty reveal studios-reveal" style={{ "--reveal-delay": "0.28s" }}>
                                No studios match the selected filters.
                            </p>
                        )}
                    </div>

                    <div className="studios-column reveal studios-reveal" style={{ "--reveal-delay": "0.24s" }}>
                        <h2 className="reveal studios-reveal" style={{ "--reveal-delay": "0.28s" }}>Creators Section</h2>
                        {filteredCreators.map((creator, index) => (
                            <div
                                key={creator.name}
                                className="reveal studios-reveal"
                                style={{ "--reveal-delay": `${Math.min(index * 0.07 + 0.3, 0.72)}s` }}
                            >
                                <ProfileCard profile={creator} type="creator" />
                            </div>
                        ))}
                        {filteredCreators.length === 0 && (
                            <p className="filter-empty reveal studios-reveal" style={{ "--reveal-delay": "0.34s" }}>
                                No creators match the selected filters.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default StudiosCreators;
