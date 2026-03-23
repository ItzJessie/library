import { NavLink } from "react-router-dom";
import "../css/Navigation.css";

const Navigation = () => {
    const getNavClass = ({ isActive }) => (isActive ? "is-active" : "");

    return (
        <nav className="main-nav" aria-label="Primary">
            <NavLink className={getNavClass} to="/">Home</NavLink>
            <NavLink className={getNavClass} to="/anime-eras">Anime Eras</NavLink>
            <NavLink className={getNavClass} to="/studios-creators">Studios &amp; Creators</NavLink>
            <NavLink className={getNavClass} to="/influential-series">Influential Series</NavLink>
            <NavLink className={getNavClass} to="/user-feedback">User Feedback Page</NavLink>
            <NavLink className={getNavClass} to="/about">About</NavLink>
        </nav>
    );
};

export default Navigation;