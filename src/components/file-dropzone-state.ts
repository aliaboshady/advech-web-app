export type DropzoneState =
	| "idle"
	| "dragOver"
	| "uploading"
	| "selected"
	| "error";

type Input = {
	isDragActive: boolean;
	isUploading: boolean;
	hasFile: boolean;
	hasError: boolean;
};

/**
 * The one visual state of the file dropzone. Uploading wins over everything
 * (nothing can change mid-upload), then dragging, then a rejection or failure,
 * then a chosen file.
 */
export function dropzoneState({
	isDragActive,
	isUploading,
	hasFile,
	hasError,
}: Input): DropzoneState {
	if (isUploading) return "uploading";
	if (isDragActive) return "dragOver";
	if (hasError) return "error";
	if (hasFile) return "selected";
	return "idle";
}
