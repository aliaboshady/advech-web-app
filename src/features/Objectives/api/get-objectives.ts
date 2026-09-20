import { apiClient } from "@/api/apiClient";
import { ServerResponse } from "@/types";
import { Objective } from "../types";

export const getObjectives = async (): Promise<ServerResponse<Objective[]>> => {
	const res = await apiClient<ServerResponse<Objective[]>>("objectives", {
		method: "GET",
	});

	return res;
};
