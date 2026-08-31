export type UserResponse = {
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
};
