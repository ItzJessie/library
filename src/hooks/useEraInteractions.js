import { useEffect, useState } from "react";

export const useEraInteractions = () => {
    const [activeOverlay, setActiveOverlay] = useState(null);
    const [lastFocused, setLastFocused] = useState(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        const prefersCoarsePointer = window.matchMedia(
            "(pointer: coarse)"
        ).matches;

        // Mouse Glow Effect
        const glow = document.querySelector(".mouse-glow");
        if (glow && !prefersReducedMotion && !prefersCoarsePointer) {
            let targetX = window.innerWidth * 0.5;
            let targetY = window.innerHeight * 0.4;
            let currentX = targetX;
            let currentY = targetY;
            let rafId = null;

            const update = () => {
                const ease = 0.08;
                currentX += (targetX - currentX) * ease;
                currentY += (targetY - currentY) * ease;
                glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
                rafId = requestAnimationFrame(update);
            };

            const onMove = (event) => {
                targetX = event.clientX;
                targetY = event.clientY;

                if (!rafId) {
                    rafId = requestAnimationFrame(update);
                }
            };

            window.addEventListener("mousemove", onMove, { passive: true });

            return () => {
                window.removeEventListener("mousemove", onMove);
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }
            };
        }
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Reveal Animation on Scroll
        const revealItems = document.querySelectorAll(".reveal");
        if (revealItems.length) {
            if (prefersReducedMotion) {
                revealItems.forEach((item) => item.classList.add("is-visible"));
            } else {
                if (typeof IntersectionObserver === "undefined") {
                    revealItems.forEach((item) => item.classList.add("is-visible"));
                    return;
                }

                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add("is-visible");
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    {
                        threshold: 0.2,
                        rootMargin: "0px 0px -10% 0px",
                    }
                );

                revealItems.forEach((item) => observer.observe(item));

                return () => {
                    revealItems.forEach((item) => observer.unobserve(item));
                };
            }
        }
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Tilt Card Effect
        const tiltCards = document.querySelectorAll(".tilt-card");
        if (tiltCards.length && !prefersReducedMotion) {
            tiltCards.forEach((card) => {
                let rafId = null;
                let rect = null;

                const updateTilt = (event) => {
                    if (!rect) {
                        rect = card.getBoundingClientRect();
                    }

                    const x = (event.clientX - rect.left) / rect.width;
                    const y = (event.clientY - rect.top) / rect.height;
                    const tiltX = (0.5 - y) * 8;
                    const tiltY = (x - 0.5) * 10;

                    card.style.setProperty("--tilt-x", `${tiltX}deg`);
                    card.style.setProperty("--tilt-y", `${tiltY}deg`);
                    rafId = null;
                };

                const onMove = (event) => {
                    if (rafId) {
                        return;
                    }

                    rafId = window.requestAnimationFrame(() => updateTilt(event));
                };

                const onLeave = () => {
                    rect = null;
                    card.style.setProperty("--tilt-x", "0deg");
                    card.style.setProperty("--tilt-y", "0deg");
                };

                card.addEventListener("pointermove", onMove);
                card.addEventListener("pointerleave", onLeave);
                card.addEventListener("pointerdown", onLeave);

                return () => {
                    card.removeEventListener("pointermove", onMove);
                    card.removeEventListener("pointerleave", onLeave);
                    card.removeEventListener("pointerdown", onLeave);
                };
            });
        }
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Parallax Effect
        const parallaxItems = document.querySelectorAll("[data-parallax]");
        if (parallaxItems.length && !prefersReducedMotion) {
            let ticking = false;

            const updateParallax = () => {
                const scrollY = window.scrollY;
                const viewportHeight = window.innerHeight;

                parallaxItems.forEach((item) => {
                    const speed = Number.parseFloat(
                        item.getAttribute("data-parallax") || "0.1"
                    );
                    const rect = item.getBoundingClientRect();
                    const offsetTop = rect.top + scrollY;
                    const progress = scrollY - offsetTop + viewportHeight * 0.5;
                    const translateY = progress * speed;

                    item.style.setProperty("--parallax-y", `${translateY}px`);
                    item.style.transform = `translate3d(0, ${translateY}px, 0)`;
                });

                ticking = false;
            };

            const onScroll = () => {
                if (ticking) {
                    return;
                }

                ticking = true;
                window.requestAnimationFrame(updateParallax);
            };

            window.addEventListener("scroll", onScroll, { passive: true });
            window.addEventListener("resize", onScroll);
            updateParallax();

            return () => {
                window.removeEventListener("scroll", onScroll);
                window.removeEventListener("resize", onScroll);
            };
        }
    }, []);

    // Overlay management functions
    const closeOverlay = (overlay) => {
        if (!overlay) {
            return;
        }

        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-locked");

        const eraItems = document.querySelectorAll(".eras-sidebar li");
        eraItems.forEach((item) => item.classList.remove("is-active"));

        setActiveOverlay(null);

        if (lastFocused && typeof lastFocused.focus === "function") {
            lastFocused.focus();
        }

        setLastFocused(null);
    };

    const openOverlay = (overlayElement, era) => {
        if (!overlayElement) {
            return;
        }

        if (activeOverlay) {
            closeOverlay(activeOverlay);
        }

        setLastFocused(document.activeElement);
        setActiveOverlay(overlayElement);
        overlayElement.classList.add("is-open");
        overlayElement.setAttribute("aria-hidden", "false");
        document.body.classList.add("is-locked");

        const eraItems = document.querySelectorAll(".eras-sidebar li");
        eraItems.forEach((item) => {
            const isMatch = item.getAttribute("data-era") === era;
            item.classList.toggle("is-active", isMatch);
        });

        const closeButton = overlayElement.querySelector("[data-close]");
        if (closeButton) {
            closeButton.focus();
        }
    };

    return {
        activeOverlay,
        openOverlay,
        closeOverlay,
    };
};
