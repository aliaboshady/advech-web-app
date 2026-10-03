import { AdminAccess } from "@/features/access/admin-access";

export type User = {
	id: string;
	phone: string;
	email: string;
	firstName: string;
	lastName: string;
	imagePath: string;
	status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "DELETED";
	createdAt: string;
	updatedAt: string;
	actorType: "DRIVER" | "ADMIN" | "ADVERTISER";
	/** Present for an Admin. Null for every other actor. */
	access: AdminAccess | null;
};
