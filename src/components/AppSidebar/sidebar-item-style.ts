/**
 * Active sidebar entries use neutral emphasis (the accent surface), never
 * orange: orange is reserved for primary actions, focus and live status.
 * The active entry is the current page, so it is not clickable.
 */
export function sidebarItemClassName(isActive: boolean): string | undefined {
	return isActive ? "pointer-events-none" : undefined;
}
