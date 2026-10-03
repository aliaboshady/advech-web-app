/** Domain error codes from `PATCH /targeting`, and the field each one belongs to. */
export const TARGETING_ERROR_FIELDS: Record<string, string> = {
	TIME_ZONE_NOT_AVAILABLE: "timeZoneId",
	SCHEDULE_PRESET_NOT_AVAILABLE: "schedulePresetCode",
	DAYPARTING_AMBIGUOUS: "daypartingKind",
	DAYPART_NAME_NOT_ALLOWED: "daypartName",
	DAYPART_NAME_WITHOUT_WINDOW: "daypartName",
	AGE_RANGE_INVALID: "maxAge",
	INTEREST_NOT_AVAILABLE: "interestCodes",
	VENUE_TYPE_NOT_AVAILABLE: "venueTypeCodes",
	ZONE_ROLE_CONTRADICTION: "zones",
	TARGETING_ZONE_NOT_FOUND: "zones",
};
