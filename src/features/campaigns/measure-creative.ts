import {
	CreativeFileError,
	creativeContentTypeOf,
	isVideoContentType,
} from "./creative-limits";

export type MeasuredCreative = {
	width: number;
	height: number;
	durationMs?: number;
};

function isVideoFile(file: File): boolean {
	const contentType = creativeContentTypeOf(file);
	return contentType !== null && isVideoContentType(contentType);
}

/**
 * Reads width and height from the file. `durationMs` is measured for video only.
 */
export function measureCreativeFile(file: File): Promise<MeasuredCreative> {
	return new Promise((resolve, reject) => {
		const objectUrl = URL.createObjectURL(file);
		const isVideo = isVideoFile(file);
		const media = isVideo ? document.createElement("video") : new Image();
		const release = (): void => {
			URL.revokeObjectURL(objectUrl);
		};
		const fail = (): void => {
			release();
			reject(new CreativeFileError("unreadable"));
		};
		media.onerror = fail;
		if (media instanceof HTMLVideoElement) {
			media.preload = "metadata";
			media.onloadedmetadata = () => {
				const width = media.videoWidth;
				const height = media.videoHeight;
				const durationMs = Math.round(media.duration * 1000);
				release();
				if (
					width < 1 ||
					height < 1 ||
					!Number.isFinite(durationMs) ||
					durationMs < 1
				) {
					reject(new CreativeFileError("unreadable"));
					return;
				}
				resolve({ width, height, durationMs });
			};
		} else {
			media.onload = () => {
				const width = media.naturalWidth;
				const height = media.naturalHeight;
				release();
				if (width < 1 || height < 1) {
					reject(new CreativeFileError("unreadable"));
					return;
				}
				resolve({ width, height });
			};
		}
		media.src = objectUrl;
	});
}
