import { useEffect, useState } from "react";
import "../css/Header.css";
import Navigation from "./Navigation";
import { Link, useLocation } from "react-router-dom";

const Header = ({ onOpenSearch = () => {} }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const closeOnResize = () => {
            if (window.innerWidth > 1167) {
                setMenuOpen(false);
            }
        };

        window.addEventListener("resize", closeOnResize);
        return () => window.removeEventListener("resize", closeOnResize);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        if (!menuOpen) {
            return undefined;
        }

        const closeOnEscape = (event) => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        };

        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    const headerClass = [
        "site-header",
        "has-nav-toggle",
        menuOpen ? "nav-open" : ""
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <header className={headerClass}>
            <div className="header-inner">
                <Link
                    className="brand"
                    to="/"
                    aria-label="Japanese Animation History Archive home"
                    onClick={closeMenu}
                >
                    <img
                        className="brand-logo"
                        src={`${process.env.PUBLIC_URL}/images/image-1771616736593.png`}
                        alt="Japanese Animation History Archive logo"
                        width="56"
                        height="56"
                    />
                    <div className="brand-text">
                        <span className="brand-title">Japanese Animation History Archive</span>
                    </div>
                </Link>
                <button
                    className="nav-toggle"
                    type="button"
                    aria-expanded={menuOpen}
                    aria-controls="primary-nav"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    <span aria-hidden="true">{menuOpen ? "\u2715" : "\u2630"}</span>
                </button>
                <div id="primary-nav">
                    <Navigation onNavigate={closeMenu} onOpenSearch={onOpenSearch} />
                </div>
            </div>
        </header>
    );
};

export default Header;