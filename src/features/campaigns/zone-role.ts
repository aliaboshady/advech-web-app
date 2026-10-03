/** True when one Zone id is on both the inclusion and exclusion sides. */
export function hasZoneRoleContradiction(
	inclusionZoneIds: readonly string[],
	exclusionZoneIds: readonly string[],
): boolean {
	const included = new Set(inclusionZoneIds);
	return exclusionZoneIds.some((zoneId) => included.has(zoneId));
}

/** Options a side can pick: its own picks plus any Zone not picked on the other side. */
export function optionsForSide<T extends { id: string }>(
	zones: readonly T[],
	selectedOnThisSide: readonly string[],
	selectedOnOtherSide: readonly string[],
): T[] {
	const selected = new Set(selectedOnThisSide);
	const otherSide = new Set(selectedOnOtherSide);
	return zones.filter(
		(zone) => selected.has(zone.id) || !otherSide.has(zone.id),
	);
}

/** Drops ids already picked on the other side. */
export function idsWithoutContradiction(
	zoneIds: readonly string[],
	otherSideIds: readonly string[],
): string[] {
	const otherSide = new Set(otherSideIds);
	return zoneIds.filter((zoneId) => !otherSide.has(zoneId));
}
