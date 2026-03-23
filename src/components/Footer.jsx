import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem("theme");
		const darkModeEnabled = savedTheme === "dark";
		setIsDarkMode(darkModeEnabled);
		document.body.classList.toggle("theme-dark", darkModeEnabled);
	}, []);

	useEffect(() => {
		document.body.classList.toggle("theme-dark", isDarkMode);
		localStorage.setItem("theme", isDarkMode ? "dark" : "light");
	}, [isDarkMode]);

	const handleThemeToggle = () => {
		setIsDarkMode((prev) => !prev);
	};

	return (
		<footer className="site-footer">
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
						<div className="footer-nav">
							<Link to="/about">About</Link>
							<span>|</span>
							<Link to="/about">References</Link>
						</div>
						<button
							className="theme-toggle"
							type="button"
							onClick={handleThemeToggle}
							aria-pressed={isDarkMode}
							aria-label={
								isDarkMode ? "Switch to light mode" : "Switch to dark mode"
							}
						>
							<span className="theme-toggle__label">
								{isDarkMode ? "Light Mode" : "Dark Mode"}
							</span>
							<span className="theme-toggle__icon" aria-hidden="true"></span>
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
