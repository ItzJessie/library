import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const DEFAULT_VIEWPORTS = [
    { width: 320, height: 568 },
    { width: 375, height: 812 },
    { width: 414, height: 896 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 }
];

const args = process.argv.slice(2);

const getArgValue = (name) => {
    const index = args.indexOf(name);
    if (index === -1 || index === args.length - 1) {
        return undefined;
    }

    return args[index + 1];
};

const parseViewports = (value) => {
    if (!value) {
        return DEFAULT_VIEWPORTS;
    }

    const parsed = value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
            const [widthRaw, heightRaw] = entry.toLowerCase().split("x");
            const width = Number(widthRaw);
            const height = Number(heightRaw);

            if (!Number.isInteger(width) || !Number.isInteger(height)) {
                throw new Error(`Invalid viewport format: ${entry}. Use WIDTHxHEIGHT.`);
            }

            return { width, height };
        });

    if (!parsed.length) {
        throw new Error("No valid viewports were provided.");
    }

    return parsed;
};

const formatViewport = ({ width, height }) => `${width}x${height}`;

const run = async () => {
    const url = getArgValue("--url") || process.env.NAV_TEST_URL || "http://127.0.0.1:3000";
    const viewports = parseViewports(getArgValue("--viewports"));
    const toggleBreakpoint = Number(
        getArgValue("--toggle-breakpoint") || process.env.NAV_TOGGLE_BREAKPOINT || "1167"
    );
    const outputDir = path.resolve(process.cwd(), "responsive-reports");

    fs.mkdirSync(outputDir, { recursive: true });

    const browser = await chromium.launch({ headless: true });
    const failures = [];

    for (const viewport of viewports) {
        const label = formatViewport(viewport);
        const context = await browser.newContext({ viewport });
        const page = await context.newPage();

        try {
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
            await page.waitForSelector(".site-header", { timeout: 10000 });

            const horizontalOverflow = await page.evaluate(() => (
                document.documentElement.scrollWidth - window.innerWidth
            ));

            if (horizontalOverflow > 1) {
                failures.push(`${label}: page has horizontal overflow (${horizontalOverflow}px).`);
            }

            const toggle = page.locator(".nav-toggle");
            const toggleVisible = await toggle.isVisible();

            if (viewport.width <= toggleBreakpoint && !toggleVisible) {
                failures.push(
                    `${label}: expected menu button to be visible at or below ${toggleBreakpoint}px.`
                );
            }

            if (viewport.width > toggleBreakpoint && toggleVisible) {
                failures.push(
                    `${label}: expected menu button to be hidden above ${toggleBreakpoint}px.`
                );
            }

            if (toggleVisible) {
                    await toggle.click();
                    const expanded = await toggle.getAttribute("aria-expanded");
                    if (expanded !== "true") {
                        failures.push(`${label}: menu button did not switch to aria-expanded=\"true\".`);
                    }

                    const navItems = page.locator(".main-nav a, .main-nav .nav-search-trigger");
                    const itemCount = await navItems.count();

                    if (itemCount === 0) {
                        failures.push(`${label}: no nav items detected after opening menu.`);
                    }

                    for (let i = 0; i < itemCount; i += 1) {
                        const box = await navItems.nth(i).boundingBox();

                        if (!box) {
                            failures.push(`${label}: nav item ${i + 1} has no layout box.`);
                            continue;
                        }

                        const isOutOfBounds = box.x < -1 || box.x + box.width > viewport.width + 1;
                        if (isOutOfBounds) {
                            failures.push(
                                `${label}: nav item ${i + 1} exceeds viewport bounds (${Math.round(box.x)}..${Math.round(box.x + box.width)}).`
                            );
                        }
                    }
            } else {
                const desktopNav = page.locator(".main-nav");
                if (!(await desktopNav.isVisible())) {
                    failures.push(`${label}: desktop nav is not visible.`);
                }
            }

            await page.screenshot({
                path: path.join(outputDir, `navigation-${label}.png`),
                fullPage: false
            });

            console.log(`PASS ${label}`);
        } catch (error) {
            failures.push(`${label}: ${error.message}`);
        } finally {
            await context.close();
        }
    }

    await browser.close();

    if (failures.length) {
        console.error("\nNavigation responsiveness check failed:\n");
        for (const failure of failures) {
            console.error(`- ${failure}`);
        }

        process.exit(1);
    }

    console.log(`\nNavigation responsiveness check passed for ${viewports.length} viewport(s).`);
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
