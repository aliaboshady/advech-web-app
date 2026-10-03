/** Ceiling for jpeg, png and gif. */
export const CREATIVE_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

/** Ceiling for mp4 and mov. */
export const CREATIVE_VIDEO_MAX_BYTES = 50 * 1024 * 1024;

const CREATIVE_CONTENT_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"video/mp4",
	"video/quicktime",
] as const;

export type CreativeContentType = (typeof CREATIVE_CONTENT_TYPES)[number];

export type CreativeFileErrorReason =
	| "unsupported-type"
	| "too-large"
	| "unreadable"
	| "upload-failed";

export class CreativeFileError extends Error {
	readonly reason: CreativeFileErrorReason;
	constructor(reason: CreativeFileErrorReason) {
		super(reason);
		this.name = "CreativeFileError";
		this.reason = reason;
	}
}

export type CreativeFileGate =
	| { accepted: true; contentType: CreativeContentType }
	| { accepted: false; reason: "unsupported-type" | "too-large" };

type CreativeFileInput = {
	name: string;
	type: string;
	size: number;
};

const EXTENSION_CONTENT_TYPES: Record<string, CreativeContentType> = {
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	gif: "image/gif",
	mp4: "video/mp4",
	mov: "video/quicktime",
};

function isCreativeContentType(value: string): value is CreativeContentType {
	return (CREATIVE_CONTENT_TYPES as readonly string[]).includes(value);
}

function contentTypeOf(file: CreativeFileInput): CreativeContentType | null {
	if (isCreativeContentType(file.type)) {
		return file.type;
	}
	const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
	return EXTENSION_CONTENT_TYPES[extension] ?? null;
}

function isVideo(contentType: CreativeContentType): boolean {
	return contentType.startsWith("video/");
}

/**
 * Accepts a Creative the dropzone may take, or says why not.
 * Images stop at 10 MB; video stops at 50 MB. A file exactly at the ceiling is allowed.
 */
export function gateCreativeFile(file: CreativeFileInput): CreativeFileGate {
	const contentType = contentTypeOf(file);
	if (!contentType) {
		return { accepted: false, reason: "unsupported-type" };
	}
	const maxBytes = isVideo(contentType)
		? CREATIVE_VIDEO_MAX_BYTES
		: CREATIVE_IMAGE_MAX_BYTES;
	if (file.size > maxBytes) {
		return { accepted: false, reason: "too-large" };
	}
	return { accepted: true, contentType };
}

/** Types the Creative dropzone accepts. Images are 10 MB; video is 50 MB. */
export const CREATIVE_FILE_ACCEPT: Record<string, string[]> = {
	"image/jpeg": [".jpg", ".jpeg"],
	"image/png": [".png"],
	"image/gif": [".gif"],
	"video/mp4": [".mp4"],
	"video/quicktime": [".mov"],
};
