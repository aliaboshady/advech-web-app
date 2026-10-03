import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { isPermissionDenied } from "@/features/access/is-permission-denied";
import { resolveErrorMessage } from "@/lib/error-messages";
import { isErrorResponse } from "@/lib/utils";
import { AdvertiserQueueFilter } from "../components/AdvertiserQueueFilter";
import { AdvertiserQueueTable } from "../components/AdvertiserQueueTable";
import {
	AdvertiserQueueError,
	useAdvertiserQueue,
} from "../use-advertiser-queue";

/** Advertisers waiting for Review, with search, sort and paging in the browser. */
export function AdvertiserQueuePage() {
	const { t, i18n } = useTranslation();
	const queue = useAdvertiserQueue();
	const errorMessage = describeQueueError(
		queue.error,
		i18n.language,
		t("admin.advertisers.loadError"),
	);
	const showError = errorMessage !== null && !queue.isLoading;
	return (
		<PageLayout
			title={t("admin.advertisers.title")}
			className="flex flex-col gap-4"
		>
			<AdvertiserQueueFilter
				search={queue.search}
				onSearchChange={queue.setSearch}
				status={queue.status}
				onStatusChange={queue.setStatus}
			/>
			{showError ? (
				<p className="text-sm text-destructive" role="alert">
					{errorMessage}
				</p>
			) : (
				<AdvertiserQueueTable
					data={queue.data}
					page={queue.page}
					setPage={queue.setPage}
					limit={queue.limit}
					setLimit={queue.setLimit}
					sortBy={queue.sortBy}
					setSortBy={queue.setSortBy}
					sortType={queue.sortType}
					setSortType={queue.setSortType}
					loading={queue.isLoading}
				/>
			)}
		</PageLayout>
	);
}

function describeQueueError(
	error: AdvertiserQueueError,
	language: string,
	fallback: string,
): string | null {
	if (error === null) {
		return null;
	}
	if (!isErrorResponse(error)) {
		return fallback;
	}
	if (isPermissionDenied(error)) {
		return null;
	}
	return resolveErrorMessage(error, language);
}
