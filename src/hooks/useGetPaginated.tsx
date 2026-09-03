import { DependencyList, useEffect, useState } from "react";
import { PaginatedPayload, PaginatedResponse, SortType } from "@/types";
import { useDebounce } from "./useDebounce";
import useRequest from "./useRequest";

type GetPaginatedArgs<P extends PaginatedPayload, R> = {
	request: (payload: P) => Promise<PaginatedResponse<R>>;
	delay?: number;
	dependencies?: DependencyList;
	getExtraPayload?: () => Partial<P>;
};

export function useGetPaginated<P extends PaginatedPayload, R>({
	request,
	dependencies = [],
	delay = 500,
	getExtraPayload,
}: GetPaginatedArgs<P, R>) {
	const [page, setPage] = useState(1);
	const [limit, setLimitValue] = useState(10);
	const [search, setSearch] = useState<string>("");
	const [sortBy, setSortBy] = useState<string>("createdAt");
	const [sortType, setSortType] = useState<SortType>("desc");
	const [debouncedSearch, setDebouncedSearch] = useState<string>(search);

	const {
		request: fetch,
		data,
		isLoading,
	} = useRequest<P, PaginatedResponse<R>>(request);

	const refetch = async () => {
		fetch({
			page,
			limit,
			search: debouncedSearch,
			orderBy: sortBy,
			orderType: sortType,
			...getExtraPayload?.(),
		} as P);
	};

	const setLimit = (nextLimit: number) => {
		setLimitValue(nextLimit);
		setPage(1);
	};

	useEffect(() => {
		refetch();
	}, [page, limit, debouncedSearch, sortBy, sortType, ...dependencies]);

	useDebounce(
		() => {
			if (search !== debouncedSearch) {
				setPage(1);
			}
			setDebouncedSearch(search);
		},
		delay,
		[search],
	);

	return {
		fetch,
		refetch,
		data,
		isLoading,
		page,
		setPage,
		limit,
		setLimit,
		search,
		setSearch,
		sortBy,
		setSortBy,
		sortType,
		setSortType,
		debouncedSearch,
	};
}
