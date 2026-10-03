import { apiClient } from "@/api/apiClient";
import { ErrorResponse, ServerResponse } from "@/types";
import { CreativeFileError } from "../creative-limits";
import { CampaignCreative } from "../types";
import { CreativeUploadClient } from "../upload-campaign-creative";

type CreativeUploadIntentResponse = {
	creativeId: string;
	uploadUrl: string;
	headers: Record<string, string>;
};

function throwIfError(response: ServerResponse<unknown>): void {
	if (response.error) {
		throw response.error;
	}
}

function requireData<T>(response: ServerResponse<T>): T {
	throwIfError(response);
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

/**
 * The Creative upload protocol against the API: intent, signed PUT, confirm, delete.
 */
export function createCreativeUploadClient(): CreativeUploadClient {
	return {
		deleteCreative: async ({ campaignId, creativeId }) => {
			const response = await apiClient<ServerResponse<never>>(
				`campaigns/${campaignId}/creatives/${creativeId}`,
				{ method: "DELETE" },
			);
			throwIfError(response);
		},
		createUploadIntent: async (input) => {
			const response = await apiClient<
				ServerResponse<CreativeUploadIntentResponse>
			>(`campaigns/${input.campaignId}/creatives/upload-intent`, {
				method: "POST",
				body: JSON.stringify({
					originalFilename: input.originalFilename,
					contentType: input.contentType,
					sizeBytes: input.sizeBytes,
				}),
			});
			const intent = requireData(response);
			return {
				creativeId: intent.creativeId,
				uploadUrl: intent.uploadUrl,
				headers: intent.headers,
			};
		},
		putCreativeFile: async (input) => {
			const response = await fetch(input.uploadUrl, {
				method: "PUT",
				headers: input.headers,
				body: input.file,
			});
			if (!response.ok) {
				throw new CreativeFileError("upload-failed");
			}
		},
		confirmCreative: async (input) => {
			const body: { width: number; height: number; durationMs?: number } = {
				width: input.width,
				height: input.height,
			};
			if (input.durationMs !== undefined) {
				body.durationMs = input.durationMs;
			}
			const response = await apiClient<ServerResponse<CampaignCreative>>(
				`campaigns/${input.campaignId}/creatives/${input.creativeId}/confirm`,
				{
					method: "POST",
					body: JSON.stringify(body),
				},
			);
			return requireData(response);
		},
	};
}
