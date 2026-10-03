/** A Role as the admin Roles endpoints return it. */
export type Role = {
	id: string;
	name: string;
	description?: string;
	permissions: string[];
	adminCount: number;
	createdAt: string;
	updatedAt: string;
};

/** A Permission the picker can offer, including its description. */
export type Permission = {
	key: string;
	description: string;
};

/** What the create and edit form holds before it is sent. */
export type RoleFormValues = {
	name: string;
	description: string;
	permissions: string[];
};

/**
 * Body for creating or editing a Role.
 * On edit, `permissions` is the full replacement and `description` is always sent.
 */
export type RoleWritePayload = {
	name: string;
	description?: string;
	permissions: string[];
};

/** Identifies the Role being edited, plus the replacement body. */
export type UpdateRoleInput = {
	id: string;
	payload: RoleWritePayload;
};
