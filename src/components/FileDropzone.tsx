import {
	CircleAlertIcon,
	CircleCheckIcon,
	UploadIcon,
	XIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { type DropzoneState, dropzoneState } from "./file-dropzone-state";

type FileType = "video" | "image" | "docs" | "all";

type Dimensions = {
	width: number;
	height: number;
};

type Resolution =
	| Dimensions
	| {
			min: Dimensions;
			max: Dimensions;
	  };

type Props = {
	file: File | null;
	setFile: (file: File | null) => void;
	isUploading?: boolean;
	type?: FileType;
	accept?: Accept;
	resolution?: Resolution;
	maxSize?: number;
	/** A failure to show inside the dropzone, e.g. a rejected or failed upload. */
	error?: string;
};

function getMediaDimensions(file: File): Promise<Dimensions> {
	return new Promise((resolve, reject) => {
		const objectUrl = URL.createObjectURL(file);
		const media = file.type.startsWith("video/")
			? document.createElement("video")
			: new Image();

		const resolveDimensions = () => {
			if (media instanceof HTMLImageElement) {
				resolve({ width: media.naturalWidth, height: media.naturalHeight });
			} else {
				resolve({ width: media.videoWidth, height: media.videoHeight });
			}
			URL.revokeObjectURL(objectUrl);
		};
		media.onload = resolveDimensions;
		media.onloadedmetadata = resolveDimensions;
		media.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error("Unable to read media dimensions"));
		};
		media.src = objectUrl;
	});
}

function formatResolution(resolution: Resolution) {
	if ("width" in resolution) {
		return `${resolution.width} x ${resolution.height}px`;
	}

	return `${resolution.min.width} x ${resolution.min.height}px to ${resolution.max.width} x ${resolution.max.height}px`;
}

function formatFileSize(bytes: number) {
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function matchesResolution(dimensions: Dimensions, resolution: Resolution) {
	if ("width" in resolution) {
		return (
			dimensions.width === resolution.width &&
			dimensions.height === resolution.height
		);
	}

	return (
		dimensions.width >= resolution.min.width &&
		dimensions.width <= resolution.max.width &&
		dimensions.height >= resolution.min.height &&
		dimensions.height <= resolution.max.height
	);
}

const animatedImageTypes: Accept = {
	"image/gif": [".gif"],
	"image/apng": [".apng"],
	"image/webp": [".webp"],
	"image/avif": [".avif"],
};

const acceptByType: Record<Exclude<FileType, "all">, Accept> = {
	video: {
		"video/mp4": [".mp4"],
		"video/webm": [".webm"],
		"video/quicktime": [".mov"],
		"video/x-msvideo": [".avi"],
		"video/x-matroska": [".mkv"],
		...animatedImageTypes,
	},
	image: {
		"image/jpeg": [".jpg", ".jpeg"],
		"image/png": [".png"],
		"image/bmp": [".bmp"],
		"image/tiff": [".tif", ".tiff"],
		"image/svg+xml": [".svg"],
		...animatedImageTypes,
	},
	docs: {
		"application/pdf": [".pdf"],
		"application/msword": [".doc"],
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
			".docx",
		],
		"application/vnd.ms-excel": [".xls"],
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
			".xlsx",
		],
		"application/vnd.ms-powerpoint": [".ppt"],
		"application/vnd.openxmlformats-officedocument.presentationml.presentation":
			[".pptx"],
		"text/plain": [".txt"],
		"text/csv": [".csv"],
	},
};

const allAcceptedTypes: Accept = {
	...acceptByType.video,
	...acceptByType.image,
	...acceptByType.docs,
};

