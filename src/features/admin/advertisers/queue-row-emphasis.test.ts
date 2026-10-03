import { describe, expect, it } from "vitest";
import { ADVERTISER_STATUSES } from "./advertiser-summary";
import { isProminentQueueRow } from "./queue-row-emphasis";

describe("isProminentQueueRow", () => {
	it("stands out only for Advertisers waiting for Review", () => {
		const prominent = ADVERTISER_STATUSES.filter(isProminentQueueRow);
		expect(prominent).toEqual(["PENDING_REVIEW"]);
	});
});
