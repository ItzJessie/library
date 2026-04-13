import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import animeSeries from "../data/animeSeries.json";
import "../css/AllInfluentialSeriesPage.css";

const buildSeriesId = (title) =>
    `series-${title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")}`;

const eraLabels = {
    "1980s": "80s trailblazer",
    "1990s": "90s cornerstone",
    "2000s": "2000s landmark",
    "2010s": "2010s standout",
    "2020s": "current-era force"
};

const timelineEras = ["1980s", "1990s", "2000s", "2010s", "2020s"];

const eraTimelineMeta = {
    "1980s": { icon: "◉", hint: "Home video boom" },
    "1990s": { icon: "⭐", hint: "Digital animation begins" },
    "2000s": { icon: "▶", hint: "Streaming era starts" },
    "2010s": { icon: "✦", hint: "Global fandom expands" },
    "2020s": { icon: "◆", hint: "New platforms, new pace" }
};

const eraRanges = {
    "1980s": "1980-1989",
    "1990s": "1990-1999",
    "2000s": "2000-2009",
    "2010s": "2010-2019",
    "2020s": "2020-now"
};

const creatorNotes = {
    "Fullmetal Alchemist": "Hiromu Arakawa",
    "Hunter x Hunter": "Yoshihiro Togashi",
    "One Punch Man": "ONE and Yusuke Murata",
    "Chainsaw Man": "Tatsuki Fujimoto",
    "JoJo's Bizarre Adventure": "Hirohiko Araki",
    Bleach: "Tite Kubo",
    "Cyberpunk: Edgerunners": "Hiroyuki Imaishi with CD PROJEKT RED",
    "Code Geass": "Goro Taniguchi and Ichiro Okouchi",
    "Princess Mononoke": "Hayao Miyazaki",
    "Cowboy Bebop": "Shinichiro Watanabe",
    Dandadan: "Yukinobu Tatsu",
    "Dragon Ball Z": "Akira Toriyama",
    "Steins;Gate": "Chiyomaru Shikura and Nitroplus",
    "Spy x Family": "Tatsuya Endo",
    "Ghost in the Shell": "Masamune Shirow and Mamoru Oshii",
    Pokemon: "Satoshi Tajiri, Ken Sugimori, and Junichi Masuda",
    "Mushoku Tensei": "Rifujin na Magonote",
    "Mob Psycho 100": "ONE",
    "Tokyo Ghoul": "Sui Ishida",
    Hellsing: "Kouta Hirano",
    Naruto: "Masashi Kishimoto",
    "Yu Yu Hakusho": "Yoshihiro Togashi",
    "Neon Genesis Evangelion": "Hideaki Anno",
    "My Hero Academia": "Kouhei Horikoshi",
    "Sailor Moon": "Naoko Takeuchi",
    Inuyasha: "Rumiko Takahashi",
    Trigun: "Yasuhiro Nightow",
    "Gundam Wing": "Yoshiyuki Tomino and Hajime Yatate",
    "Samurai Champloo": "Shinichiro Watanabe",
    Akira: "Katsuhiro Otomo",
    "Rurouni Kenshin": "Nobuhiro Watsuki",
    "Spirited Away": "Hayao Miyazaki",
    "Your Name": "Makoto Shinkai",
    "Dragon Ball": "Akira Toriyama",
    "Haikyu!!": "Haruichi Furudate",
    Gintama: "Hideaki Sorachi",
    "Violet Evergarden": "Kana Akatsuki and Akiko Takase",
    "Fate/Zero": "Gen Urobuchi and Type-Moon",
    Monster: "Naoki Urasawa",
    "Paranoia Agent": "Satoshi Kon",
    "One Piece": "Eiichiro Oda",
    "Death Note": "Tsugumi Ohba and Takeshi Obata",
    "Attack on Titan": "Hajime Isayama",
    "Demon Slayer": "Koyoharu Gotouge",
    "Jujutsu Kaisen": "Gege Akutami",
    ODDTAXI: "Kazuya Konomoto",
    "Puella Magi Madoka Magica": "Magica Quartet"
};

const impactNotes = {
    "Fullmetal Alchemist":
        "A benchmark for tightly structured shonen storytelling with emotional payoff that still reads as modern.",
    "Hunter x Hunter":
        "Known for constantly reinventing battle manga rules and rewarding strategic, high-stakes worldbuilding.",
    "One Punch Man":
        "Turned superhero parody into a mainstream hit and reset expectations for action-comedy pacing.",
    "Chainsaw Man":
        "Helped push a sharper, more chaotic style of modern shonen into the center of the conversation.",
    "Cowboy Bebop":
        "A cross-genre gateway title that made anime feel instantly cool, musical, and cinematic to global audiences.",
    "Neon Genesis Evangelion":
        "Reframed mecha as psychological drama and became one of anime's most debated cultural touchstones.",
    "Dragon Ball Z":
        "One of the clearest blueprints for modern battle anime structure, tournament energy, and power scaling.",
    "Attack on Titan":
        "A modern phenomenon that kept weekly conversation alive while broadening anime's mainstream visibility.",
    "Death Note":
        "A thriller that proved anime could thrive on razor-edged cat-and-mouse plotting over raw spectacle.",
    "Sailor Moon":
        "A foundational series for magical-girl imagery, ensemble friendship, and everyday heroism.",
    "Spirited Away":
        "A prestige landmark that carried anime into awards-season conversations worldwide.",
    "Akira":
        "A visual landmark that helped establish anime's global reputation for ambition and detail.",
    "One Piece":
        "The long-running adventure standard for worldbuilding, scale, and emotional continuity.",
    Monster: "A masterclass in slow-burn suspense that shows how far anime can go as adult drama.",
    ODDTAXI:
        "A recent cult favorite that proved tightly written ensemble mysteries still find passionate audiences."
};

const iconicTitleBoosts = {
    Akira: 20,
    "Attack on Titan": 18,
    Bleach: 14,
    "Chainsaw Man": 12,
    "Code Geass": 13,
    "Cowboy Bebop": 20,
    "Death Note": 16,
    "Demon Slayer": 12,
    "Dragon Ball": 20,
    "Dragon Ball Z": 20,
    "Fullmetal Alchemist": 18,
    "Ghost in the Shell": 16,
    Gintama: 12,
    Hellsing: 10,
    "Hunter x Hunter": 18,
    Inuyasha: 11,
    "Jujutsu Kaisen": 11,
    "JoJo's Bizarre Adventure": 18,
    Monster: 18,
    Naruto: 18,
    "Neon Genesis Evangelion": 20,
    "One Piece": 20,
    "One Punch Man": 14,
    Pokemon: 18,
    "Princess Mononoke": 19,
    "Puella Magi Madoka Magica": 13,
    "Samurai Champloo": 12,
    "Haikyu!!": 12,
    "Sailor Moon": 18,
    "Spirited Away": 20,
    "Steins;Gate": 17,
    "Tokyo Ghoul": 10,
    "Violet Evergarden": 11,
    "Yu Yu Hakusho": 16,
    "Your Name": 18
};

const genrePalette = [
    ["Action", 14],
    ["Adventure", 42],
    ["Comedy", 168],
    ["Dark Fantasy", 2],
    ["Drama", 230],
    ["Fantasy", 300],
    ["Horror", 0],
    ["Mecha", 210],
    ["Neo-Noir", 255],
    ["Psychological", 315],
    ["Sci-Fi", 190],
    ["Shonen", 32],
    ["Slice of Life", 140],
    ["Superhero", 205],
    ["Supernatural", 280],
    ["Thriller", 356]
];

