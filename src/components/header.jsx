import "../css/Header.css";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="site-header">
            <div className="header-inner">
                <Link
                    className="brand"
                    to="/"
                    aria-label="Japanese Animation History Archive home"
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
                <Navigation />
            </div>
        </header>
    );
};

export default Header;