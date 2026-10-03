import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { isPermissionDenied } from "@/features/access/is-permission-denied";
import { resolveErrorMessage } from "@/lib/error-messages";
import { isErrorResponse } from "@/lib/utils";
import { AdvertiserDetailFacts } from "../components/AdvertiserDetailFacts";
import { AdvertiserReviewActions } from "../components/AdvertiserReviewActions";
import {
	AdvertiserDetailError,
	useAdvertiserDetail,
} from "../use-advertiser-detail";

type AdvertiserDetailPageProps = {
	readonly advertiserId: string;
};

function describeLoadError(
	error: AdvertiserDetailError,
	language: string,
	fallback: string,
	notFound: string,
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
	if (error.code === "ADVERTISER_NOT_FOUND") {
		return notFound;
	}
	return resolveErrorMessage(error, language);
}

/** One Advertiser, judged and acted on from the review queue. */
export function AdvertiserDetailPage({
	advertiserId,
}: AdvertiserDetailPageProps) {
	const { t, i18n } = useTranslation();
	const detail = useAdvertiserDetail(advertiserId);
	const loadError = describeLoadError(
		detail.error,
		i18n.language,
		t("admin.advertisers.detail.loadError"),
		t("admin.advertisers.detail.notFound"),
	);
	const companyName = detail.advertiser?.company.name?.trim();
	const title =
		companyName && companyName.length > 0
			? companyName
			: t("admin.advertisers.detail.title");
	return (
		<PageLayout
			breadcrumbs={[
				{
					label: t("admin.advertisers.title"),
					link: "/admin/advertisers",
				},
				{ label: title },
			]}
			className="flex flex-col gap-4"
		>
			{detail.advertiser === null && detail.isLoading ? (
				<p className="text-sm text-muted-foreground">
					{t("admin.advertisers.detail.loading")}
				</p>
			) : null}
			{detail.advertiser === null && loadError ? (
				<p className="text-sm text-destructive" role="alert">
					{loadError}
				</p>
			) : null}
			{detail.advertiser ? (
				<>
					<AdvertiserDetailFacts advertiser={detail.advertiser} />
					<AdvertiserReviewActions
						advertiser={detail.advertiser}
						onUpdated={detail.setAdvertiser}
						onInvalidTransition={async () => {
							await detail.reload().catch(() => undefined);
						}}
					/>
				</>
			) : null}
		</PageLayout>
	);
}
