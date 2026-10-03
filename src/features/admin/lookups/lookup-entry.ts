/** One admin-editable Lookup entry, as the admin list returns it. */
export type LookupEntry = {
	readonly code: string;
	readonly name: string;
	readonly description?: string;
	readonly sortOrder: number;
	readonly isActive: boolean;
	readonly createdAt: string;
	readonly updatedAt: string;
};
