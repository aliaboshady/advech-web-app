import { isErrorResponse } from "@/lib/utils";
import {
	CreativeContentType,
	CreativeFileError,
	gateCreativeFile,
} from "./creative-limits";
import { CampaignCreative } from "./types";

export type CreativeUploadIntent = {
	creativeId: string;
	uploadUrl: string;
	headers: Record<string, string>;
};

export type ConfirmCreativeInput = {
	campaignId: string;
	creativeId: string;
	width: number;
	height: number;
	durationMs?: number;
};

export type CreativeUploadClient = {
	deleteCreative: (input: {
		campaignId: string;
		creativeId: string;
	}) => Promise<void>;
	createUploadIntent: (input: {
		campaignId: string;
		originalFilename: string;
		contentType: string;
		sizeBytes: number;
	}) => Promise<CreativeUploadIntent>;
	putCreativeFile: (input: {
		uploadUrl: string;
		headers: Record<string, string>;
		file: Blob;
	}) => Promise<void>;
	confirmCreative: (input: ConfirmCreativeInput) => Promise<CampaignCreative>;
};

export type UploadCampaignCreativeInput = {
	campaignId: string;
	existingCreativeId: string | null;
	file: { name: string; type: string; size: number };
	body: Blob;
	width: number;
	height: number;
	durationMs?: number;
};

function confirmBody(input: {
	campaignId: string;
	creativeId: string;
	contentType: CreativeContentType;
	width: number;
	height: number;
	durationMs?: number;
}): ConfirmCreativeInput {
	const body: ConfirmCreativeInput = {
		campaignId: input.campaignId,
		creativeId: input.creativeId,
		width: input.width,
		height: input.height,
	};
	if (
		input.contentType.startsWith("video/") &&
		input.durationMs !== undefined
	) {
		body.durationMs = input.durationMs;
	}
	return body;
}

async function deleteExistingCreative(
	client: CreativeUploadClient,
	input: { campaignId: string; creativeId: string },
): Promise<void> {
	try {
		await client.deleteCreative(input);
	} catch (error) {
		if (isErrorResponse(error) && error.code === "CREATIVE_NOT_FOUND") {
			return;
		}
		throw error;
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
	}
	const intent = await client.createUploadIntent({
		campaignId: input.campaignId,
		originalFilename: input.file.name,
		contentType: gate.contentType,
		sizeBytes: input.file.size,
	});
	await client.putCreativeFile({
		uploadUrl: intent.uploadUrl,
		headers: intent.headers,
		file: input.body,
	});
	return client.confirmCreative(
		confirmBody({
			campaignId: input.campaignId,
			creativeId: intent.creativeId,
			contentType: gate.contentType,
			width: input.width,
			height: input.height,
			durationMs: input.durationMs,
		}),
	);
}
