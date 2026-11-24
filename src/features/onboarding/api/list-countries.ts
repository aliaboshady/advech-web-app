import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { PlaceOption } from "../types";

/** Countries for the picker: `id` is the ISO 3166-1 alpha-2 code, `name` the label. */
export const listCountries = async (): Promise<
	BackendResponse<PlaceOption[]>
> => {
	const res = await apiClient<BackendResponse<PlaceOption[]>>("countries", {
		method: "GET",
	});
	return res;
};