const getEraLabel = (year) => {
    if (year >= 2020) {
        return "2020s";
    }

    if (year >= 2010) {
        return "2010s";
    }

    if (year >= 2000) {
        return "2000s";
    }

    if (year >= 1990) {
        return "1990s";
    }

    return "1980s";
};

const getEpisodeFilter = (episodes) => {
    if (episodes >= 150) {
        return "150+ episodes";
    }

    if (episodes >= 75) {
        return "75-149 episodes";
    }

    if (episodes >= 25) {
        return "25-74 episodes";
    }

    if (episodes >= 13) {
        return "13-24 episodes";
    }

    return "1-12 episodes";
};

const getTimelinePlacement = (year) => `${eraLabels[getEraLabel(year)]} / ${year}`;

const getEraRangeLabel = (era) => eraRanges[era] || "";

const getGenreTone = (genre) => {
    const normalizedGenre = genre.trim();
    const colorEntry = genrePalette.find(([label]) => normalizedGenre.includes(label));
    return colorEntry ? colorEntry[1] : (normalizedGenre.length * 17) % 360;
};

const DEMO_ANIME_API_BASE_URL = "https://demo-backend.onrender.com";

const getDefaultApiBaseUrl = () =>
    process.env.NODE_ENV === "production"
        ? DEMO_ANIME_API_BASE_URL
        : "http://localhost:3001";

const isLocalhostUrl = (value) =>
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(String(value || "").trim());

const isLocalhostRuntime = () => {
    if (typeof window === "undefined") {
        return false;
    }

    return /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
};

const resolveAnimeApiBaseUrl = () => {
    const explicitBaseUrl =
        process.env.REACT_APP_ANIME_API_BASE_URL ||
        process.env.REACT_APP_API_URL ||
        "";

    if (
        process.env.NODE_ENV === "production" &&
        isLocalhostUrl(explicitBaseUrl) &&
        !isLocalhostRuntime()
    ) {
        return getDefaultApiBaseUrl();
    }

    return (explicitBaseUrl || getDefaultApiBaseUrl()).replace(/\/+$/, "");
};

const resolveAnimeApiBaseUrls = () => {
    const preferredBaseUrl = resolveAnimeApiBaseUrl();
    const candidates = [preferredBaseUrl];
    const hasExplicitBaseUrl = Boolean(
        process.env.REACT_APP_ANIME_API_BASE_URL || process.env.REACT_APP_API_URL
    );

    if (!hasExplicitBaseUrl && preferredBaseUrl !== DEMO_ANIME_API_BASE_URL) {
        candidates.push(DEMO_ANIME_API_BASE_URL);
    }

    return candidates;
};

const ANIME_API_PATH = "/get";
const ANIME_CREATE_API_PATH_CANDIDATES = ["/add", "/create", "/new"];

const toUploadImagePath = (fileName) => {
    const normalizedName = String(fileName || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9._-]/g, "");

    return `images/uploads/${normalizedName || "poster-image.jpg"}`;
};

const createAnimeFieldRules = {
    title: { min: 2, max: 120 },
    year: { min: 1960, max: new Date().getFullYear() + 1 },
    studio: { min: 2, max: 90 },
    genre: { min: 2, max: 80 },
    episodes: { min: 1, max: 2500 },
    synopsis: { min: 20, max: 1200 },
    img_name: { min: 6, max: 512 }
};

const validateAnimeCreatePayload = (payload) => {
    const errors = {};

    const title = String(payload.title || "").trim();
    if (!title) {
        errors.title = "Title is required.";
    } else if (title.length < createAnimeFieldRules.title.min) {
        errors.title = `Title must be at least ${createAnimeFieldRules.title.min} characters.`;
    } else if (title.length > createAnimeFieldRules.title.max) {
        errors.title = `Title must be less than ${createAnimeFieldRules.title.max + 1} characters.`;
    }

    const yearValue = Number(payload.year);
    if (!Number.isInteger(yearValue)) {
        errors.year = "Year must be a whole number.";
    } else if (yearValue < createAnimeFieldRules.year.min || yearValue > createAnimeFieldRules.year.max) {
        errors.year = `Year must be between ${createAnimeFieldRules.year.min} and ${createAnimeFieldRules.year.max}.`;
    }

    const studio = String(payload.studio || "").trim();
    if (!studio) {
        errors.studio = "Studio is required.";
    } else if (studio.length < createAnimeFieldRules.studio.min || studio.length > createAnimeFieldRules.studio.max) {
        errors.studio = `Studio must be ${createAnimeFieldRules.studio.min}-${createAnimeFieldRules.studio.max} characters.`;
    }

    const genre = String(payload.genre || "").trim();
    if (!genre) {
        errors.genre = "Genre is required.";
    } else if (genre.length < createAnimeFieldRules.genre.min || genre.length > createAnimeFieldRules.genre.max) {
        errors.genre = `Genre must be ${createAnimeFieldRules.genre.min}-${createAnimeFieldRules.genre.max} characters.`;
    }

    const episodesValue = Number(payload.episodes);
    if (!Number.isInteger(episodesValue)) {
        errors.episodes = "Episodes must be a whole number.";
    } else if (
        episodesValue < createAnimeFieldRules.episodes.min ||
        episodesValue > createAnimeFieldRules.episodes.max
    ) {
        errors.episodes = `Episodes must be between ${createAnimeFieldRules.episodes.min} and ${createAnimeFieldRules.episodes.max}.`;
    }

    const synopsis = String(payload.synopsis || "").trim();
    if (!synopsis) {
        errors.synopsis = "Synopsis is required.";
    } else if (synopsis.length < createAnimeFieldRules.synopsis.min || synopsis.length > createAnimeFieldRules.synopsis.max) {
        errors.synopsis = `Synopsis must be ${createAnimeFieldRules.synopsis.min}-${createAnimeFieldRules.synopsis.max} characters.`;
    }

    const imagePath = String(payload.img_name || "").trim();
    const hasValidImageFormat = /^(https?:\/\/[^\s]+|images\/[A-Za-z0-9_./-]+)$/i.test(imagePath);
    if (!imagePath) {
        errors.img_name = "Poster image path is required.";
    } else if (imagePath.length < createAnimeFieldRules.img_name.min || imagePath.length > createAnimeFieldRules.img_name.max) {
        errors.img_name = `Poster image path must be ${createAnimeFieldRules.img_name.min}-${createAnimeFieldRules.img_name.max} characters.`;
    } else if (!hasValidImageFormat) {
        errors.img_name = "Use a full URL or a relative path like images/your-poster.webp.";
    }

    return errors;
};

const normalizeCreatedAnimeRecord = (record, fallbackPayload) => {
    const source = record && typeof record === "object" ? record : {};

    return {
        title: source.title || fallbackPayload.title,
        img_name: source.img_name || source.image || fallbackPayload.img_name,
        year: Number(source.year || fallbackPayload.year),
        era: source.era || fallbackPayload.era,
        studio: source.studio || fallbackPayload.studio,
        genre: source.genre || fallbackPayload.genre,
        episodes: Number(source.episodes || fallbackPayload.episodes),
        synopsis: source.synopsis || fallbackPayload.synopsis
    };
};

