import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";
import UniversalSearchOverlay from "./components/UniversalSearchOverlay";

const Layout = () => {
    const location = useLocation();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchPreview, setSearchPreview] = useState({
        isOpen: false,
        query: "",
        results: []
    });

    useEffect(() => {
        const prefersCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

        if (!prefersCoarsePointer || typeof navigator.vibrate !== "function") {
            return undefined;
        }

        const interactiveSelector = [
            "a",
            "button",
            "[role='button']",
            "[role='tab']",
            ".nav-toggle",
            ".filter-toggle",
            ".mobile-filter-toggle",
            ".clear-filters-btn",
            ".card-action-btn",
            ".timeline-button",
            ".learn-more-btn",
            ".explore-era-btn",
            ".decade-close",
            ".theme-toggle",
            ".archive-filter-chip",
            ".series-card",
            ".all-series-card--interactive",
            ".info-card",
            ".era-card",
            ".archive-card",
            ".gallery-card",
            ".carousel-card"
        ].join(", ");

        const handlePointerDown = (event) => {
            if (!(event.target instanceof Element)) {
                return;
            }

            if (event.target.closest(interactiveSelector)) {
                navigator.vibrate(8);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown, { passive: true });

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, []);

    useEffect(() => {
        const handleKeydown = (event) => {
            const target = event.target;
            const isEditable =
                target instanceof Element &&
                (target.closest("input, textarea, [contenteditable='true']") ||
                    target.getAttribute("role") === "textbox");

            if (!isEditable && event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
                event.preventDefault();
                setIsSearchOpen(true);
            }
        };

        document.addEventListener("keydown", handleKeydown);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    }, []);

    useEffect(() => {
        setIsSearchOpen(false);
    }, [location.pathname]);

    return (
        <ThemeProvider>
            <div className="site-shell">
                <div className="mouse-glow" aria-hidden="true"></div>
                <Header onOpenSearch={() => setIsSearchOpen(true)} />
                <UniversalSearchOverlay
                    isOpen={isSearchOpen}
                    onClose={() => setIsSearchOpen(false)}
                    onPreviewUpdate={setSearchPreview}
                />
                <div className="site-content">
                    <Outlet context={{ searchPreview }} />
                </div>
                <Footer />
            </div>
        </ThemeProvider>
    );
};

export default Layout;