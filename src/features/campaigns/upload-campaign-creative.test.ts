import { describe, expect, it } from "vitest";
import { CampaignCreative } from "./types";
import {
	CreativeUploadClient,
	uploadCampaignCreative,
} from "./upload-campaign-creative";

function confirmedCreative(id: string): CampaignCreative {
	return {
		id,
		originalFilename: "hero.png",
		contentType: "image/png",
		sizeBytes: 1200,
		width: 800,
		height: 600,
		durationMs: null,
		previewUrl: "https://storage.example/preview.png",
		confirmedAt: "2026-10-03T00:00:00.000Z",
	};
}

function recordingClient(): CreativeUploadClient & {
	confirmed: unknown[];
	events: string[];
	put: { uploadUrl: string; headers: Record<string, string> } | null;
} {
	const confirmed: unknown[] = [];
	const events: string[] = [];
	const recorded: CreativeUploadClient & {
		confirmed: unknown[];
		events: string[];
		put: { uploadUrl: string; headers: Record<string, string> } | null;
	} = {
		confirmed,
		events,
		put: null,
		deleteCreative: async (input) => {
			events.push(`delete:${input.creativeId}`);
		},
		createUploadIntent: async () => {
			events.push("intent");
			return {
				creativeId: "creative-1",
				uploadUrl: "https://storage.example/upload",
				headers: { "Content-Type": "image/png", "x-amz-meta": "signed" },
			};
		},
		putCreativeFile: async (input) => {
			events.push("put");
			recorded.put = { uploadUrl: input.uploadUrl, headers: input.headers };
		},
		confirmCreative: async (input) => {
			events.push("confirm");
			confirmed.push(input);
			return confirmedCreative(input.creativeId);
		},
	};
	return recorded;
}

describe("uploadCampaignCreative", () => {
	it("omits durationMs when confirming an image", async () => {
		const client = recordingClient();
		await uploadCampaignCreative(client, {
			campaignId: "campaign-1",
			existingCreativeId: null,
			file: { name: "hero.png", type: "image/png", size: 1200 },
			body: new Blob(["png"]),
			width: 800,
			height: 600,
			durationMs: 1500,
		});
		expect(client.confirmed).toEqual([
			{
				campaignId: "campaign-1",
				creativeId: "creative-1",
				width: 800,
				height: 600,
			},
		]);
	});

	it("omits durationMs for a gif as well as a jpeg", async () => {
		const client = recordingClient();
		await uploadCampaignCreative(client, {
			campaignId: "campaign-1",
			existingCreativeId: null,
			file: { name: "hero.gif", type: "image/gif", size: 900 },
			body: new Blob(["gif"]),
			width: 320,
			height: 240,
			durationMs: 2000,
		});
		await uploadCampaignCreative(client, {
			campaignId: "campaign-1",
			existingCreativeId: null,
			file: { name: "hero.jpg", type: "image/jpeg", size: 900 },
			body: new Blob(["jpg"]),
			width: 640,
			height: 480,
			durationMs: 1000,
		});
		expect(client.confirmed[0]).not.toHaveProperty("durationMs");
		expect(client.confirmed[1]).not.toHaveProperty("durationMs");
	});

	it("sends durationMs when confirming a video", async () => {
		const client = recordingClient();
		await uploadCampaignCreative(client, {
			campaignId: "campaign-1",
			existingCreativeId: null,
			file: { name: "spot.mp4", type: "video/mp4", size: 4096 },
			body: new Blob(["mp4"]),
			width: 1920,
			height: 1080,
			durationMs: 15000,
		});
		expect(client.confirmed).toEqual([
			{
				campaignId: "campaign-1",
				creativeId: "creative-1",
				width: 1920,
				height: 1080,
				durationMs: 15000,
			},
		]);
	});

	it("deletes the Creative already on the Campaign before uploading a replacement", async () => {
		const client = recordingClient();
		await uploadCampaignCreative(client, {
			campaignId: "campaign-1",
			existingCreativeId: "old-creative",
			file: { name: "spot.mp4", type: "video/mp4", size: 4096 },
			body: new Blob(["mp4"]),
			width: 1920,
			height: 1080,
			durationMs: 15000,
		});
		expect(client.events).toEqual([
			"delete:old-creative",
			"intent",
			"put",
			"confirm",
		]);
	});

	it("puts the file at the signed upload URL with the returned headers", async () => {
		const client = recordingClient();
		await uploadCampaignCreative(client, {
			campaignId: "campaign-1",
			existingCreativeId: null,
			file: { name: "hero.png", type: "image/png", size: 1200 },
			body: new Blob(["png"]),
			width: 800,
			height: 600,
		});
		expect(client.put).toEqual({
			uploadUrl: "https://storage.example/upload",
			headers: { "Content-Type": "image/png", "x-amz-meta": "signed" },
		});
	});

	it("continues the upload when the previous Creative is already gone", async () => {
		const client = recordingClient();
		client.deleteCreative = async () => {
			client.events.push("delete:old-creative");
			throw {
				code: "CREATIVE_NOT_FOUND",
				message: "Creative not found",
				details: {},
			};
		};
		await uploadCampaignCreative(client, {
			campaignId: "campaign-1",
			existingCreativeId: "old-creative",
			file: { name: "hero.png", type: "image/png", size: 1200 },
			body: new Blob(["png"]),
			width: 800,
			height: 600,
		});
		expect(client.events).toEqual([
			"delete:old-creative",
			"intent",
			"put",
			"confirm",
		]);
	});
});
