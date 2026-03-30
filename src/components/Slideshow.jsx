import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../css/Slideshow.css";

const INTERVAL_MS = 5000;
const SWIPE_DISTANCE_PX = 50;
const SWIPE_VERTICAL_TOLERANCE_PX = 40;

const Slideshow = ({ slides }) => {
    const items = useMemo(() => (Array.isArray(slides) ? slides : []), [slides]);
    const hasLoop = items.length > 1;
    const [slideIndex, setSlideIndex] = useState(hasLoop ? 1 : 0);
    const [isPaused, setIsPaused] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isInstant, setIsInstant] = useState(false);
    const [stepPx, setStepPx] = useState(0);
    const trackRef = useRef(null);
    const touchStartXRef = useRef(null);
    const touchStartYRef = useRef(null);

    const displayedSlides = useMemo(() => {
        if (!hasLoop) {
            return items;
        }

        return [items[items.length - 1], ...items, items[0]];
    }, [hasLoop, items]);

    const measureStep = useCallback(() => {
        if (!trackRef.current || displayedSlides.length === 0) {
            return;
        }

        const firstCard = trackRef.current.querySelector(".carousel-card");
        if (!firstCard) {
            return;
        }

        const cardWidth = firstCard.getBoundingClientRect().width;
        const trackStyles = window.getComputedStyle(trackRef.current);
        const gapValue = parseFloat(trackStyles.gap || "0");
        const gap = Number.isNaN(gapValue) ? 0 : gapValue;
        setStepPx(cardWidth + gap);
    }, [displayedSlides.length]);

    const visibleIndex = useMemo(() => {
        if (items.length === 0) {
            return 0;
        }

        if (!hasLoop) {
            return slideIndex;
        }

        return (slideIndex - 1 + items.length) % items.length;
    }, [hasLoop, items.length, slideIndex]);

    useEffect(() => {
        setSlideIndex(hasLoop ? 1 : 0);
        setIsTransitioning(false);
        setIsInstant(true);
    }, [hasLoop, items.length]);

    useEffect(() => {
        measureStep();
    }, [measureStep, displayedSlides.length]);

    useEffect(() => {
        const handleResize = () => {
            measureStep();
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [measureStep]);

    useEffect(() => {
        if (items.length <= 1 || isPaused) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % items.length);
        }, INTERVAL_MS);

        return () => window.clearInterval(timer);
    }, [isPaused, items.length]);

    const handlePrevious = () => {
        if (isTransitioning || items.length <= 1) {
            return;
        }

        setIsTransitioning(true);
        setSlideIndex((prev) => prev - 1);
    };

    const handleNext = () => {
        if (isTransitioning || items.length <= 1) {
            return;
        }

        setIsTransitioning(true);
        setSlideIndex((prev) => prev + 1);
    };

    const handleKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            handlePrevious();
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            handleNext();
        }
    };

    const handleTouchStart = (event) => {
        const touch = event.touches[0];
        if (!touch) {
            return;
        }

        touchStartXRef.current = touch.clientX;
        touchStartYRef.current = touch.clientY;
        setIsPaused(true);
    };

    const handleTouchEnd = (event) => {
        const startX = touchStartXRef.current;
        const startY = touchStartYRef.current;
        const touch = event.changedTouches[0];

        touchStartXRef.current = null;
        touchStartYRef.current = null;
        setIsPaused(false);

        if (startX === null || startY === null || !touch) {
            return;
        }

        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX < SWIPE_DISTANCE_PX || absDeltaY > SWIPE_VERTICAL_TOLERANCE_PX || absDeltaX <= absDeltaY) {
            return;
        }

        if (deltaX < 0) {
            handleNext();
            return;
        }

        handlePrevious();
    };

    const handleTouchCancel = () => {
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        setIsPaused(false);
    };

    const handleTrackTransitionEnd = () => {
        if (!hasLoop) {
            setIsTransitioning(false);
            return;
        }

        if (slideIndex === 0) {
            setIsInstant(true);
            setSlideIndex(items.length);
            return;
        }

        if (slideIndex === displayedSlides.length - 1) {
            setIsInstant(true);
            setSlideIndex(1);
            return;
        }

        setIsTransitioning(false);
    };

    useEffect(() => {
        if (!isInstant) {
            return undefined;
        }

        const frame = window.requestAnimationFrame(() => {
            measureStep();
            setIsTransitioning(false);
            setIsInstant(false);
        });

        return () => window.cancelAnimationFrame(frame);
    }, [isInstant, measureStep]);

    if (items.length === 0) {
        return null;
    }

    const currentLabel = items[visibleIndex]?.title || "featured slide";

    return (
        <div
            className={`carousel-shell ${isPaused ? "" : "is-animating"}`.trim()}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            style={{ "--carousel-interval": `${INTERVAL_MS}ms` }}
            tabIndex={0}
            aria-label="Featured influential anime slideshow"
        >
            <div className="carousel-progress" aria-hidden="true">
                <span className="carousel-progress__bar" key={`${slideIndex}-${isPaused}`}></span>
            </div>

            <button
                className="carousel-arrow"
                aria-label={`Previous slide. Currently showing ${currentLabel}`}
                type="button"
                onClick={handlePrevious}
            >
                <span aria-hidden="true">&#8249;</span>
            </button>

            <div
                className={`carousel-track ${isInstant ? "is-instant" : ""}`.trim()}
                ref={trackRef}
                style={{ transform: `translate3d(-${slideIndex * stepPx}px, 0, 0)` }}
                aria-live="polite"
                onTransitionEnd={handleTrackTransitionEnd}
            >
                {displayedSlides.map((series, index) => (
                    <article className="carousel-card tilt-card" data-series-id={series.id} key={`${series.id}-${index}`}>
                        <img src={series.image} alt={series.title} />
                        <span>{series.title}</span>
                    </article>
                ))}
            </div>

            <button
                className="carousel-arrow"
                aria-label={`Next slide. Currently showing ${currentLabel}`}
                type="button"
                onClick={handleNext}
            >
                <span aria-hidden="true">&#8250;</span>
            </button>
        </div>
    );
};

export default Slideshow;

