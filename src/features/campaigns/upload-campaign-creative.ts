import { BackendResponse, ErrorResponse } from "@/types";
import {
	CreativeFileError,
	gateCreativeFile,
	isVideoContentType,
} from "./creative-limits";
import {
	CampaignCreative,
	ConfirmCreativePayload,
	CreateCreativeUploadIntentPayload,
	CreativeUploadIntent,
	DeleteCreativePayload,
	PutCreativeFilePayload,
} from "./types";

/** The calls one upload makes, injectable so tests can record them. */
export type CreativeUploadClient = {
	deleteCreative: (
		payload: DeleteCreativePayload,
	) => Promise<BackendResponse<never>>;
	createUploadIntent: (
		payload: CreateCreativeUploadIntentPayload,
	) => Promise<BackendResponse<CreativeUploadIntent>>;
	putCreativeFile: (payload: PutCreativeFilePayload) => Promise<void>;
	confirmCreative: (
		payload: ConfirmCreativePayload,
	) => Promise<BackendResponse<CampaignCreative>>;
};

export type MeasuredCreativeFile = {
	file: File;
	width: number;
	height: number;
	durationMs?: number;
};

export type UploadCampaignCreativeInput = MeasuredCreativeFile & {
	campaignId: string;
	existingCreativeId: string | null;
	/** Called once the old Creative is gone, so a later failure cannot leave it on screen. */
	onExistingCreativeRemoved?: () => void;
};

function unwrap<T>(response: BackendResponse<T>): T {
	if (response.error) {
		throw response.error;
	}
	if (response.data === undefined) {
		const error: ErrorResponse = {
			code: "UNKNOWN",
			message: "Empty response",
			details: {},
		};
		throw error;
	}
	return response.data;
}

async function deleteExistingCreative(
	client: CreativeUploadClient,
	payload: DeleteCreativePayload,
): Promise<void> {
	const response = await client.deleteCreative(payload);
	if (response.error && response.error.code !== "CREATIVE_NOT_FOUND") {
		throw response.error;
	}
}

/**
 * Uploads one Creative. A replacement deletes the Creative already on the
 * Campaign first. The file is PUT to the signed URL with the returned headers,
 * then confirmed. A still image never sends `durationMs`.
 */
export async function uploadCampaignCreative(
	client: CreativeUploadClient,
	input: UploadCampaignCreativeInput,
): Promise<CampaignCreative> {
	const gate = gateCreativeFile(input.file);
	if (!gate.accepted) {
		throw new CreativeFileError(gate.reason);
	}
	if (input.existingCreativeId) {
		await deleteExistingCreative(client, {
			campaignId: input.campaignId,
			creativeId: input.existingCreativeId,
		});
		input.onExistingCreativeRemoved?.();
	}
	const intent = unwrap(
		await client.createUploadIntent({
			campaignId: input.campaignId,
			originalFilename: input.file.name,
			contentType: gate.contentType,
			sizeBytes: input.file.size,
		}),
	);
	await client.putCreativeFile({
		uploadUrl: intent.uploadUrl,
		headers: intent.headers,
		file: input.file,
	});
	return unwrap(
		await client.confirmCreative({
			campaignId: input.campaignId,
			creativeId: intent.creativeId,
			width: input.width,
			height: input.height,
			...(isVideoContentType(gate.contentType) && input.durationMs !== undefined
				? { durationMs: input.durationMs }
				: {}),
		}),
	);
}
