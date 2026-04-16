const ERA_OPTIONS = ["1980s", "1990s", "2000s", "2010s", "2020s"];

const GENRE_KEYWORDS = [
    "action",
    "adventure",
    "dark fantasy",
    "fantasy",
    "shonen",
    "comedy",
    "supernatural",
    "mecha",
    "psychological",
    "thriller",
    "sci-fi",
    "drama",
    "mystery",
    "romance",
    "slice of life",
    "horror",
    "historical",
    "cyberpunk",
    "magical girl"
];

const MOOD_KEYWORDS = {
    uplifting: ["comedy", "adventure", "shonen", "sports", "slice of life", "fantasy"],
    intense: ["dark fantasy", "horror", "thriller", "crime", "cyberpunk", "mecha"],
    thoughtful: ["psychological", "drama", "mystery", "historical", "sci-fi", "romance"]
};

const INFLUENTIAL_TITLES = new Set([
    "Akira",
    "Cowboy Bebop",
    "Neon Genesis Evangelion",
    "Dragon Ball Z",
    "Dragon Ball",
    "Naruto",
    "Sailor Moon",
    "One Piece",
    "Death Note",
    "Attack on Titan",
    "Princess Mononoke",
    "Spirited Away",
    "Fullmetal Alchemist",
    "Hunter x Hunter",
    "Bleach",
    "Code Geass"
]);

const POPULAR_FALLBACK_TITLES = [
    "Spirited Away",
    "Attack on Titan",
    "Cowboy Bebop",
    "Fullmetal Alchemist",
    "One Piece",
    "Studio Ghibli",
    "Hayao Miyazaki",
    "1990s"
];

const slugify = (value) =>
    String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

const normalize = (value) =>
    String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

