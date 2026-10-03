import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { PlaceOption } from "../types";

/** Countries for the picker: `id` is the ISO 3166-1 alpha-2 code, `name` the label. */
export const listCountries = async (): Promise<
	ServerResponse<PlaceOption[]>
> => {
	const res = await apiClient<ServerResponse<PlaceOption[]>>("countries", {
		method: "GET",
	});
	return res;
};
