import { UploadIcon, XIcon } from "lucide-react";
import { useCallback } from "react";
import { Accept, FileRejection, useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
	resolution?: Resolution;
	maxSize?: number;
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
	resolution,
	maxSize = 5 * 1024 * 1024, // 5Mb
}: Props) {
	const { t } = useTranslation();

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

			setFile(acceptedFile);
		},
		[resolution, setFile, t],
	);

	const onDropRejected = useCallback(
		(fileRejections: FileRejection[]) => {
			fileRejections.forEach(({ file, errors }) => {
				const reason = errors
					.map((error) => {
						if (error.code === "file-too-large") {
							return `the file is larger than the ${formatFileSize(maxSize)} limit`;
						}
						if (error.code === "file-too-small") {
							return "the file is smaller than the minimum allowed size";
						}
						return error.message;
					})
					.join(" ");

				toast.error(`"${file.name}" could not be uploaded because ${reason}`);
			});
		},
		[maxSize],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		onDropRejected,
		multiple: false,
		maxSize,
		accept: type === "all" ? allAcceptedTypes : acceptByType[type],
		disabled: isUploading,
	});

	return (
		<div className="w-full h-full flex flex-col items-center gap-4">
			<div
				{...getRootProps()}
				className={`w-full h-full border-2 border-dashed rounded-lg p-8 flex flex-col justify-center items-center gap-4 text-center cursor-pointer transition-colors relative
          ${isDragActive ? "border-primary bg-secondary" : "border-gray-300"}
          ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
        `}
			>
				<input {...getInputProps()} />
				{isUploading ? (
					<div className="flex flex-col items-center gap-2">
						<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary border-solid" />
						<p className="text-gray-500 text-xs">
							{t("locale:DRAG_UPLOADING")}
						</p>
					</div>
				) : isDragActive ? (
					<div className="flex flex-col items-center gap-2">
						<UploadIcon className="text-primary" />
						<p className="text-xs">{t("locale:DRAG_ACTIVE")}</p>
					</div>
				) : (
					<div className="flex flex-col items-center gap-2">
						<UploadIcon className="text-primary" />
						<p className="text-xs">{t("locale:DRAG_IDLE")}</p>
					</div>
				)}

				<div
					className={`${!file && "opacity-0"} flex items-center justify-between w-full max-w-md border rounded-md px-3 py-2 bg-gray-50`}
				>
					<span className="truncate text-sm text-gray-700">{file?.name}</span>

					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setFile(null);
						}}
						disabled={isUploading}
						className="text-gray-500 hover:text-red-500 transition-colors text-lg font-bold"
					>
						<XIcon />
					</button>
				</div>
			</div>
		</div>
	);
}