const getInfluenceScore = (series) => {
    const eraWeight = {
        "1980s": 16,
        "1990s": 18,
        "2000s": 16,
        "2010s": 14,
        "2020s": 12
    }[getEraLabel(series.year)] || 12;

    const episodeWeight =
        series.episodes >= 300 ? 18 :
        series.episodes >= 150 ? 14 :
        series.episodes >= 75 ? 11 :
        series.episodes >= 25 ? 8 :
        series.episodes >= 13 ? 6 : 4;

    const genreWeight = series.genres.reduce((total, genre) => {
        if (genre === "Action" || genre === "Adventure") {
            return total + 3;
        }

        if (
            genre === "Sci-Fi" ||
            genre === "Fantasy" ||
            genre === "Psychological" ||
            genre === "Supernatural"
        ) {
            return total + 2;
        }

        return total + 1;
    }, 0);

    const legacyWeight = iconicTitleBoosts[series.title] || 0;

    return Math.min(99, Math.max(58, eraWeight + episodeWeight + genreWeight + legacyWeight));
};

const getPrimaryBadgeLabel = (rank, totalSeriesCount, score) => {
    const percentile = rank / Math.max(totalSeriesCount, 1);

    if (percentile <= 0.08) {
        return { icon: "⭐", label: "Genre Defining", tone: "gold" };
    }

    if (percentile <= 0.18 || score >= 90) {
        return { icon: "🔥", label: "Modern Classic", tone: "ember" };
    }

    if (percentile <= 0.38 || score >= 82) {
        return { icon: "🧠", label: "Cultural Impact", tone: "violet" };
    }

    if (percentile <= 0.62 || score >= 74) {
        return { icon: "⚡", label: "Cult Favorite", tone: "teal" };
    }

    return { icon: "✦", label: "Hidden Gem", tone: "sage" };
};

const getSeriesContextLabel = (series) => {
    const descriptorBuckets = [
        {
            match: (item) => item.genres.includes("Mecha") || item.genres.includes("Sci-Fi"),
            label: "Visionary Sci-Fi"
        },
        {
            match: (item) => item.genres.includes("Psychological"),
            label: "Mind-Bending Story"
        },
        {
            match: (item) => item.genres.includes("Shonen") && item.episodes >= 100,
            label: "Shonen Marathon"
        },
        {
            match: (item) => item.genres.includes("Supernatural"),
            label: "Supernatural Force"
        },
        {
            match: (item) => item.genres.includes("Slice of Life"),
            label: "Quiet Favorite"
        },
        {
            match: (item) => item.episodes <= 12,
            label: "Compact Powerhouse"
        },
        {
            match: (item) => item.year >= 2020,
            label: "New Era Standout"
        },
        {
            match: (item) => item.year < 2000,
            label: "Legacy Anchor"
        }
    ];

    const bucket = descriptorBuckets.find((entry) => entry.match(series));
    if (bucket) {
        return bucket.label;
    }

    return series.studio.includes("Studio Ghibli") ? "Prestige Classic" : `${series.studio} Spotlight`;
};

const getInfluenceBadge = (series, rank, totalSeriesCount) => {
    const primary = getPrimaryBadgeLabel(rank, totalSeriesCount, series.score);
    const context = getSeriesContextLabel(series);

    return {
        ...primary,
        label: primary.label,
        detail: context
    };
};

const getCreatorNote = (title, studio) => creatorNotes[title] || `${studio} production team`;

const getCulturalImpact = (series, score) =>
    impactNotes[series.title] ||
    `${series.title} is a ${getEraLabel(series.year)} standout with a ${
        score >= 84 ? "high" : "steady"
    } influence profile, especially across ${series.genres[0]?.toLowerCase() || "anime"} fans and creators.`;

const getTrailerUrl = (title) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} anime trailer`)}`;

const getHeroSummary = (count, totalCount, filtersActive) => {
    if (!count) {
        return "No matches right now. Loosen the filters or clear the search to bring the archive back.";
    }

    if (filtersActive) {
        return `Showing ${count} carefully matched series from the ${totalCount}-title archive.`;
    }

    return `Explore ${totalCount} influential series with clickable cards, badges, and detailed context.`;
};

const normalizeRemoteImage = (imgName, apiBaseUrl) => {
    if (!imgName) {
        return "";
    }

    if (/^https?:\/\//i.test(imgName)) {
        return imgName;
    }

    const normalizedApiBase = apiBaseUrl.replace(/\/$/, "");
    const normalizedImagePath = String(imgName).replace(/^\/+/, "");
    return `${normalizedApiBase}/${normalizedImagePath}`;
};

