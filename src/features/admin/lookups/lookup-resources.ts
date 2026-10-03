export const LOOKUPS_MANAGE = "lookups:manage";

/**
 * One admin Lookup the shared screens can open.
 * A Schedule Preset sets `hasScheduleWindow` and adds days, start and end.
 */
export type LookupResource = {
	readonly id: "objectives" | "interests" | "venue-types" | "schedule-presets";
	readonly collectionPath: string;
	readonly routePath:
		| "/admin/objectives"
		| "/admin/interests"
		| "/admin/venue-types"
		| "/admin/schedule-presets";
	readonly sidebarId:
		| "objectives"
		| "interests"
		| "venue-types"
		| "schedule-presets";
	readonly labelKey:
		| "admin.sidebar.objectives"
		| "admin.sidebar.interests"
		| "admin.sidebar.venueTypes"
		| "admin.sidebar.schedulePresets";
	readonly titleKey:
		| "admin.lookups.objectives.title"
		| "admin.lookups.interests.title"
		| "admin.lookups.venueTypes.title"
		| "admin.lookups.schedulePresets.title";
	readonly descriptionKey:
		| "admin.lookups.objectives.description"
		| "admin.lookups.interests.description"
		| "admin.lookups.venueTypes.description"
		| "admin.lookups.schedulePresets.description";
	readonly hasScheduleWindow?: boolean;
};

export const objectivesLookup: LookupResource = {
	id: "objectives",
	collectionPath: "admin/objectives",
	routePath: "/admin/objectives",
	sidebarId: "objectives",
	labelKey: "admin.sidebar.objectives",
	titleKey: "admin.lookups.objectives.title",
	descriptionKey: "admin.lookups.objectives.description",
};

export const interestsLookup: LookupResource = {
	id: "interests",
	collectionPath: "admin/interests",
	routePath: "/admin/interests",
	sidebarId: "interests",
	labelKey: "admin.sidebar.interests",
	titleKey: "admin.lookups.interests.title",
	descriptionKey: "admin.lookups.interests.description",
};

export const venueTypesLookup: LookupResource = {
	id: "venue-types",
	collectionPath: "admin/venue-types",
	routePath: "/admin/venue-types",
	sidebarId: "venue-types",
	labelKey: "admin.sidebar.venueTypes",
	titleKey: "admin.lookups.venueTypes.title",
	descriptionKey: "admin.lookups.venueTypes.description",
};

export const schedulePresetsLookup: LookupResource = {
	id: "schedule-presets",
	collectionPath: "admin/schedule-presets",
	routePath: "/admin/schedule-presets",
	sidebarId: "schedule-presets",
	labelKey: "admin.sidebar.schedulePresets",
	titleKey: "admin.lookups.schedulePresets.title",
	descriptionKey: "admin.lookups.schedulePresets.description",
	hasScheduleWindow: true,
};

export const lookupResources: readonly LookupResource[] = [
	objectivesLookup,
	interestsLookup,
	venueTypesLookup,
	schedulePresetsLookup,
];
