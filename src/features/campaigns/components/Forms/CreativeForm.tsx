import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import FileUploadDropzone from "@/components/FileDropzone";
import { Button } from "@/components/ui/button";
import useRequest from "@/hooks/useRequest";
import i18n from "@/i18n";
import { resolveErrorMessage } from "@/lib/error-messages";
import { isErrorResponse } from "@/lib/utils";
import { confirmCreative } from "../../api/confirm-creative";
import { createCreativeUploadIntent } from "../../api/create-creative-upload-intent";
import { deleteCreative } from "../../api/delete-creative";
import { putCreativeFile } from "../../api/put-creative-file";
import {
	CREATIVE_FILE_ACCEPT,
	CREATIVE_VIDEO_MAX_BYTES,
	CreativeFileError,
	CreativeFileErrorReason,
	gateCreativeFile,
	isVideoContentType,
} from "../../creative-limits";
import { measureCreativeFile } from "../../measure-creative";
import { CampaignCreative } from "../../types";
import {
	CreativeUploadClient,
	uploadCampaignCreative,
} from "../../upload-campaign-creative";

const creativeUploadClient: CreativeUploadClient = {
	deleteCreative,
	createUploadIntent: createCreativeUploadIntent,
	putCreativeFile,
	confirmCreative,
};

const FAILURE_MESSAGES = {
	"unsupported-type": "campaigns.creative.unsupportedType",
	"too-large": "campaigns.creative.tooLarge",
	unreadable: "campaigns.creative.unreadable",
	"upload-failed": "campaigns.creative.uploadFailed",
} as const satisfies Record<CreativeFileErrorReason, string>;

type Props = {
	campaignId: string;
	creative: CampaignCreative | null;
};

function CreativePreview({ creative }: { creative: CampaignCreative }) {
	if (!creative.previewUrl) {
		return (
			<p className="text-sm text-muted-foreground">
				{creative.originalFilename}
			</p>
		);
	}
	if (isVideoContentType(creative.contentType)) {
		return (
			<video
				src={creative.previewUrl}
				controls
				className="max-h-64 w-full rounded-md bg-black"
			>
				<track kind="captions" />
			</video>
		);
	}
	return (
		<img
			src={creative.previewUrl}
			alt={creative.originalFilename}
			className="max-h-64 w-full rounded-md object-contain"
		/>
	);
}

export function CreativeForm({ campaignId, creative: initialCreative }: Props) {
	const { t } = useTranslation();
	const router = useRouter();
	const [creative, setCreative] = useState<CampaignCreative | null>(
		initialCreative,
	);
	const [file, setFile] = useState<File | null>(null);
	const { request: requestUpload, isLoading: isSaving } = useRequest<
		File,
		CampaignCreative
	>(
		async (next) => {
			const measured = await measureCreativeFile(next);
			return uploadCampaignCreative(creativeUploadClient, {
				...measured,
				file: next,
				campaignId,
				existingCreativeId: creative?.id ?? null,
				onExistingCreativeRemoved: () => setCreative(null),
			});
		},
		// Creative file errors need their own translated messages; see reportFailure.
		{ showErrorToast: false },
	);
	const selectFile = (next: File | null): void => {
		if (!next) {
			setFile(null);
			return;
		}
		const gate = gateCreativeFile(next);
		if (!gate.accepted) {
			toast.error(t(FAILURE_MESSAGES[gate.reason]));
			return;
		}
		setFile(next);
	};
	const reportFailure = (error: unknown): void => {
		if (error instanceof CreativeFileError) {
			toast.error(t(FAILURE_MESSAGES[error.reason]));
			return;
		}
		if (isErrorResponse(error)) {
			toast.error(resolveErrorMessage(error, i18n.language));
			return;
		}
		toast.error(t("campaigns.creative.uploadFailed"));
	};
	const saveAndContinue = async (): Promise<void> => {
		if (isSaving) {
			return;
		}
		try {
			if (file) {
				const saved = await requestUpload(file);
				setCreative(saved);
				setFile(null);
			}
			await router.navigate({
				to: "/campaigns/$id/review",
				params: { id: campaignId },
			});
		} catch (error) {
			reportFailure(error);
		}
	};
	return (
		<div className="@container bg-primary-foreground w-full h-full @sm:min-h-[calc(100vh-16rem)] flex flex-col gap-4 shadow-md p-4 border rounded-xl">
			{creative ? <CreativePreview creative={creative} /> : null}
			<div className="flex flex-col gap-2 items-center h-full max-h-90">
				<FileUploadDropzone
					file={file}
					setFile={selectFile}
					accept={CREATIVE_FILE_ACCEPT}
					maxSize={CREATIVE_VIDEO_MAX_BYTES}
					isUploading={isSaving}
				/>
				<p className="text-xs text-muted-foreground">
					{t("campaigns.creative.hint")}
				</p>
			</div>
			<div className="w-full flex justify-end items-end">
				<Button
					onClick={() => {
						saveAndContinue().catch(() => {});
					}}
					disabled={isSaving}
					className="w-full @sm:w-fit"
				>
					{t("campaigns.creative.saveAndContinue")}
				</Button>
			</div>
		</div>
	);
}
