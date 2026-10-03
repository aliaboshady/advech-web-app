import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadErrorState } from "@/components/LoadErrorState";
import { PageLayout } from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
			description={
				detail.advertiser
					? t("admin.advertisers.detail.description")
					: undefined
			}
			className="gap-section"
		>
			{detail.advertiser === null && detail.isLoading ? (
				<AdvertiserDetailSkeleton
					label={t("admin.advertisers.detail.loading")}
				/>
			) : null}
			{detail.advertiser === null && loadError ? (
				<LoadErrorState
					description={loadError}
					action={
						<Button asChild variant="secondary">
							<Link to="/admin/advertisers">
								<ArrowLeftIcon aria-hidden="true" className="rtl:rotate-180" />
								{t("admin.advertisers.detail.backToQueue")}
							</Link>
						</Button>
					}
				/>
			) : null}
			{detail.advertiser ? (
				<>
					<AdvertiserReviewActions
						advertiser={detail.advertiser}
						onUpdated={detail.setAdvertiser}
						onInvalidTransition={async () => {
							await detail.reload().catch(() => undefined);
						}}
					/>
					<AdvertiserDetailFacts advertiser={detail.advertiser} />
				</>
			) : null}
		</PageLayout>
	);
}

/** Card-shaped placeholders that keep the layout of the loaded detail. */
function AdvertiserDetailSkeleton({ label }: { readonly label: string }) {
	return (
		<div role="status" aria-busy="true" className="flex flex-col gap-section">
			<span className="sr-only">{label}</span>
			{[0, 1, 2].map((card) => (
				<div
					key={card}
					aria-hidden="true"
					className="flex flex-col gap-stack rounded-lg border border-border bg-card p-4"
				>
					<Skeleton className="h-5 w-40" />
					<div className="grid grid-cols-1 gap-stack @md/pageLayout:grid-cols-2">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
			))}
		</div>
	);
}
