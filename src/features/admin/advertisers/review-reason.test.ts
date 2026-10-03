import { describe, expect, it } from "vitest";
import { reviewReasonIssue } from "./review-reason";

describe("reviewReasonIssue", () => {
	it("refuses an empty reason", () => {
		expect(reviewReasonIssue("")).toBe("empty");
	});

	it("refuses a reason that is only whitespace", () => {
		expect(reviewReasonIssue("   \n\t  ")).toBe("empty");
	});

	it("accepts a reason of exactly 1,000 characters", () => {
		expect(reviewReasonIssue("a".repeat(1000))).toBeNull();
	});

	it("refuses a reason of 1,001 characters", () => {
		expect(reviewReasonIssue("a".repeat(1001))).toBe("tooLong");
	});

	it("measures the 1,000 character limit after trimming", () => {
		expect(reviewReasonIssue(`  ${"a".repeat(1000)}  `)).toBeNull();
		expect(reviewReasonIssue(`  ${"a".repeat(1001)}  `)).toBe("tooLong");
	});
});
