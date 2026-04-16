import { Link } from "react-router-dom";
import "../css/Footer.css";
import ThemeToggle from "./ThemeToggle";

const Footer = () => {
	return (
		<footer className="site-footer" aria-label="Site footer">
			<div className="footer-inner">
				<div className="footer-copy">
					<p>The Japanese Animation History Archive</p>
					<span>
						This archive documents the evolution of Japanese animation through eras,
						studios, creators, and influential works that shaped both national
						culture and global media.
					</span>
				</div>
				<div className="footer-links">
					<small>&copy; Japanese Animation History Archive</small>
					<div className="footer-actions">
						<nav className="footer-nav" aria-label="Footer navigation">
							<Link to="/about">About</Link>
							<span>|</span>
							<Link to="/about#references">References</Link>
						</nav>
						<ThemeToggle />
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
