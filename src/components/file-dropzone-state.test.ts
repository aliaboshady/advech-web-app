import { describe, expect, it } from "vitest";
import { dropzoneState } from "./file-dropzone-state";

const base = {
	isDragActive: false,
	isUploading: false,
	hasFile: false,
	hasError: false,
};

describe("dropzoneState", () => {
	it("is idle with nothing going on", () => {
		expect(dropzoneState(base)).toBe("idle");
	});
	it("shows drag over while a file is dragged in", () => {
		expect(dropzoneState({ ...base, isDragActive: true, hasError: true })).toBe(
			"dragOver",
		);
	});
	it("shows the error until a file is chosen or dragged", () => {
		expect(dropzoneState({ ...base, hasError: true, hasFile: true })).toBe(
			"error",
		);
	});
	it("shows selected once a file is chosen", () => {
		expect(dropzoneState({ ...base, hasFile: true })).toBe("selected");
	});
	it("uploading wins over everything", () => {
		expect(
			dropzoneState({
				isDragActive: true,
				isUploading: true,
				hasFile: true,
				hasError: true,
			}),
		).toBe("uploading");
	});
});
