import { NavLink } from "react-router-dom";
import "../css/Navigation.css";

const Navigation = ({ onNavigate }) => {
    const getNavClass = ({ isActive }) => (isActive ? "is-active" : "");

    return (
        <nav className="main-nav" aria-label="Primary">
            <NavLink className={getNavClass} to="/" onClick={onNavigate}>Home</NavLink>
            <NavLink className={getNavClass} to="/anime-eras" onClick={onNavigate}>Anime Eras</NavLink>
            <NavLink className={getNavClass} to="/studios-creators" onClick={onNavigate}>Studios &amp; Creators</NavLink>
            <NavLink className={getNavClass} to="/influential-series" onClick={onNavigate}>Influential Series</NavLink>
            <NavLink className={getNavClass} to="/user-feedback" onClick={onNavigate}>User Feedback Page</NavLink>
            <NavLink className={getNavClass} to="/about" onClick={onNavigate}>About</NavLink>
        </nav>
    );
};

export default Navigation;