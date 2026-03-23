import {Outlet} from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/Footer";

const Layout = () => {
    return (
        <>
            <div className="mouse-glow" aria-hidden="true"></div>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;