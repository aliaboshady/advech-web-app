import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./styles.css", import.meta.url), "utf8");

/** Custom properties declared directly inside the first `selector { ... }` block. */
function tokens(selector: string): Map<string, string> {
	const start = css.indexOf(`\n${selector} {`);
	if (start === -1) throw new Error(`No ${selector} block in styles.css`);
	const end = css.indexOf("\n}", start);
	const body = css.slice(start, end);
	const map = new Map<string, string>();
	for (const [, name, value] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
		map.set(name, value.trim());
	}
	return map;
}

const light = tokens(":root");
const dark = tokens(".dark");
const themes = { light, dark } as const;

const STATUSES = ["success", "warning", "info", "destructive"];
const SURFACES = [
	"card",
	"popover",
	"primary",
	"secondary",
	"muted",
	"accent",
	"sidebar",
	"sidebar-primary",
	"sidebar-accent",
];

// The base colours both themes must define themselves.
const THEMED = [
	"background",
	"foreground",
	"border",
	"input",
	"ring",
	"primary-hover",
	"glow",
	"glass-bg",
	"glass-border",
	"sidebar-border",
	"sidebar-ring",
	...SURFACES.flatMap((s) => [s, `${s}-foreground`]),
	...STATUSES.flatMap((s) => [
		s,
		`${s}-foreground`,
		`${s}-soft`,
		`${s}-soft-foreground`,
	]),
];

describe("design tokens", () => {
	for (const [name, theme] of Object.entries(themes)) {
		it(`defines every semantic token in the ${name} theme`, () => {
			const missing = THEMED.filter((token) => !theme.has(`--${token}`));
			expect(missing).toEqual([]);
		});
	}

	it("exposes every themed colour as a Tailwind colour", () => {
		const colours = THEMED.filter(
			(t) => !["glow", "glass-bg", "glass-border"].includes(t),
		);
		const unmapped = colours.filter(
			(t) => !css.includes(`--color-${t}: var(--${t});`),
		);
		expect(unmapped).toEqual([]);
	});

	it("keeps the default radius at 0.5rem", () => {
		expect(light.get("--radius")).toBe("0.5rem");
	});
});

// Contrast (WCAG 2.x) for opaque hex and #rrggbbaa colours.
type Rgb = [number, number, number];

function parse(hex: string): { rgb: Rgb; alpha: number } {
	const h = hex.replace("#", "");
	const n = (i: number) => Number.parseInt(h.slice(i, i + 2), 16);
	return { rgb: [n(0), n(2), n(4)], alpha: h.length === 8 ? n(6) / 255 : 1 };
}

function over(top: string, bottom: string): Rgb {
	const t = parse(top);
	const b = parse(bottom).rgb;
	return t.rgb.map((c, i) => c * t.alpha + b[i] * (1 - t.alpha)) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
	const lin = (c: number) => {
		const v = c / 255;
		return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: Rgb, b: Rgb): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

function value(theme: Map<string, string>, token: string): string {
	const v = theme.get(`--${token}`);
	if (!v?.startsWith("#")) throw new Error(`--${token} must be a hex colour`);
	return v;
}

describe("contrast (WCAG AA)", () => {
	for (const [name, theme] of Object.entries(themes)) {
		const bg = (token: string) =>
			over(value(theme, token), value(theme, "background"));

		it(`muted text is readable on every surface in the ${name} theme`, () => {
			const muted = parse(value(theme, "muted-foreground")).rgb;
			for (const surface of ["background", "card", "muted", "popover"]) {
				expect(
					contrast(muted, bg(surface)),
					`muted-foreground on ${surface}`,
				).toBeGreaterThanOrEqual(4.5);
			}
		});

		it(`status colours are readable in the ${name} theme`, () => {
			for (const s of STATUSES) {
				const solid = parse(value(theme, s)).rgb;
				const onSolid = parse(value(theme, `${s}-foreground`)).rgb;
				expect(
					contrast(onSolid, solid),
					`${s} on solid`,
				).toBeGreaterThanOrEqual(4.5);

				// Soft background sits on the card surface.
				const soft = over(value(theme, `${s}-soft`), value(theme, "card"));
				const onSoft = parse(value(theme, `${s}-soft-foreground`)).rgb;
				expect(contrast(onSoft, soft), `${s} on soft`).toBeGreaterThanOrEqual(
					4.5,
				);
			}
		});
	}
});
