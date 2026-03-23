import { Link, Navigate, useParams } from "react-router-dom";
import { decadeData } from "../data/siteData";
import "../css/DecadePage.css";

const DecadePage = () => {
    const { decade } = useParams();
    const data = decadeData[decade];

    if (!data) {
        return <Navigate to="/" replace />;
    }

    return (
        <main className="decade-page">
            <section className="decade-stage">
                <div className="decade-frame">
                    <p className="decade-kicker">Japanese Animation History Archive</p>
                    <div className="decade-header">
                        <span aria-hidden="true"></span>
                        <h1>{decade}</h1>
                        <span aria-hidden="true"></span>
                    </div>

                    <div className="decade-columns">
                        <section className="decade-key">
                            <h2>Key Developments</h2>
                            <ul>
                                {data.keyDevelopments.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="decade-series">
                            <h2>Influential Series</h2>
                            <div className="series-layout">
                                <div className="series-list">
                                    {data.series.map((item) => (
                                        <article className="series-item" key={item.name}>
                                            <h3><span>{item.year}</span> - {item.name}</h3>
                                            <p>{item.detail}</p>
                                        </article>
                                    ))}
                                </div>

                                <figure className="series-figure">
                                    <img src={`${process.env.PUBLIC_URL}/${data.image}`} alt={`${decade} anime collage`} />
                                </figure>
                            </div>
                        </section>
                    </div>

                    <Link className="decade-close" to="/anime-eras">CLOSE</Link>
                </div>
            </section>
        </main>
    );
};

export default DecadePage;
