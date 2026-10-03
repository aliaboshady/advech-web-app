/** A Role as `me` returns it: a label for people, never a gating input. */
export type RoleLabel = {
	readonly id: string;
	readonly name: string;
};

/**
 * The `access` block on `me` for an Admin.
 * `permissions` holds Effective permissions. Other actors send null.
 */
export type AdminAccess = {
	readonly isSuperAdmin: boolean;
	readonly roles: readonly RoleLabel[];
	readonly permissions: readonly string[];
};
