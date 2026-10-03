/** True when one Zone id is on both the inclusion and exclusion sides. */
export function hasZoneRoleContradiction(
	inclusionZoneIds: readonly string[],
	exclusionZoneIds: readonly string[],
): boolean {
	const included = new Set(inclusionZoneIds);
	return exclusionZoneIds.some((zoneId) => included.has(zoneId));
}