const AllInfluentialSeries = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const [selectedGenre, setSelectedGenre] = useState("all");
    const [selectedStudio, setSelectedStudio] = useState("all");
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedTimelineEra, setSelectedTimelineEra] = useState("all");
    const [selectedEpisodeBand, setSelectedEpisodeBand] = useState("all");
    const [timelinePhase, setTimelinePhase] = useState("idle");
    const [sortBy, setSortBy] = useState("influential");
    const [selectedSeries, setSelectedSeries] = useState(null);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [remoteAnimeSeries, setRemoteAnimeSeries] = useState([]);
    const [isAnimeLoading, setIsAnimeLoading] = useState(true);
    const [animeSource, setAnimeSource] = useState("local");
    const [animeSourceMessage, setAnimeSourceMessage] = useState("");
    const [newAnimeForm, setNewAnimeForm] = useState({
        title: "",
        year: "",
        studio: "",
        genre: "",
        episodes: "",
        synopsis: "",
        img_name: ""
    });
    const [newAnimeErrors, setNewAnimeErrors] = useState({});
    const [newAnimeImagePreviewUrl, setNewAnimeImagePreviewUrl] = useState("");
    const [newAnimeImageLabel, setNewAnimeImageLabel] = useState("");
    const [isSubmittingAnime, setIsSubmittingAnime] = useState(false);
    const [createAnimeStatus, setCreateAnimeStatus] = useState({ type: "idle", message: "" });
    const searchFormRef = useRef(null);
    const timelineRailRef = useRef(null);
    const timelineButtonRefs = useRef({});
    const timelineTransitionTimersRef = useRef([]);
    const location = useLocation();
    const animeApiBaseUrls = useMemo(() => resolveAnimeApiBaseUrls(), []);
    const [animeApiBaseUrl, setAnimeApiBaseUrl] = useState(animeApiBaseUrls[0]);

    // Mobile UX improvements
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [cardsToShow, setCardsToShow] = useState(12);
    const CARDS_PER_PAGE = 12;

    useEffect(() => {
        const abortController = new AbortController();

        const loadAnimeFromApi = async () => {
            try {
                setIsAnimeLoading(true);
                let lastError = null;

                for (const baseUrl of animeApiBaseUrls) {
                    try {
                        const response = await fetch(`${baseUrl}${ANIME_API_PATH}`, {
                            signal: abortController.signal
                        });

                        if (!response.ok) {
                            throw new Error(`API responded with status ${response.status}`);
                        }

                        const payload = await response.json();
                        if (!Array.isArray(payload)) {
                            throw new Error("API payload for anime list is not an array");
                        }

                        setAnimeApiBaseUrl(baseUrl);
                        setRemoteAnimeSeries(payload);
                        setAnimeSource("api");
                        setAnimeSourceMessage(`Loaded ${payload.length} titles from backend API.`);
                        return;
                    } catch (error) {
                        if (error.name === "AbortError") {
                            throw error;
                        }

                        lastError = error;
                    }
                }

                throw lastError || new Error("No backend API candidates responded");
            } catch (error) {
                if (error.name === "AbortError") {
                    return;
                }

                console.warn(
                    `Falling back to local anime data after trying ${animeApiBaseUrls.join(" and ")}`,
                    error
                );
                setRemoteAnimeSeries([]);
                setAnimeSource("local");
                setAnimeSourceMessage(
                    `Using local archive fallback because backend API could not be reached at ${animeApiBaseUrls.join(" or ")}.`
                );
            } finally {
                setIsAnimeLoading(false);
            }
        };

        loadAnimeFromApi();

        return () => {
            abortController.abort();
        };
    }, [animeApiBaseUrls]);

    const animeDataset = useMemo(() => {
        if (animeSource === "api") {
            return remoteAnimeSeries;
        }

        return animeSeries;
    }, [animeSource, remoteAnimeSeries]);

    const handleNewAnimeFieldChange = useCallback((event) => {
        const { name, value } = event.target;

        setNewAnimeForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setNewAnimeErrors((previous) => {
            if (!previous[name]) {
                return previous;
            }

            const nextErrors = { ...previous };
            delete nextErrors[name];
            return nextErrors;
        });

        if (createAnimeStatus.type !== "idle") {
            setCreateAnimeStatus({ type: "idle", message: "" });
        }
    }, [createAnimeStatus.type]);

    const handleNewAnimeImageChange = useCallback((event) => {
        const selectedFile = event.target.files?.[0] || null;

        setNewAnimeErrors((previous) => {
            if (!previous.img_name) {
                return previous;
            }

            const nextErrors = { ...previous };
            delete nextErrors.img_name;
            return nextErrors;
        });

        if (!selectedFile) {
            setNewAnimeForm((previous) => ({
                ...previous,
                img_name: ""
            }));
            setNewAnimeImageLabel("");
            setNewAnimeImagePreviewUrl((previous) => {
                if (previous) {
                    URL.revokeObjectURL(previous);
                }
                return "";
            });
            return;
        }

        const imagePath = toUploadImagePath(selectedFile.name);
        const previewUrl = URL.createObjectURL(selectedFile);

        setNewAnimeForm((previous) => ({
            ...previous,
            img_name: imagePath
        }));
        setNewAnimeImageLabel(selectedFile.name);
        setNewAnimeImagePreviewUrl((previous) => {
            if (previous) {
                URL.revokeObjectURL(previous);
            }
            return previewUrl;
        });

        if (createAnimeStatus.type !== "idle") {
            setCreateAnimeStatus({ type: "idle", message: "" });
        }
    }, [createAnimeStatus.type]);

    useEffect(
        () => () => {
            if (newAnimeImagePreviewUrl) {
                URL.revokeObjectURL(newAnimeImagePreviewUrl);
            }
        },
        [newAnimeImagePreviewUrl]
    );

    const handleCreateAnimeSubmit = useCallback(
        async (event) => {
            event.preventDefault();

            const payload = {
                title: newAnimeForm.title.trim(),
                year: Number(newAnimeForm.year),
                studio: newAnimeForm.studio.trim(),
                genre: newAnimeForm.genre.trim(),
                episodes: Number(newAnimeForm.episodes),
                synopsis: newAnimeForm.synopsis.trim(),
                img_name: newAnimeForm.img_name.trim(),
                era: getEraLabel(Number(newAnimeForm.year))
            };

            const errors = validateAnimeCreatePayload(payload);
            if (Object.keys(errors).length > 0) {
                setNewAnimeErrors(errors);
                setCreateAnimeStatus({
                    type: "error",
                    message: "Please fix the highlighted fields before submitting."
                });
                return;
            }

            setNewAnimeErrors({});
            setIsSubmittingAnime(true);
            setCreateAnimeStatus({ type: "idle", message: "" });

            try {
                let lastError = null;

                for (const baseUrl of animeApiBaseUrls) {
                    for (const path of ANIME_CREATE_API_PATH_CANDIDATES) {
                        try {
                            const response = await fetch(`${baseUrl}${path}`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(payload)
                            });

                            if (response.status === 404) {
                                continue;
                            }

                            const responseData = await response.json().catch(() => null);

                            if (!response.ok) {
                                const serverMessage =
                                    responseData?.message ||
                                    responseData?.error ||
                                    `Server rejected the request with status ${response.status}.`;
                                throw new Error(serverMessage);
                            }

                            const createdRecord =
                                responseData?.data || responseData?.anime || responseData?.item || responseData;
                            const normalizedRecord = normalizeCreatedAnimeRecord(createdRecord, payload);

                            setAnimeApiBaseUrl(baseUrl);
                            setAnimeSource("api");
                            setRemoteAnimeSeries((previous) => {
                                const next =
                                    Array.isArray(previous) && previous.length > 0
                                        ? [...previous]
                                        : animeSource === "local"
                                            ? [...animeSeries]
                                            : [];
                                const duplicateIndex = next.findIndex((entry) => {
                                    const sameTitle =
                                        String(entry?.title || entry?.name || "").trim().toLowerCase() ===
                                        normalizedRecord.title.toLowerCase();
                                    const sameYear = Number(entry?.year) === Number(normalizedRecord.year);
                                    return sameTitle && sameYear;
                                });

                                if (duplicateIndex >= 0) {
                                    next[duplicateIndex] = {
                                        ...next[duplicateIndex],
                                        ...normalizedRecord
                                    };
                                    return next;
                                }

                                return [normalizedRecord, ...next];
                            });

                            setCreateAnimeStatus({
                                type: "success",
                                message: `Saved \"${normalizedRecord.title}\" to the server and updated the archive.`
                            });
                            setAnimeSourceMessage("Archive refreshed with your new submission.");
                            setNewAnimeForm({
                                title: "",
                                year: "",
                                studio: "",
                                genre: "",
                                episodes: "",
                                synopsis: "",
                                img_name: ""
                            });
                            setNewAnimeImageLabel("");
                            setNewAnimeImagePreviewUrl((previous) => {
                                if (previous) {
                                    URL.revokeObjectURL(previous);
                                }
                                return "";
                            });
                            return;
                        } catch (error) {
                            lastError = error;
                        }
                    }
                }

                throw lastError || new Error("Could not locate a working create endpoint on the backend.");
            } catch (error) {
                setCreateAnimeStatus({
                    type: "error",
                    message: error.message || "Unable to add the anime right now."
                });
            } finally {
                setIsSubmittingAnime(false);
            }
        },
        [animeApiBaseUrls, newAnimeForm]
    );

    const allSeries = useMemo(
        () =>
            animeDataset.map((series) => ({
                id: buildSeriesId(series.title || series.name || "unknown-series"),
                title: series.title || series.name || "Untitled Anime",
                image:
                    animeSource === "api"
                        ? normalizeRemoteImage(series.img_name || series.image, animeApiBaseUrl)
                        : `${process.env.PUBLIC_URL}/${series.img_name || series.image || ""}`,
                year: Number(series.year) || new Date().getFullYear(),
                era: series.era || getEraLabel(Number(series.year) || new Date().getFullYear()),
                studio: series.studio || "Unknown Studio",
                genre: series.genre || "Unknown",
                genres: String(series.genre || "Unknown").split(",").map((item) => item.trim()),
                episodes: Number(series.episodes) || 0,
                synopsis: series.synopsis || "No synopsis available yet."
            })),
        [animeApiBaseUrl, animeDataset, animeSource]
    );

    const selectedTimelineIndex = useMemo(() => {
        if (selectedTimelineEra === "all") {
            return -1;
        }

        return timelineEras.indexOf(selectedTimelineEra);
    }, [selectedTimelineEra]);

    const scoredSeries = useMemo(
        () =>
            allSeries.map((series) => {
                const score = getInfluenceScore(series);

                return {
                    ...series,
                    score,
                    timelinePlacement: getTimelinePlacement(series.year),
                    creator: getCreatorNote(series.title, series.studio),
                    culturalImpact: getCulturalImpact(series, score),
                    trailerUrl: getTrailerUrl(series.title),
                    episodeBand: getEpisodeFilter(series.episodes),
                    yearLabel: String(series.year)
                };
            }),
        [allSeries]
    );

    const rankedSeries = useMemo(() => {
        const sorted = [...scoredSeries].sort((left, right) => {
            if (right.score !== left.score) {
                return right.score - left.score;
            }

            if (right.year !== left.year) {
                return right.year - left.year;
            }

            if (right.episodes !== left.episodes) {
                return right.episodes - left.episodes;
            }

            return left.title.localeCompare(right.title);
        });

        const totalSeriesCount = sorted.length;

        return sorted.map((series, index) => {
            const rank = index + 1;
            const displayScore = Number((series.score + (totalSeriesCount - rank) / 100).toFixed(2));

            return {
                ...series,
                rank,
                displayScore,
                badge: getInfluenceBadge(series, rank, totalSeriesCount)
            };
        });
    }, [scoredSeries]);

    const enhancedSeries = rankedSeries;

    const genreOptions = useMemo(() => {
        const options = new Set();
        enhancedSeries.forEach((series) => {
            series.genres.forEach((genre) => options.add(genre));
        });
        return Array.from(options).sort((left, right) => left.localeCompare(right));
    }, [enhancedSeries]);

    const studioOptions = useMemo(() => {
        const options = new Set(enhancedSeries.map((series) => series.studio));
        return Array.from(options).sort((left, right) => left.localeCompare(right));
    }, [enhancedSeries]);

    const yearOptions = useMemo(() => {
        const options = new Set(enhancedSeries.map((series) => series.year));
        return Array.from(options).sort((left, right) => right - left);
    }, [enhancedSeries]);

    const trimmedSearchTerm = searchTerm.toLowerCase().trim();

    const suggestions = useMemo(() => {
        if (trimmedSearchTerm.length < 1) {
            return [];
        }

        return enhancedSeries
            .filter((anime) => anime.title.toLowerCase().includes(trimmedSearchTerm))
            .slice(0, 6)
            .map((anime) => ({ name: anime.title, id: anime.id, series: anime }));
    }, [enhancedSeries, trimmedSearchTerm]);

    const showSuggestions = isSearchFocused && suggestions.length > 0;

    const filteredSeries = useMemo(() => {
        const list = enhancedSeries.filter((anime) => {
            const searchableText = [
                anime.title,
                anime.studio,
                anime.genre,
                anime.synopsis,
                anime.badge.label,
                anime.timelinePlacement
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                trimmedSearchTerm.length === 0 || searchableText.includes(trimmedSearchTerm);
            const matchesGenre =
                selectedGenre === "all" || anime.genres.includes(selectedGenre);
            const matchesStudio = selectedStudio === "all" || anime.studio === selectedStudio;
            const matchesYear = selectedYear === "all" || anime.year === Number(selectedYear);
            const matchesTimelineEra =
                selectedTimelineEra === "all" || getEraLabel(anime.year) === selectedTimelineEra;
            const matchesEpisodeBand =
                selectedEpisodeBand === "all" || anime.episodeBand === selectedEpisodeBand;

            return (
                matchesSearch &&
                matchesGenre &&
                matchesStudio &&
                matchesYear &&
                matchesTimelineEra &&
                matchesEpisodeBand
            );
        });

        return [...list].sort((left, right) => {
            if (sortBy === "newest") {
                return right.year - left.year || right.score - left.score;
            }

            if (sortBy === "episodes") {
                return right.episodes - left.episodes || right.score - left.score;
            }

            return right.score - left.score || right.year - left.year;
        });
    }, [enhancedSeries, selectedEpisodeBand, selectedGenre, selectedStudio, selectedTimelineEra, selectedYear, sortBy, trimmedSearchTerm]);

    const visibleCount = filteredSeries.length;
    const filtersActive =
        trimmedSearchTerm.length > 0 ||
        selectedGenre !== "all" ||
        selectedStudio !== "all" ||
        selectedYear !== "all" ||
        selectedTimelineEra !== "all" ||
        selectedEpisodeBand !== "all" ||
        sortBy !== "influential";

    const clearTimelineTimers = useCallback(() => {
        timelineTransitionTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
        timelineTransitionTimersRef.current = [];
    }, []);

    const commitTimelineEra = useCallback((era) => {
        setSelectedYear("all");
        setSelectedTimelineEra(era);
    }, []);

    const handleTimelineSelect = useCallback(
        (era) => {
            const nextEra = selectedTimelineEra === era ? "all" : era;

            clearTimelineTimers();
            setTimelinePhase("fading-out");
            setIsFilterDrawerOpen(false); // Close drawer on mobile when era selected

            timelineTransitionTimersRef.current.push(
                window.setTimeout(() => {
                    commitTimelineEra(nextEra);
                    setTimelinePhase("fading-in");
                }, 180)
            );

            timelineTransitionTimersRef.current.push(
                window.setTimeout(() => {
                    setTimelinePhase("idle");
                }, 430)
            );
        },
        [clearTimelineTimers, commitTimelineEra, selectedTimelineEra]
    );

    const moveTimelineEra = useCallback(
        (direction) => {
            const nextIndex =
                selectedTimelineIndex === -1
                    ? direction > 0
                        ? 0
                        : timelineEras.length - 1
                    : Math.min(
                          timelineEras.length - 1,
                          Math.max(0, selectedTimelineIndex + direction)
                      );

            const nextEra = timelineEras[nextIndex];
            if (nextEra) {
                handleTimelineSelect(nextEra);
            }
        },
        [handleTimelineSelect, selectedTimelineIndex]
    );

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (!searchFormRef.current?.contains(event.target)) {
                setIsSearchFocused(false);
                setSelectedSuggestionIndex(-1);
            }
        };

        document.addEventListener("click", handleDocumentClick);
        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 520);
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (!selectedSeries) {
            return undefined;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setSelectedSeries(null);
            }
        };

        window.addEventListener("keydown", handleEscape);

        return () => {
            window.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = previousOverflow;
        };
    }, [selectedSeries]);

    useEffect(() => {
        const selectedButton =
            selectedTimelineEra === "all"
                ? null
                : timelineButtonRefs.current[selectedTimelineEra];

        if (!selectedButton) {
            return undefined;
        }

        selectedButton.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

        return undefined;
    }, [selectedTimelineEra]);

    useEffect(() => {
        const syncTimelineIndicator = () => {
            const selectedButton =
                selectedTimelineEra === "all"
                    ? null
                    : timelineButtonRefs.current[selectedTimelineEra];

            if (!selectedButton || !timelineRailRef.current) {
                return;
            }

            const left = selectedButton.offsetLeft + selectedButton.offsetWidth / 2;
            timelineRailRef.current.style.setProperty("--timeline-indicator-left", `${left}px`);
        };

        syncTimelineIndicator();
        window.addEventListener("resize", syncTimelineIndicator);

        return () => {
            window.removeEventListener("resize", syncTimelineIndicator);
        };
    }, [selectedTimelineEra, timelinePhase]);

    useEffect(() => {
        const handleTimelineKeyboard = (event) => {
            if (event.defaultPrevented) {
                return;
            }

            const target = event.target;
            const isTypingField =
                target instanceof HTMLElement &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.tagName === "SELECT" ||
                    target.isContentEditable);

            if (isTypingField) {
                return;
            }

            if (event.key === "ArrowLeft") {
                event.preventDefault();
                moveTimelineEra(-1);
            }

            if (event.key === "ArrowRight") {
                event.preventDefault();
                moveTimelineEra(1);
            }
        };

        window.addEventListener("keydown", handleTimelineKeyboard);

        return () => {
            window.removeEventListener("keydown", handleTimelineKeyboard);
        };
    }, [moveTimelineEra]);

    useEffect(() => () => clearTimelineTimers(), [clearTimelineTimers]);

    useEffect(() => {
        if (!location.hash) {
            return;
        }

        const targetId = decodeURIComponent(location.hash.slice(1));
        const targetCard = document.getElementById(targetId);

        if (!targetCard) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            targetCard.classList.add("highlight-anime");

            window.setTimeout(() => {
                targetCard.classList.remove("highlight-anime");
            }, 3000);
        }, 300);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [location.hash]);

    // Reset pagination when filters change
    useEffect(() => {
        setCardsToShow(CARDS_PER_PAGE);
    }, [selectedGenre, selectedStudio, selectedYear, selectedTimelineEra, selectedEpisodeBand, sortBy, trimmedSearchTerm]);

    const navigateToAnime = (anime) => {
        setIsSearchFocused(false);
        setSelectedSuggestionIndex(-1);
        setSearchTerm("");

        const selectedAnime = enhancedSeries.find((series) => series.id === anime.id) || anime;
        setSelectedSeries(selectedAnime);

        const targetCard = document.getElementById(anime.id);
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
            targetCard.classList.add("highlight-anime");

            window.setTimeout(() => {
                targetCard.classList.remove("highlight-anime");
            }, 3000);
        }
    };

    const openSeriesModal = (series) => {
        setSelectedSuggestionIndex(-1);
        setIsSearchFocused(false);
        setSelectedSeries(series);
    };

    const clearFilters = () => {
        clearTimelineTimers();
        setSearchTerm("");
        setSelectedGenre("all");
        setSelectedStudio("all");
        setSelectedYear("all");
        setTimelinePhase("idle");
        setSelectedTimelineEra("all");
        setSelectedEpisodeBand("all");
        setSortBy("influential");
        setSelectedSuggestionIndex(-1);
        setIsFilterDrawerOpen(false);
    };

    const handleLoadMore = () => {
        setCardsToShow((prev) => prev + CARDS_PER_PAGE);
    };

    const visibleSeries = filteredSeries.slice(0, cardsToShow);
    const hasMoreCards = cardsToShow < filteredSeries.length;

    const getContextLabel = () => {
        const activeLabelParts = [];
        
        if (selectedTimelineEra !== "all") {
            activeLabelParts.push(selectedTimelineEra);
        }
        if (selectedGenre !== "all") {
            activeLabelParts.push(selectedGenre);
        }
        if (selectedStudio !== "all") {
            activeLabelParts.push(selectedStudio);
        }
        if (selectedEpisodeBand !== "all") {
            activeLabelParts.push(selectedEpisodeBand);
        }

        if (activeLabelParts.length === 0) {
            return "All Influential Series";
        }

        return `Filtered: ${activeLabelParts.join(" + ")}`;
    };

    const handleKeyNavigation = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
        }

        if (!showSuggestions) {
            if (event.key === "Escape") {
                setIsSearchFocused(false);
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setSelectedSuggestionIndex((prev) => Math.max(prev - 1, -1));
        } else if (event.key === "Enter") {
            event.preventDefault();
            if (selectedSuggestionIndex >= 0) {
                const selectedAnime = suggestions[selectedSuggestionIndex];
                if (selectedAnime) {
                    navigateToAnime(selectedAnime);
                }
            }
        } else if (event.key === "Escape") {
            setIsSearchFocused(false);
            setSelectedSuggestionIndex(-1);
        }
    };

    return (
        <main className="all-series-page">
            <Link className="close-button" to="/influential-series" aria-label="Back to Influential Series">
                X
            </Link>

            {showBackToTop && (
                <button
                    type="button"
                    className="all-series-back-to-top"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    aria-label="Back to top"
                >
                    ↑ Top
                </button>
            )}

            <section className="all-series-hero">
                <div className="all-series-search-wrap">
                    <form
                        className="series-search all-series-search"
                        aria-label="Search anime"
                        onSubmit={(event) => {
                            event.preventDefault();
                        }}
                        ref={searchFormRef}
                    >
                        <input
                            type="search"
                            name="search"
                            placeholder="search anime"
                            autoComplete="off"
                            value={searchTerm}
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                                setSelectedSuggestionIndex(-1);
                            }}
                            onFocus={() => setIsSearchFocused(true)}
                            onKeyDown={handleKeyNavigation}
                        />
                        <button type="submit" aria-label="Search">
                            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <circle cx="11" cy="11" r="7"></circle>
                                <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
                            </svg>
                        </button>

                        {showSuggestions && (
                            <div className="search-suggestions">
                                {suggestions.map((anime, index) => (
                                    <div
                                        className={`suggestion-item ${
                                            selectedSuggestionIndex === index
                                                ? "selected"
                                                : ""
                                        }`.trim()}
                                        key={anime.id}
                                        onClick={() => navigateToAnime(anime.series)}
                                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter" || event.key === " ") {
                                                event.preventDefault();
                                                navigateToAnime(anime.series);
                                            }
                                        }}
                                    >
                                        {anime.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>
                </div>
                <div className="all-series-hero-inner">
                    <h1>All Influential Series</h1>
                    <p>{getHeroSummary(visibleCount, enhancedSeries.length, filtersActive)}</p>
                </div>
            </section>

            <section className="all-series-create-panel" aria-labelledby="add-series-heading">
                <div className="all-series-create-panel__intro">
                    <h2 id="add-series-heading">Add New Influential Series</h2>
                    <p>
                        Share a title with the archive. Client validation mirrors backend Joi-style rules,
                        then successful submissions are posted to the server and immediately shown in this list.
                    </p>
                </div>

                <form className="all-series-create-form" onSubmit={handleCreateAnimeSubmit}>
                    <label htmlFor="create-anime-title">
                        <span>Title</span>
                        <input
                            id="create-anime-title"
                            name="title"
                            type="text"
                            value={newAnimeForm.title}
                            onChange={handleNewAnimeFieldChange}
                            placeholder="e.g. Mob Psycho 100"
                            required
                            minLength="1"
                            aria-invalid={Boolean(newAnimeErrors.title)}
                        />
                        {newAnimeErrors.title && <small>{newAnimeErrors.title}</small>}
                    </label>

                    <label htmlFor="create-anime-year">
                        <span>Year</span>
                        <input
                            id="create-anime-year"
                            name="year"
                            type="number"
                            required
                            min="1900"
                            max="2100"
                            step="1"
                            value={newAnimeForm.year}
                            onChange={handleNewAnimeFieldChange}
                            placeholder="2021"
                            aria-invalid={Boolean(newAnimeErrors.year)}
                        />
                        {newAnimeErrors.year && <small>{newAnimeErrors.year}</small>}
                    </label>

                    <label htmlFor="create-anime-studio">
                        <span>Studio</span>
                        <input
                            id="create-anime-studio"
                            name="studio"
                            type="text"
                            value={newAnimeForm.studio}
                            onChange={handleNewAnimeFieldChange}
                            placeholder="Bones"
                            required
                            minLength="1"
                            aria-invalid={Boolean(newAnimeErrors.studio)}
                        />
                        {newAnimeErrors.studio && <small>{newAnimeErrors.studio}</small>}
                    </label>

                    <label htmlFor="create-anime-genre">
                        <span>Genre</span>
                        <input
                            id="create-anime-genre"
                            name="genre"
                            type="text"
                            value={newAnimeForm.genre}
                            onChange={handleNewAnimeFieldChange}
                            placeholder="Action, Supernatural"
                            required
                            minLength="1"
                            aria-invalid={Boolean(newAnimeErrors.genre)}
                        />
                        {newAnimeErrors.genre && <small>{newAnimeErrors.genre}</small>}
                    </label>

                    <label htmlFor="create-anime-episodes">
                        <span>Episodes</span>
                        <input
                            id="create-anime-episodes"
                            name="episodes"
                            type="number"
                            required
                            min="1"
                            step="1"
                            value={newAnimeForm.episodes}
                            onChange={handleNewAnimeFieldChange}
                            placeholder="24"
                            aria-invalid={Boolean(newAnimeErrors.episodes)}
                        />
                        {newAnimeErrors.episodes && <small>{newAnimeErrors.episodes}</small>}
                    </label>

                    <div className="all-series-create-form__image-section is-wide">
                        <div className="all-series-create-form__image-preview">
                            <div className="preview-container">
                                {newAnimeImagePreviewUrl ? (
                                    <img
                                        key={newAnimeImagePreviewUrl}
                                        src={newAnimeImagePreviewUrl}
                                        alt="Poster preview"
                                    />
                                ) : null}
                                <div
                                    className="preview-placeholder"
                                    style={newAnimeImagePreviewUrl ? { display: "none" } : {}}
                                >
                                    <span>Poster Preview</span>
                                </div>
                            </div>
                        </div>

                        <label className="all-series-create-form__image-input" htmlFor="create-anime-img-name">
                            <span>Choose Poster Image</span>
                            <input
                                id="create-anime-img-name"
                                name="poster_file"
                                type="file"
                                accept="image/*"
                                onChange={handleNewAnimeImageChange}
                                required
                                aria-invalid={Boolean(newAnimeErrors.img_name)}
                            />
                            <p className="all-series-create-form__image-name">
                                {newAnimeImageLabel || "No file selected"}
                            </p>
                            {newAnimeErrors.img_name && <small>{newAnimeErrors.img_name}</small>}
                        </label>
                    </div>

                    <label className="is-wide" htmlFor="create-anime-synopsis">
                        <span>Synopsis</span>
                        <textarea
                            id="create-anime-synopsis"
                            name="synopsis"
                            rows="4"
                            value={newAnimeForm.synopsis}
                            onChange={handleNewAnimeFieldChange}
                            placeholder="A quick synopsis of the series and why it stands out."
                            required
                            minLength="1"
                            aria-invalid={Boolean(newAnimeErrors.synopsis)}
                        ></textarea>
                        {newAnimeErrors.synopsis && <small>{newAnimeErrors.synopsis}</small>}
                    </label>

                    <div className="all-series-create-form__actions is-wide">
                        <button type="submit" disabled={isSubmittingAnime}>
                            {isSubmittingAnime ? "Saving..." : "Add Series to Archive"}
                        </button>
                        <p>Server target: {animeApiBaseUrl}</p>
                    </div>

                    {createAnimeStatus.type !== "idle" && (
                        <div
                            className={`all-series-create-form__status is-${createAnimeStatus.type}`}
                            role="status"
                            aria-live="polite"
                        >
                            {createAnimeStatus.message}
                        </div>
                    )}
                </form>
            </section>

            <section className="all-series-controls" aria-label="Filter and sort influential series">
                <div className="all-series-controls__header">
                    <div>
                        <h2>Filter the archive</h2>
                        <p>
                            Narrow the catalog by genre, studio, year, episode count, or sort by influence.
                        </p>
                    </div>
                    <div className="all-series-controls__actions">
                        <button type="button" className="all-series-filter-toggle" onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)} aria-label="Toggle filters and sort options">
                            ⚙ Filter
                        </button>
                        <button type="button" className="all-series-clear-filters" onClick={clearFilters}>
                            Reset
                        </button>
                    </div>
                </div>

                <div className={`all-series-filters-wrapper ${isFilterDrawerOpen ? 'is-open' : ''}`}>
                    <div className="all-series-timeline" aria-label="Timeline decade filter">
                        <div className="all-series-timeline__header">
                            <h3>Timeline</h3>
                            <p>Choose a decade to show only series released in that time window.</p>
                        </div>

                    <div
                        className={`all-series-timeline__rail ${
                            selectedTimelineEra !== "all" ? "has-selection" : ""
                        }`.trim()}
                        role="group"
                        aria-label="Select decade"
                        ref={timelineRailRef}
                    >
                        {selectedTimelineEra !== "all" && (
                            <span
                                className={`all-series-timeline__indicator ${
                                    timelinePhase === "fading-out" ? "is-fading" : ""
                                }`.trim()}
                                aria-hidden="true"
                            />
                        )}
                        {timelineEras.map((era, index) => {
                            const isSelected = selectedTimelineEra === era;
                            const timelineMeta = eraTimelineMeta[era];

                            return (
                                <Fragment key={era}>
                                    <button
                                        type="button"
                                        className={`all-series-timeline__button ${
                                            isSelected ? "is-selected" : ""
                                        }`.trim()}
                                        onClick={() => handleTimelineSelect(era)}
                                        aria-pressed={isSelected}
                                        aria-label={`Filter by ${era}`}
                                        ref={(element) => {
                                            if (element) {
                                                timelineButtonRefs.current[era] = element;
                                            }
                                        }}
                                    >
                                        <span className="all-series-timeline__icon" aria-hidden="true">
                                            {timelineMeta.icon}
                                        </span>
                                        <span className="all-series-timeline__label">{era}</span>
                                        <span className="all-series-timeline__range">{getEraRangeLabel(era)}</span>
                                        <span className="all-series-timeline__hint">{timelineMeta.hint}</span>
                                        {isSelected && (
                                            <span className="all-series-timeline__pointer" aria-hidden="true">↑</span>
                                        )}
                                    </button>

                                    {index < timelineEras.length - 1 && (
                                        <span className="all-series-timeline__connector" aria-hidden="true" />
                                    )}
                                </Fragment>
                            );
                        })}
                    </div>
                </div>

                <div className="all-series-filter-grid">
                    <label>
                        <span>Genre</span>
                        <select value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
                            <option value="all">All genres</option>
                            {genreOptions.map((genre) => (
                                <option key={genre} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Studio</span>
                        <select value={selectedStudio} onChange={(event) => setSelectedStudio(event.target.value)}>
                            <option value="all">All studios</option>
                            {studioOptions.map((studio) => (
                                <option key={studio} value={studio}>
                                    {studio}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Year</span>
                        <select
                            value={selectedYear}
                            onChange={(event) => {
                                setSelectedYear(event.target.value);
                                setSelectedTimelineEra("all");
                            }}
                        >
                            <option value="all">All years</option>
                            {yearOptions.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        <span>Episode count</span>
                        <select
                            value={selectedEpisodeBand}
                            onChange={(event) => setSelectedEpisodeBand(event.target.value)}
                        >
                            <option value="all">All lengths</option>
                            <option value="1-12 episodes">1-12 episodes</option>
                            <option value="13-24 episodes">13-24 episodes</option>
                            <option value="25-74 episodes">25-74 episodes</option>
                            <option value="75-149 episodes">75-149 episodes</option>
                            <option value="150+ episodes">150+ episodes</option>
                        </select>
                    </label>

                    <label>
                        <span>Sort by</span>
                        <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                            <option value="influential">Most influential</option>
                            <option value="newest">Newest to oldest</option>
                            <option value="episodes">Most episodes</option>
                        </select>
                    </label>
                </div>

                <div className="all-series-controls__summary">
                    <span>
                        Showing {visibleCount} of {enhancedSeries.length}
                    </span>
                    {selectedTimelineEra !== "all" && (
                        <span>
                            Timeline: {selectedTimelineEra} ({getEraRangeLabel(selectedTimelineEra)})
                        </span>
                    )}
                    {filtersActive && <span>Active filters and search are shaping this view.</span>}
                    {animeSource === "api" && !isAnimeLoading && (
                        <span>Data source: Backend API ({enhancedSeries.length} titles)</span>
                    )}
                    {animeSourceMessage && <span>{animeSourceMessage}</span>}
                </div>
                </div>
            </section>

            <section className="all-series-shell">
                <div className="all-series-sticky-header">
                    <p className="all-series-context-label">{getContextLabel()}</p>
                    <div className="all-series-quick-jump" aria-label="Jump to era">
                        {timelineEras.map((era) => (
                            <button
                                key={`jump-${era}`}
                                type="button"
                                className={`all-series-quick-jump__button ${selectedTimelineEra === era ? 'is-active' : ''}`}
                                onClick={() => handleTimelineSelect(era)}
                                aria-label={`Jump to ${era}`}
                            >
                                {era.replace("s", "").slice(0, 3)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="all-series-progress-indicator" style={{ width: `${(cardsToShow / Math.max(visibleCount, 1)) * 100}%` }} />

                <div
                    className={`all-series-grid ${
                        timelinePhase === "fading-out"
                            ? "is-fading-out"
                            : timelinePhase === "fading-in"
                                ? "is-fading-in"
                                : ""
                    }`.trim()}
                    aria-live="polite"
                >
                    {visibleSeries.map((series) => (
                        <button
                            key={series.id}
                            id={series.id}
                            type="button"
                            className="all-series-card all-series-card--interactive"
                            onClick={() => openSeriesModal(series)}
                            aria-label={`Open details for ${series.title}`}
                        >
                            <div className="all-series-card__media">
                                <img src={series.image} alt={series.title} loading="lazy" decoding="async" />
                                <div className="all-series-card__media-overlay">
                                    <span className={`all-series-badge all-series-badge--${series.badge.tone}`}>
                                        <span className="all-series-badge__icon">{series.badge.icon}</span>
                                        <span className="all-series-badge__text">{series.badge.label}</span>
                                    </span>
                                        <span className="all-series-score">Influence {series.displayScore}</span>
                                </div>
                            </div>

                            <div className="all-series-body">
                                <h2>{series.title}</h2>
                                <p className="all-series-subline">
                                    {series.year} · {series.studio}
                                </p>
                                <div className="all-series-tags" aria-label={`${series.title} genres`}>
                                    {series.genres.map((genre, index) => (
                                        <span
                                            key={`${series.id}-${genre}`}
                                            className="all-series-genre-tag"
                                            style={{
                                                "--genre-hue": getGenreTone(genre) + index * 7
                                            }}
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                                <p className="all-series-synopsis">{series.synopsis}</p>
                                <div className="all-series-details-row">
                                    <span>{series.timelinePlacement}</span>
                                    <span>{series.episodes} episodes</span>
                                </div>
                            </div>

                            <div className="all-series-card__hover-panel" aria-hidden="true">
                                <span>
                                    <span className="all-series-badge__icon">{series.badge.icon}</span>
                                    <span className="all-series-badge__text">{series.badge.label}</span>
                                </span>
                                <p>{series.culturalImpact}</p>
                                <strong>Tap for trailer, timeline, and creator notes.</strong>
                            </div>
                        </button>
                    ))}

                    {trimmedSearchTerm.length > 0 && visibleCount === 0 && (
                        <div className="all-series-no-results" style={{ display: "block" }}>
                            <p>
                                No anime found matching "<strong>{trimmedSearchTerm}</strong>"
                            </p>
                            <p className="coming-soon">
                                New anime series adding soon! Check back later 🎬
                            </p>
                        </div>
                    )}
                </div>

                {hasMoreCards && visibleCount > 0 && (
                    <div className="all-series-load-more-wrapper">
                        <button
                            type="button"
                            className="all-series-load-more"
                            onClick={handleLoadMore}
                            aria-label="Load more anime series"
                        >
                            Load More
                        </button>
                        <p className="all-series-load-more-text">
                            Showing {cardsToShow} of {visibleCount}
                        </p>
                    </div>
                )}
            </section>

            {isFilterDrawerOpen && (
                <div
                    className="all-series-filter-drawer-backdrop"
                    onClick={() => setIsFilterDrawerOpen(false)}
                    role="presentation"
                    aria-hidden="true"
                />
            )}

            {selectedSeries && (
                <div
                    className="all-series-modal-backdrop"
                    role="presentation"
                    onClick={() => setSelectedSeries(null)}
                >
                    <section
                        className="all-series-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="all-series-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className="all-series-modal__close"
                            onClick={() => setSelectedSeries(null)}
                            aria-label="Close details"
                        >
                            ×
                        </button>

                        <div className="all-series-modal__media">
                            <img src={selectedSeries.image} alt={selectedSeries.title} loading="lazy" decoding="async" />
                            <div className={`all-series-badge all-series-badge--${selectedSeries.badge.tone}`}>
                                <span className="all-series-badge__icon">{selectedSeries.badge.icon}</span>
                                <span className="all-series-badge__text">{selectedSeries.badge.label}</span>
                            </div>
                        </div>

                        <div className="all-series-modal__content">
                            <p className="all-series-modal__eyebrow">{selectedSeries.timelinePlacement}</p>
                            <h2 id="all-series-modal-title">{selectedSeries.title}</h2>
                            <p className="all-series-modal__meta">
                                {selectedSeries.studio} · {selectedSeries.yearLabel} · {selectedSeries.episodes} episodes
                            </p>

                            <div className="all-series-tags all-series-tags--modal">
                                {selectedSeries.genres.map((genre, index) => (
                                    <span
                                        key={`modal-${selectedSeries.id}-${genre}`}
                                        className="all-series-genre-tag"
                                        style={{
                                            "--genre-hue": getGenreTone(genre) + index * 7
                                        }}
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </div>

                            <p className="all-series-modal__synopsis">{selectedSeries.synopsis}</p>

                            <div className="all-series-modal__grid">
                                <article>
                                    <span>Trailer</span>
                                    <a href={selectedSeries.trailerUrl} target="_blank" rel="noreferrer">
                                        Search trailer
                                    </a>
                                </article>
                                <article>
                                    <span>Timeline placement</span>
                                    <p>{selectedSeries.timelinePlacement}</p>
                                </article>
                                <article>
                                    <span>Cultural impact</span>
                                    <p>{selectedSeries.culturalImpact}</p>
                                </article>
                                <article>
                                    <span>Notable creators</span>
                                    <p>{selectedSeries.creator}</p>
                                </article>
                            </div>

                            <div className="all-series-modal__footer">
                                <p>Influence score: {selectedSeries.displayScore}</p>
                                <p>Episode band: {selectedSeries.episodeBand}</p>
                                <p>Context: {selectedSeries.badge.detail}</p>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </main>
    );
};

export default AllInfluentialSeries;
