import {Outlet} from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/Footer";
import { ThemeProvider } from "./context/ThemeContext";

const Layout = () => {
    return (
        <ThemeProvider>
            <div className="mouse-glow" aria-hidden="true"></div>
            <Header />
            <Outlet />
            <Footer />
        </ThemeProvider>
    );
};

export default Layout;