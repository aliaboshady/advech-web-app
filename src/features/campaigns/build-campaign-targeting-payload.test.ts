import { describe, expect, it } from "vitest";
import {
	buildCampaignTargetingPayload,
	TargetingFormValues,
} from "./build-campaign-targeting-payload";

const untouched: TargetingFormValues = {
	timeZoneId: "",
	daypartingEdited: false,
	daypartingKind: "",
	schedulePresetCode: "",
	days: [],
	startTime: "",
	endTime: "",
	daypartName: "",
	minAge: "",
	maxAge: "",
	interestsEdited: false,
	interestCodes: [],
	venueTypesEdited: false,
	venueTypeCodes: [],
	inclusionZonesEdited: false,
	inclusionZoneIds: [],
	exclusionZonesEdited: false,
	exclusionZoneIds: [],
	carsCount: "",
	deliveryMode: "",
};

describe("buildCampaignTargetingPayload", () => {
	it("sends a Schedule Preset or a custom window, never both", () => {
		const preset = buildCampaignTargetingPayload({
			...untouched,
			daypartingEdited: true,
			daypartingKind: "preset",
			schedulePresetCode: "morning-commute",
			days: [1, 2, 3, 4, 5],
			startTime: "07:00",
			endTime: "10:00",
			daypartName: "School run",
		});
		expect(preset).toEqual({ schedulePresetCode: "morning-commute" });
		const custom = buildCampaignTargetingPayload({
			...untouched,
			daypartingEdited: true,
			daypartingKind: "custom",
			schedulePresetCode: "morning-commute",
			days: [6, 7],
			startTime: "18:00",
			endTime: "02:00",
			daypartName: "School run",
		});
		expect(custom).toEqual({
			dayparting: { days: [6, 7], startTime: "18:00", endTime: "02:00" },
			daypartName: "School run",
		});
		const unnamed = buildCampaignTargetingPayload({
			...untouched,
			daypartingEdited: true,
			daypartingKind: "custom",
			days: [6, 7],
			startTime: "18:00",
			endTime: "02:00",
			daypartName: "  ",
		});
		expect(unnamed).toEqual({
			dayparting: { days: [6, 7], startTime: "18:00", endTime: "02:00" },
		});
		expect(unnamed).not.toHaveProperty("schedulePresetCode");
	});

	it("leaves Dayparting unchanged when it was not edited", () => {
		const payload = buildCampaignTargetingPayload({
			...untouched,
			daypartingKind: "preset",
			schedulePresetCode: "morning-commute",
			days: [1],
			startTime: "08:00",
			endTime: "09:00",
			daypartName: "School run",
		});
		expect(payload).toEqual({});
	});

	it("omits a list that was not edited and sends an empty list to clear it", () => {
		const omitted = buildCampaignTargetingPayload({
			...untouched,
			interestCodes: ["technology"],
			venueTypeCodes: ["shopping-mall"],
		});
		expect(omitted).not.toHaveProperty("interestCodes");
		expect(omitted).not.toHaveProperty("venueTypeCodes");
		const cleared = buildCampaignTargetingPayload({
			...untouched,
			interestsEdited: true,
			interestCodes: [],
			venueTypesEdited: true,
			venueTypeCodes: [],
		});
		expect(cleared.interestCodes).toEqual([]);
		expect(cleared.venueTypeCodes).toEqual([]);
	});

	it("sends time zone, age, cars count and delivery mode without Zone ids", () => {
		const payload = buildCampaignTargetingPayload({
			...untouched,
			timeZoneId: "Africa/Cairo",
			minAge: "18",
			maxAge: "35",
			carsCount: "4",
			deliveryMode: "MOVING",
			interestsEdited: true,
			interestCodes: ["technology"],
		});
		expect(payload).toEqual({
			timeZoneId: "Africa/Cairo",
			minAge: 18,
			maxAge: 35,
			carsCount: 4,
			deliveryMode: "MOVING",
			interestCodes: ["technology"],
		});
		expect(payload).not.toHaveProperty("inclusionZoneIds");
		expect(payload).not.toHaveProperty("exclusionZoneIds");
	});

	it("sends inclusion and exclusion Zone ids, and an empty list to clear a side", () => {
		const sent = buildCampaignTargetingPayload({
			...untouched,
			inclusionZonesEdited: true,
			inclusionZoneIds: ["zone-downtown", "zone-airport"],
			exclusionZonesEdited: true,
			exclusionZoneIds: ["zone-industrial"],
		});
		expect(sent.inclusionZoneIds).toEqual(["zone-downtown", "zone-airport"]);
		expect(sent.exclusionZoneIds).toEqual(["zone-industrial"]);
		const cleared = buildCampaignTargetingPayload({
			...untouched,
			inclusionZonesEdited: true,
			inclusionZoneIds: [],
			exclusionZonesEdited: true,
			exclusionZoneIds: [],
		});
		expect(cleared.inclusionZoneIds).toEqual([]);
		expect(cleared.exclusionZoneIds).toEqual([]);
	});

	it("omits Zone ids that were not edited", () => {
		const payload = buildCampaignTargetingPayload({
			...untouched,
			inclusionZoneIds: ["zone-downtown"],
			exclusionZoneIds: ["zone-airport"],
		});
		expect(payload).not.toHaveProperty("inclusionZoneIds");
		expect(payload).not.toHaveProperty("exclusionZoneIds");
	});
});
