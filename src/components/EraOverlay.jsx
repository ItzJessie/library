import { useEffect } from "react";

const EraOverlay = ({ era, isOpen, onClose }) => {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        const handleBackdropClick = (e) => {
            if (e.target.classList.contains("era-overlay")) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        const overlay = document.querySelector(`[data-era="${era.id}"]`);
        if (overlay) {
            overlay.addEventListener("click", handleBackdropClick);
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            if (overlay) {
                overlay.removeEventListener("click", handleBackdropClick);
            }
        };
    }, [isOpen, era, onClose]);

    const handleClose = () => {
        onClose();
    };

    return (
        <section
            className={`era-overlay ${isOpen ? "is-open" : ""}`}
            id={`era-overlay-${era.id}`}
            data-era={era.id}
            aria-hidden={!isOpen}
            aria-labelledby={`era-title-${era.id}`}
            role="dialog"
            aria-modal={isOpen}
        >
            <div className="era-overlay__panel" role="document">
                <div className="decade-stage">
                    <div className="decade-frame">
                        <p className="decade-kicker">
                            Japanese Animation History Archive
                        </p>
                        <div className="decade-header">
                            <span aria-hidden="true"></span>
                            <h1 id={`era-title-${era.id}`}>{era.id}</h1>
                            <span aria-hidden="true"></span>
                        </div>

                        <div className="decade-columns">
                            <section className="decade-key">
                                <h2>Key Developments</h2>
                                <ul>
                                    {era.keyDevelopments &&
                                        era.keyDevelopments.map(
                                            (development, idx) => (
                                                <li key={idx}>{development}</li>
                                            )
                                        )}
                                </ul>
                            </section>

                            <section className="decade-series">
                                <h2>Influential Series</h2>
                                <div className="series-layout">
                                    <div className="series-list">
                                        {era.influentialSeries &&
                                            era.influentialSeries.map(
                                                (series, idx) => (
                                                    <article
                                                        key={idx}
                                                        className="series-item"
                                                    >
                                                        <h3>
                                                            <span>
                                                                {series.year}
                                                            </span>{" "}
                                                            - {series.title}
                                                        </h3>
                                                        <p>
                                                            {
                                                                series.description
                                                            }
                                                        </p>
                                                    </article>
                                                )
                                            )}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <button
                            className="modal-close"
                            data-close
                            onClick={handleClose}
                            aria-label="Close modal"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EraOverlay;
