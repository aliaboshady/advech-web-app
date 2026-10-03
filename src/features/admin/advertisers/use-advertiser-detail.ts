import { useEffect, useState } from "react";
import useRequest from "@/hooks/useRequest";
import { ErrorResponse, ServerResponse } from "@/types";
import { AdvertiserDetail } from "./advertiser-detail";
import { getAdvertiser } from "./api/get-advertiser";

/**
 * The Advertiser open for Review.
 * A later action replaces this with the detail the backend returned.
 */
export function useAdvertiserDetail(advertiserId: string) {
	const [advertiser, setAdvertiser] = useState<AdvertiserDetail | null>(null);
	const { request, isLoading, error } = useRequest<
		string,
		ServerResponse<AdvertiserDetail>
	>(getAdvertiser, { showErrorToast: false });
	const reload = async (): Promise<void> => {
		const result = await request(advertiserId);
		setAdvertiser(result.data ?? null);
	};
	useEffect(() => {
		let isCurrent = true;
		setAdvertiser(null);
		request(advertiserId)
			.then((result) => {
				if (isCurrent) {
					setAdvertiser(result.data ?? null);
				}
			})
			.catch(() => {
				if (isCurrent) {
					setAdvertiser(null);
				}
			});
		return () => {
			isCurrent = false;
		};
	}, [advertiserId]);
	return { advertiser, setAdvertiser, reload, isLoading, error };
}

export type AdvertiserDetailError = Error | ErrorResponse | null;