export default function FileUploadDropzone({
	file,
	setFile,
	isUploading,
	type = "all",
	accept,
	resolution,
	maxSize = 5 * 1024 * 1024, // 5Mb
	error,
}: Props) {
	const { t } = useTranslation();
	const [rejection, setRejection] = useState("");

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (acceptedFiles.length === 0) return;
			const acceptedFile = acceptedFiles[0];

			if (resolution && /^(image|video)\//.test(acceptedFile.type)) {
				try {
					const dimensions = await getMediaDimensions(acceptedFile);
					if (!matchesResolution(dimensions, resolution)) {
						toast.error(
							`"${acceptedFile.name}" has ${dimensions.width} x ${dimensions.height}px. Expected ${formatResolution(resolution)}.`,
						);
						return;
					}
				} catch {
					toast.error(
						`Unable to read the dimensions of "${acceptedFile.name}". Please choose a valid image or video file.`,
					);
					return;
				}
			}

			setRejection("");
			setFile(acceptedFile);
		},
		[resolution, setFile, t],
	);

	const onDropRejected = useCallback(
		(fileRejections: FileRejection[]) => {
			let firstMessage = "";
			fileRejections.forEach(({ file, errors }) => {
				const reason = errors
					.map((rejectionError) => {
						if (rejectionError.code === "file-too-large") {
							return t("dropzone.tooLarge", { size: formatFileSize(maxSize) });
						}
						if (rejectionError.code === "file-too-small") {
							return t("dropzone.tooSmall");
						}
						if (rejectionError.code === "file-invalid-type") {
							return t("dropzone.invalidType");
						}
						return rejectionError.message;
					})
					.join(" ");
				const message = t("dropzone.rejected", { name: file.name, reason });
				firstMessage ||= message;
				toast.error(message);
			});
			setRejection(firstMessage);
		},
		[maxSize, t],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		onDropRejected,
		multiple: false,
		maxSize,
		accept: accept ?? (type === "all" ? allAcceptedTypes : acceptByType[type]),
		disabled: isUploading,
	});

	const message = error || rejection;
	const state = dropzoneState({
		isDragActive,
		isUploading: Boolean(isUploading),
		hasFile: file !== null,
		hasError: message !== "",
	});
	return (
		<div
			{...getRootProps()}
			aria-busy={state === "uploading"}
			className={cn(
				"flex min-h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border-2 p-6 text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
				STATE_STYLES[state],
			)}
		>
			<input {...getInputProps()} />
			{state === "uploading" ? (
				<>
					<p className="text-body-md font-medium">{t("dropzone.uploading")}</p>
					<div
						role="progressbar"
						aria-label={t("dropzone.uploading")}
						className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-muted rtl:-scale-x-100"
					>
						<div className="h-full w-1/3 animate-indeterminate rounded-full bg-primary motion-reduce:w-full motion-reduce:animate-none motion-reduce:opacity-60" />
					</div>
					{file ? (
						<p className="max-w-full truncate text-body-md text-muted-foreground">
							{file.name}
						</p>
					) : null}
				</>
			) : (
				<>
					{state === "error" ? (
						<CircleAlertIcon aria-hidden className="size-6" />
					) : state === "selected" ? (
						<CircleCheckIcon aria-hidden className="size-6" />
					) : (
						<UploadIcon
							aria-hidden
							className={cn(
								"size-6",
								state === "dragOver" ? "text-primary" : "text-muted-foreground",
							)}
						/>
					)}
					<p className="text-body-md font-medium">
						{state === "dragOver"
							? t("dropzone.dragOver")
							: state === "selected"
								? t("dropzone.ready")
								: t("dropzone.idle")}
					</p>
					{state === "error" ? (
						<p role="alert" className="text-body-md">
							{message}
						</p>
					) : null}
					{file ? (
						<div className="flex w-full max-w-md items-center justify-between gap-2 rounded-md border border-border bg-card px-3 py-2 text-card-foreground">
							<span className="truncate text-body-md">{file.name}</span>
							<button
								type="button"
								aria-label={t("dropzone.remove")}
								onClick={(e) => {
									e.stopPropagation();
									setRejection("");
									setFile(null);
								}}
								className="shrink-0 rounded-sm text-muted-foreground transition-colors hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
							>
								<XIcon aria-hidden className="size-4" />
							</button>
						</div>
					) : null}
				</>
			)}
		</div>
	);
}

const STATE_STYLES: Record<DropzoneState, string> = {
	idle: "cursor-pointer border-dashed border-input bg-background text-foreground hover:bg-accent",
	dragOver:
		"cursor-copy border-dashed border-primary bg-accent text-foreground",
	uploading:
		"cursor-progress border-dashed border-border bg-background text-foreground",
	selected:
		"cursor-pointer border-solid border-success bg-success-soft text-success-soft-foreground",
	error:
		"cursor-pointer border-dashed border-destructive bg-destructive-soft text-destructive-soft-foreground",
};
