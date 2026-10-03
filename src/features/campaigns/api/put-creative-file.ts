import { CreativeFileError } from "../creative-limits";
import { PutCreativeFilePayload } from "../types";

/**
 * PUTs the file straight to storage at the signed URL, so it skips `apiClient`:
 * the URL is already authorised and must not carry the bearer token.
 */
export const putCreativeFile = async ({
	uploadUrl,
	headers,
	file,
}: PutCreativeFilePayload): Promise<void> => {
	const res = await fetch(uploadUrl, {
		method: "PUT",
		headers,
		body: file,
	});
	if (!res.ok) {
		throw new CreativeFileError("upload-failed");
	}
};
