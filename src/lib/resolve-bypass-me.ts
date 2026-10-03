import { User } from "@/features/users/types";
import { mockAdminMe, mockMe } from "./staticKeys";

/**
 * The dev-bypass user. `admin` selects the Admin variant; every other value
 * keeps the Advertiser mock.
 */
export function resolveBypassMe(actor: string | undefined): User {
	if (actor === "admin") {
		return mockAdminMe;
	}
	return mockMe;
}
