import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import Layout from "./Layout";
import Home from "./pages/home";
import About from "./pages/About";
import AnimeEras from "./pages/AnimeEras";
import StudiosCreators from "./pages/StudiosCreators";
import InfluentialSeries from "./pages/InfluentialSeries";
import AllInfluentialSeries from "./pages/AllInfluentialSeries";
import UserFeedback from "./pages/UserFeedback";
import DecadePage from "./pages/DecadePage";


const App = () => {

  
  return (
    <HashRouter>
      <Routes>
        <Route path = "/" element = {<Layout />}>
          <Route index element={<Home />} />
          <Route path="anime-eras" element={<AnimeEras />} />
          <Route path="studios-creators" element={<StudiosCreators />} />
          <Route path="influential-series" element={<InfluentialSeries />} />
          <Route path="all-influential-series" element={<AllInfluentialSeries />} />
          <Route path="user-feedback" element={<UserFeedback />} />
          <Route path="about" element={<About />} />
          <Route path=":decade" element={<DecadePage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);