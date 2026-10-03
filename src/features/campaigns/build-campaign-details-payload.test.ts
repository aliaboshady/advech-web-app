import { describe, expect, it } from "vitest";
import {
	buildCampaignDetailsPayload,
	formatCalendarDate,
} from "./build-campaign-details-payload";

const emptyDetails = {
	name: "",
	objectiveCode: "",
	startDate: "",
	endDate: "",
	totalAmount: "",
	dailyAmount: "",
	currency: "",
};

describe("buildCampaignDetailsPayload", () => {
	it("sends Flight dates as calendar days", () => {
		const payload = buildCampaignDetailsPayload({
			...emptyDetails,
			startDate: formatCalendarDate(new Date(Date.UTC(2026, 9, 1))),
			endDate: formatCalendarDate(new Date(Date.UTC(2026, 9, 31))),
		});
		expect(payload.startDate).toBe("2026-10-01");
		expect(payload.endDate).toBe("2026-10-31");
	});

	it("sends total and daily Budget as an amount and currency pair", () => {
		const payload = buildCampaignDetailsPayload({
			...emptyDetails,
			totalAmount: "15000.00",
			dailyAmount: "500.50",
			currency: "EGP",
		});
		expect(payload.totalBudget).toEqual({
			amount: "15000.00",
			currency: "EGP",
		});
		expect(payload.dailyBudget).toEqual({ amount: "500.50", currency: "EGP" });
	});

	it("omits a Budget when the amount and currency are not both present", () => {
		const amountOnly = buildCampaignDetailsPayload({
			...emptyDetails,
			totalAmount: "15000.00",
		});
		const currencyOnly = buildCampaignDetailsPayload({
			...emptyDetails,
			currency: "EGP",
			dailyAmount: "10",
		});
		expect(amountOnly).not.toHaveProperty("totalBudget");
		expect(currencyOnly.dailyBudget).toEqual({
			amount: "10",
			currency: "EGP",
		});
		expect(currencyOnly).not.toHaveProperty("totalBudget");
	});

	it("omits empty fields instead of sending null", () => {
		const payload = buildCampaignDetailsPayload({
			...emptyDetails,
			name: "  Ramadan brand push  ",
			objectiveCode: "foot-traffic",
		});
		expect(payload).toEqual({
			name: "Ramadan brand push",
			objectiveCode: "foot-traffic",
		});
		expect(JSON.stringify(payload)).not.toContain("null");
	});
});
