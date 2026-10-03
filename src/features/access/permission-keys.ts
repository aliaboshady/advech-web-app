/**
 * Permission keys the UI knows today. The backend only adds keys;
 * a key absent from this list is ignored.
 */
export const PERMISSION_KEYS = [
	"drivers:read",
	"drivers:approve",
	"documents:review",
	"roles:manage",
	"admins:invite",
	"lookups:manage",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];