const splitGenres = (genre) =>
    String(genre || "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);

const detectMood = (genres) => {
    const normalized = genres.map((genre) => genre.toLowerCase());

    const has = (bucket) =>
        bucket.some((keyword) => normalized.some((genre) => genre.includes(keyword)));

    if (has(MOOD_KEYWORDS.intense)) {
        return "Intense";
    }

    if (has(MOOD_KEYWORDS.thoughtful)) {
        return "Thoughtful";
    }

    return "Uplifting";
};

const isBeginnerFriendly = (series) => {
    const genres = splitGenres(series.genre).map((genre) => genre.toLowerCase());
    const hasHardEntryGenre = genres.some(
        (genre) =>
            genre.includes("horror") ||
            genre.includes("psychological") ||
            genre.includes("thriller") ||
            genre.includes("dark fantasy")
    );

    if (hasHardEntryGenre) {
        return false;
    }

    return Number(series.episodes || 0) <= 64;
};

const extractEraFromMeta = (value) => {
    const found = String(value || "").match(/Era:\s*([^;]+)/i);
    return found ? found[1].trim() : "Unknown";
};

const levenshtein = (source, target) => {
    if (source === target) {
        return 0;
    }

    if (!source.length) {
        return target.length;
    }

    if (!target.length) {
        return source.length;
    }

    const matrix = Array.from({ length: source.length + 1 }, () =>
        Array(target.length + 1).fill(0)
    );

    for (let i = 0; i <= source.length; i += 1) {
        matrix[i][0] = i;
    }

    for (let j = 0; j <= target.length; j += 1) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= source.length; i += 1) {
        for (let j = 1; j <= target.length; j += 1) {
            const cost = source[i - 1] === target[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[source.length][target.length];
};

const fuzzySimilarity = (query, text) => {
    const normalizedQuery = normalize(query);
    const normalizedText = normalize(text);

    if (!normalizedQuery || !normalizedText) {
        return 0;
    }

    if (normalizedText.includes(normalizedQuery)) {
        return 1;
    }

    const distance = levenshtein(normalizedQuery, normalizedText);
    const maxLength = Math.max(normalizedQuery.length, normalizedText.length);
    return Math.max(0, 1 - distance / maxLength);
};

const parseNaturalLanguageQuery = (query) => {
    const normalized = normalize(query);

    const eraMatch =
        normalized.match(/(1980s|1990s|2000s|2010s|2020s)/) ||
        (normalized.includes("80s") ? ["1980s"] : null) ||
        (normalized.includes("90s") ? ["1990s"] : null) ||
        (normalized.includes("2000") ? ["2000s"] : null) ||
        (normalized.includes("2010") ? ["2010s"] : null) ||
        (normalized.includes("2020") ? ["2020s"] : null);

    const discoveredGenres = GENRE_KEYWORDS.filter((keyword) => normalized.includes(keyword));

    let discoveredMood = "";
    if (normalized.includes("dark") || normalized.includes("intense") || normalized.includes("serious")) {
        discoveredMood = "Intense";
    } else if (
        normalized.includes("feel good") ||
        normalized.includes("uplifting") ||
        normalized.includes("fun") ||
        normalized.includes("light")
    ) {
        discoveredMood = "Uplifting";
    } else if (
        normalized.includes("psychological") ||
        normalized.includes("thoughtful") ||
        normalized.includes("mind")
    ) {
        discoveredMood = "Thoughtful";
    }

    return {
        era: eraMatch ? eraMatch[0] : "",
        genres: discoveredGenres,
        mood: discoveredMood,
        influentialOnly:
            normalized.includes("influential") ||
            normalized.includes("classic") ||
            normalized.includes("high influence"),
        beginnerFriendly:
            normalized.includes("beginner") ||
            normalized.includes("starter") ||
            normalized.includes("new to anime")
    };
};

const baseItemForMatching = (item) =>
    [
        item.title,
        item.subtitle,
        item.type,
        item.era,
        item.mood,
        ...(item.genres || []),
        ...(item.related || [])
    ]
        .join(" ")
        .toLowerCase();

const computeMatchScore = (query, item, parsedQuery) => {
    const normalizedQuery = normalize(query);
    const normalizedTitle = normalize(item.title);
    const searchable = baseItemForMatching(item);

    let score = 0;

    if (!normalizedQuery) {
        score += item.influential ? 28 : 12;
        score += item.type === "series" ? 8 : 5;
        score += item.beginnerFriendly ? 6 : 0;
        return score;
    }

    if (normalizedTitle.startsWith(normalizedQuery)) {
        score += 100;
    } else if (normalizedTitle.includes(normalizedQuery)) {
        score += 70;
    } else if (searchable.includes(normalizedQuery)) {
        score += 40;
    }

    const tokenScore = normalize(query)
        .split(" ")
        .filter(Boolean)
        .reduce((total, token) => (searchable.includes(token) ? total + 7 : total), 0);
    score += tokenScore;

    const fuzzyScore = fuzzySimilarity(normalizedQuery, normalizedTitle);
    score += fuzzyScore * 48;

    if (item.influential) {
        score += 12;
    }

    if (parsedQuery.era && item.era === parsedQuery.era) {
        score += 18;
    }

    if (parsedQuery.mood && item.mood === parsedQuery.mood) {
        score += 15;
    }

    if (parsedQuery.genres.length > 0) {
        const lowerGenres = (item.genres || []).map((genre) => genre.toLowerCase());
        const genreHits = parsedQuery.genres.filter((genre) =>
            lowerGenres.some((entry) => entry.includes(genre))
        ).length;
        score += genreHits * 10;
    }

    if (parsedQuery.beginnerFriendly && item.beginnerFriendly) {
        score += 15;
    }

    return score;
};

const buildPeopleAlsoExplore = (results, allItems) => {
    const pivot = results.find((item) => item.type === "series") || results[0];
    if (!pivot) {
        return [];
    }

    const candidates = allItems.filter((item) => item.id !== pivot.id);

    return candidates
        .map((item) => {
            let score = 0;
            if (pivot.era && item.era === pivot.era) {
                score += 20;
            }
            if (pivot.studio && item.studio && item.studio === pivot.studio) {
                score += 26;
            }

            const pivotGenres = new Set((pivot.genres || []).map((genre) => genre.toLowerCase()));
            const overlap = (item.genres || []).filter((genre) => pivotGenres.has(genre.toLowerCase())).length;
            score += overlap * 10;

            if (item.influential) {
                score += 4;
            }

            return { ...item, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
};

const buildCorrectionSuggestion = (query, items) => {
    if (!query.trim()) {
        return "";
    }

    const lowerQuery = normalize(query);
    const best = items
        .map((item) => ({
            label: item.title,
            similarity: fuzzySimilarity(lowerQuery, item.title)
        }))
        .sort((a, b) => b.similarity - a.similarity)[0];

    if (!best || best.similarity < 0.58) {
        return "";
    }

    return best.label;
};

const withBalancedMix = (entries) => {
    const byEra = new Map();
    entries.forEach((entry) => {
        const key = entry.era || "Unknown";
        if (!byEra.has(key)) {
            byEra.set(key, []);
        }
        byEra.get(key).push(entry);
    });

    const output = [];
    let keepGoing = true;
    while (keepGoing && output.length < entries.length) {
        keepGoing = false;
        for (const era of ERA_OPTIONS) {
            const stack = byEra.get(era) || [];
            if (stack.length > 0) {
                output.push(stack.shift());
                keepGoing = true;
            }
        }

        const leftovers = byEra.get("Unknown") || [];
        if (leftovers.length > 0) {
            output.push(leftovers.shift());
            keepGoing = true;
        }
    }

    return output;
};

export const buildSearchDataset = ({ animeSeries, studiosCreators, eraPanels }) => {
    const seriesItems = (animeSeries || []).map((series) => {
        const genres = splitGenres(series.genre);
        return {
            id: `series-${series._id || slugify(series.title)}`,
            type: "series",
            title: series.title,
            subtitle: `${series.year} · ${series.studio}`,
            era: series.era || "Unknown",
            genres,
            mood: detectMood(genres),
            influential: INFLUENTIAL_TITLES.has(series.title),
            beginnerFriendly: isBeginnerFriendly(series),
            route: `/all-influential-series#series-${slugify(series.title)}`,
            description: series.synopsis,
            image: series.img_name ? `${process.env.PUBLIC_URL}/${series.img_name}` : "",
            studio: series.studio,
            related: [series.studio]
        };
    });

    const studioItems = (studiosCreators?.studios || []).map((studio) => ({
        id: `studio-${slugify(studio.name)}`,
        type: "studio",
        title: studio.name,
        subtitle: studio.meta || "Studio profile",
        era: extractEraFromMeta(studio.meta),
        genres: [],
        mood: "Thoughtful",
        influential: /ghibli|toei|bones|mappa|sunrise|wit/i.test(studio.name),
        beginnerFriendly: true,
        route: "/studios-creators",
        description: studio.detail,
        image: studio.image ? `${process.env.PUBLIC_URL}/${String(studio.image).replace(/^\/+/, "")}` : "",
        related: studio.related || []
    }));

    const creatorItems = (studiosCreators?.creators || []).map((creator) => ({
        id: `creator-${slugify(creator.name)}`,
        type: "creator",
        title: creator.name,
        subtitle: creator.role || "Creator profile",
        era: "Unknown",
        genres: [],
        mood: "Thoughtful",
        influential: /miyazaki|anno|oda|togashi/i.test(creator.name),
        beginnerFriendly: true,
        route: "/studios-creators",
        description: creator.detail,
        image: creator.image ? `${process.env.PUBLIC_URL}/${String(creator.image).replace(/^\/+/, "")}` : "",
        related: creator.related || []
    }));

    const eraItems = (eraPanels || []).map((era) => ({
        id: `era-${slugify(era.id)}`,
        type: "era",
        title: era.id,
        subtitle: era.years || "Era timeline",
        era: era.id,
        genres: [],
        mood: "Thoughtful",
        influential: true,
        beginnerFriendly: true,
        route: `/${era.id}`,
        description: era.blurb,
        image: era.image ? `${process.env.PUBLIC_URL}/${String(era.image).replace(/^\/+/, "")}` : "",
        related: era.related || []
    }));

    const allItems = [...seriesItems, ...studioItems, ...creatorItems, ...eraItems];

    const popular = POPULAR_FALLBACK_TITLES.map((label) =>
        allItems.find((item) => item.title.toLowerCase() === label.toLowerCase())
    ).filter(Boolean);

    return {
        allItems,
        popular,
        filters: {
            eras: ["All", ...ERA_OPTIONS],
            genres: [
                "All",
                "Action",
                "Adventure",
                "Fantasy",
                "Shonen",
                "Comedy",
                "Psychological",
                "Mecha",
                "Sci-Fi",
                "Dark Fantasy",
                "Slice of Life"
            ],
            moods: ["All", "Uplifting", "Intense", "Thoughtful"]
        }
    };
};

const applyFilterMatch = (item, filters, parsedQuery) => {
    const effectiveEra = filters.era !== "All" ? filters.era : parsedQuery.era || "";
    const effectiveMood = filters.mood !== "All" ? filters.mood : parsedQuery.mood || "";
    const effectiveGenre = filters.genre !== "All" ? filters.genre.toLowerCase() : "";

    if (effectiveEra && item.era !== effectiveEra) {
        return false;
    }

    if (effectiveMood && item.mood !== effectiveMood) {
        return false;
    }

    if (effectiveGenre) {
        const hasGenre = (item.genres || []).some((genre) =>
            genre.toLowerCase().includes(effectiveGenre)
        );
        if (!hasGenre) {
            return false;
        }
    }

    if ((filters.influentialOnly || parsedQuery.influentialOnly) && !item.influential) {
        return false;
    }

    if ((filters.beginnerFriendly || parsedQuery.beginnerFriendly) && !item.beginnerFriendly) {
        return false;
    }

    return true;
};

export const runUniversalSearch = ({ query, filters, dataset }) => {
    const parsedQuery = parseNaturalLanguageQuery(query);
    const normalizedQuery = normalize(query);

    const filtered = dataset.allItems.filter((item) => applyFilterMatch(item, filters, parsedQuery));

    const scored = filtered
        .map((item) => ({
            ...item,
            score: computeMatchScore(query, item, parsedQuery)
        }))
        .filter((item) => {
            if (!normalizedQuery) {
                return true;
            }
            return item.score >= 25;
        })
        .sort((a, b) => b.score - a.score);

    const balancedResults = withBalancedMix(scored).slice(0, 18);

    const suggestions = dataset.allItems
        .map((item) => ({
            item,
            score: computeMatchScore(query, item, parsedQuery)
        }))
        .filter(({ score, item }) => normalizedQuery && (score > 45 || fuzzySimilarity(query, item.title) > 0.66))
        .sort((a, b) => b.score - a.score)
        .slice(0, 7)
        .map(({ item }) => item);

    const closestMatches = dataset.allItems
        .map((item) => ({
            ...item,
            fuzzy: fuzzySimilarity(query, item.title)
        }))
        .filter((item) => item.fuzzy > 0.45)
        .sort((a, b) => b.fuzzy - a.fuzzy)
        .slice(0, 4);

    const correction = buildCorrectionSuggestion(query, dataset.allItems);

    const popularAlternatives = (dataset.popular.length > 0 ? dataset.popular : dataset.allItems)
        .filter((item) => applyFilterMatch(item, filters, parsedQuery))
        .slice(0, 4);

    const peopleAlsoExplore = buildPeopleAlsoExplore(balancedResults, dataset.allItems);

    return {
        parsedQuery,
        results: balancedResults,
        suggestions,
        closestMatches,
        correction,
        popularAlternatives,
        peopleAlsoExplore
    };
};
