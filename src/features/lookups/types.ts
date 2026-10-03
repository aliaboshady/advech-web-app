import { Objective } from "@/features/Objectives/types";

export type LookupItem = {
	id: string;
	name: string;
};

export type SchedulePresetOption = LookupItem & {
	days: number[];
	startTime: string;
	endTime: string;
};

/** `GET /lookups/options`: every list the Campaign wizard renders. */
export type LookupOptions = {
	objectives: Objective[];
	schedulePresets: SchedulePresetOption[];
	interests: LookupItem[];
	venueTypes: LookupItem[];
	currencies: LookupItem[];
	timeZones: LookupItem[];
};
