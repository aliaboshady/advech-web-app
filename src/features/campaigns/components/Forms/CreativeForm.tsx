import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import FileUploadDropzone from "@/components/FileDropzone";
import { FormSectionCard } from "@/components/FormSectionCard";
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
			<p className="text-body-md text-muted-foreground">
				{creative.originalFilename}
			</p>
		);
	}
	if (isVideoContentType(creative.contentType)) {
		return (
			<video
				src={creative.previewUrl}
				controls
				className="max-h-64 w-full rounded-md bg-muted @md/formSection:col-span-2"
			>
				<track kind="captions" />
			</video>
		);
	}
	return (
		<img
			src={creative.previewUrl}
			alt={creative.originalFilename}
			className="max-h-64 w-full rounded-md bg-muted object-contain @md/formSection:col-span-2"
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
	const [fileError, setFileError] = useState("");
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
		setFileError("");
		if (!next) {
			setFile(null);
			return;
		}
		const gate = gateCreativeFile(next);
		if (!gate.accepted) {
			const message = t(FAILURE_MESSAGES[gate.reason]);
			setFileError(message);
			toast.error(message);
			return;
		}
		setFile(next);
	};
	const reportFailure = (error: unknown): void => {
		const message =
			error instanceof CreativeFileError
				? t(FAILURE_MESSAGES[error.reason])
				: isErrorResponse(error)
					? resolveErrorMessage(error, i18n.language)
					: t("campaigns.creative.uploadFailed");
		setFileError(message);
		toast.error(message);
	};
	const saveAndContinue = async (): Promise<void> => {
		if (isSaving) {
			return;
		}
		setFileError("");
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
		<div className="flex w-full flex-col gap-section">
			{creative ? (
				<FormSectionCard
					title={t("campaigns.creative.currentTitle")}
					description={creative.originalFilename}
				>
					<CreativePreview creative={creative} />
				</FormSectionCard>
			) : null}
			<FormSectionCard
				title={
					creative
						? t("campaigns.creative.replaceTitle")
						: t("campaigns.creative.uploadTitle")
				}
				description={t("campaigns.creative.hint")}
				footer={
					<Button
						onClick={() => {
							saveAndContinue().catch(() => {});
						}}
						disabled={isSaving}
						className="w-full @sm/formSection:w-fit"
					>
						{t("campaigns.creative.saveAndContinue")}
					</Button>
				}
			>
				<div className="@md/formSection:col-span-2">
					<FileUploadDropzone
						file={file}
						setFile={selectFile}
						accept={CREATIVE_FILE_ACCEPT}
						maxSize={CREATIVE_VIDEO_MAX_BYTES}
						isUploading={isSaving}
						error={fileError}
					/>
				</div>
			</FormSectionCard>
		</div>
	);
}
