import { describe, expect, it } from "vitest";
import { gateCreativeFile } from "./creative-limits";

const TEN_MB = 10 * 1024 * 1024;
const FIFTY_MB = 50 * 1024 * 1024;

describe("gateCreativeFile", () => {
	it("rejects a file that is not jpeg, png, gif, mp4 or mov", () => {
		expect(
			gateCreativeFile({
				name: "notes.pdf",
				type: "application/pdf",
				size: 100,
			}),
		).toEqual({ accepted: false, reason: "unsupported-type" });
	});

	it("rejects an image larger than 10 MB", () => {
		expect(
			gateCreativeFile({
				name: "hero.png",
				type: "image/png",
				size: TEN_MB + 1,
			}),
		).toEqual({ accepted: false, reason: "too-large" });
	});

	it("rejects a video larger than 50 MB", () => {
		expect(
			gateCreativeFile({
				name: "spot.mp4",
				type: "video/mp4",
				size: FIFTY_MB + 1,
			}),
		).toEqual({ accepted: false, reason: "too-large" });
	});

	it("accepts a jpeg, png or gif at the 10 MB image ceiling", () => {
		expect(
			gateCreativeFile({
				name: "hero.jpg",
				type: "image/jpeg",
				size: TEN_MB,
			}),
		).toEqual({ accepted: true, contentType: "image/jpeg" });
		expect(
			gateCreativeFile({ name: "hero.png", type: "image/png", size: TEN_MB }),
		).toEqual({ accepted: true, contentType: "image/png" });
		expect(
			gateCreativeFile({ name: "hero.gif", type: "image/gif", size: TEN_MB }),
		).toEqual({ accepted: true, contentType: "image/gif" });
	});

	it("accepts an mp4 or mov at the 50 MB video ceiling", () => {
		expect(
			gateCreativeFile({
				name: "spot.mp4",
				type: "video/mp4",
				size: FIFTY_MB,
			}),
		).toEqual({ accepted: true, contentType: "video/mp4" });
		expect(
			gateCreativeFile({
				name: "spot.mov",
				type: "video/quicktime",
				size: FIFTY_MB,
			}),
		).toEqual({ accepted: true, contentType: "video/quicktime" });
	});

	it("reads a mov from its extension when the browser sends no type", () => {
		expect(
			gateCreativeFile({ name: "spot.mov", type: "", size: 2048 }),
		).toEqual({ accepted: true, contentType: "video/quicktime" });
	});
});
