import { apiClient } from "@/api/apiClient";
import { BackendResponse } from "@/types";
import { Objective } from "../types";

export const getObjectives = async (): Promise<
	BackendResponse<Objective[]>
> => {
	const res = await apiClient<BackendResponse<Objective[]>>("objectives", {
		method: "GET",
	});

	return res;
};
