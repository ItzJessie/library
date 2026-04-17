import { NavLink } from "react-router-dom";
import "../css/Navigation.css";

const noop = () => {};

const Navigation = ({ onNavigate = noop, onOpenSearch = noop }) => {
    const getNavClass = ({ isActive }) => (isActive ? "is-active" : "");
    const handleSearchClick = () => {
        onOpenSearch();
        onNavigate();
    };

    return (
        <nav className="main-nav" aria-label="Primary">
            <NavLink end className={getNavClass} to="/" onClick={onNavigate}>Home</NavLink>
            <NavLink className={getNavClass} to="/anime-eras" onClick={onNavigate}>Anime Eras</NavLink>
            <NavLink className={getNavClass} to="/studios-creators" onClick={onNavigate}>Studios &amp; Creators</NavLink>
            <NavLink className={getNavClass} to="/influential-series" onClick={onNavigate}>Influential Series</NavLink>
            <NavLink className={getNavClass} to="/user-feedback" onClick={onNavigate}>User Feedback Page</NavLink>
            <NavLink className={getNavClass} to="/about" onClick={onNavigate}>About</NavLink>
            <button 
                className="nav-search-trigger" 
                type="button" 
                onClick={handleSearchClick} 
                aria-label="Open universal search"
                title="Open universal search"
            >
                <span className="search-icon" aria-hidden="true"></span>
                <span className="search-text-full">Search</span>
                <span className="search-text-short">Search</span>
            </button>
        </nav>
    );
};

export default Navigation;