import type { RegisteredRouter } from "@tanstack/react-router";
import { PERMISSION_KEYS } from "@/features/access/permission-keys";
import { User } from "@/features/users/types";

export const ENV_MODES = {
	dev: "development",
	prod: "production",
};

export type Route = keyof RegisteredRouter["routesByPath"];

export const mockMe: User = {
	id: "string",
	phone: "01234567890",
	email: "John.Doe@example.com",
	imagePath:
		"https://media.easy-peasy.ai/4e600a82-8aac-4abb-95cd-f87cc9125a0f/18ea5802-d34e-4fbb-91e2-99baebb2eac9_medium.webp",
	firstName: "John",
	lastName: "Doe",
	status: "ACTIVE",
	createdAt: "2026-09-02T18:13:47.591Z",
	updatedAt: "2026-09-02T18:13:47.591Z",
	actorType: "ADVERTISER",
	access: null,
};

export const mockAdminMe: User = {
	id: "admin-1",
	phone: "01000000000",
	email: "amina.admin@example.com",
	imagePath: "",
	firstName: "Amina",
	lastName: "Admin",
	status: "ACTIVE",
	createdAt: "2026-09-02T18:13:47.591Z",
	updatedAt: "2026-09-02T18:13:47.591Z",
	actorType: "ADMIN",
	access: {
		isSuperAdmin: true,
		roles: [{ id: "role-super-admin", name: "Super admin" }],
		permissions: [...PERMISSION_KEYS],
	},
};

export const statusLabels: Record<string, string> = {
	Active: "campaigns.status.active",
	Scheduled: "campaigns.status.scheduled",
	Paused: "campaigns.status.paused",
	Completed: "campaigns.status.completed",
	Cancelled: "campaigns.status.cancelled",
};
