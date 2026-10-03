import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isVideoContentType } from "../creative-limits";
import { formatMoney } from "../format-money";
import type {
	Campaign,
	CampaignCreative,
	CampaignDayparting,
	CampaignZone,
	DeliveryMode,
	ZoneRole,
} from "../types";

const EMPTY_VALUE = "—";

const DAY_LABEL_KEYS = {
	1: "campaigns.targeting.days.monday",
	2: "campaigns.targeting.days.tuesday",
	3: "campaigns.targeting.days.wednesday",
	4: "campaigns.targeting.days.thursday",
	5: "campaigns.targeting.days.friday",
	6: "campaigns.targeting.days.saturday",
	7: "campaigns.targeting.days.sunday",
} as const;

type SummaryRow = {
	label: string;
	value: string;
};

type Props = {
	campaign: Campaign;
};

/** Read-only Details, Targeting and Creative taken from the Campaign. */
export function CampaignReviewSummary({ campaign }: Props) {
	const { t, i18n } = useTranslation();
	const locale = i18n.language;
	return (
		<div className="flex flex-col gap-4">
			<ReviewSection
				title={t("campaigns.tabs.identity")}
				rows={detailRows(campaign, t, locale)}
			/>
			<ReviewSection
				title={t("campaigns.tabs.targeting")}
				rows={targetingRows(campaign, t)}
			/>
			<CreativeSection campaign={campaign} />
		</div>
	);
}

function ReviewSection({ title, rows }: { title: string; rows: SummaryRow[] }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<dl className="grid gap-3 sm:grid-cols-2">
					{rows.map((row) => (
						<div key={row.label} className="flex flex-col gap-1">
							<dt className="text-muted-foreground">{row.label}</dt>
							<dd>{row.value}</dd>
						</div>
					))}
				</dl>
			</CardContent>
		</Card>
	);
}

function detailRows(
	campaign: Campaign,
	t: TFunction,
	locale: string,
): SummaryRow[] {
	return [
		{ label: t("campaigns.identity.name"), value: campaign.name },
		{
			label: t("campaigns.identity.objective"),
			value: campaign.objective.name,
		},
		{
			label: t("campaigns.identity.flight"),
			value: formatFlight(campaign.flight),
		},
		{
			label: t("campaigns.identity.totalBudget"),
			value: formatMoney(campaign.budget?.total, locale),
		},
		{
			label: t("campaigns.identity.dailyBudget"),
			value: formatMoney(campaign.budget?.daily, locale),
		},
	];
}

function targetingRows(campaign: Campaign, t: TFunction): SummaryRow[] {
	const targeting = campaign.targeting;
	return [
		{
			label: t("campaigns.targeting.timeZone"),
			value: targeting.timeZone?.name ?? EMPTY_VALUE,
		},
		{
			label: t("campaigns.targeting.dayparting"),
			value: formatDayparting(targeting.dayparting, t),
		},
		{ label: t("campaigns.review.age"), value: formatAge(targeting.age) },
		{
			label: t("campaigns.targeting.interests"),
			value: formatNames(targeting.interests),
		},
		{
			label: t("campaigns.targeting.venueTypes"),
			value: formatNames(targeting.venueTypes),
		},
		{
			label: t("campaigns.targeting.inclusionZones"),
			value: formatZones(targeting.zones, "INCLUSION"),
		},
		{
			label: t("campaigns.targeting.exclusionZones"),
			value: formatZones(targeting.zones, "EXCLUSION"),
		},
		{
			label: t("campaigns.targeting.carsCount"),
			value:
				targeting.buy.carsCount === null
					? EMPTY_VALUE
					: String(targeting.buy.carsCount),
		},
		{
			label: t("campaigns.targeting.deliveryMode"),
			value: formatDeliveryMode(targeting.buy.deliveryMode, t),
		},
	];
}

function CreativeSection({ campaign }: { campaign: Campaign }) {
	const { t } = useTranslation();
	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("campaigns.tabs.creative")}</CardTitle>
			</CardHeader>
			<CardContent className="gap-6">
				{campaign.creatives.length === 0 ? (
					<p className="text-muted-foreground">
						{t("campaigns.review.noCreative")}
					</p>
				) : (
					campaign.creatives.map((creative) => (
						<CreativeSummary key={creative.id} creative={creative} />
					))
				)}
			</CardContent>
		</Card>
	);
}

function CreativeSummary({ creative }: { creative: CampaignCreative }) {
	const { t } = useTranslation();
	const length = formatLength(creative.durationMs, t);
	const rows: SummaryRow[] = [
		{ label: t("campaigns.review.file"), value: creative.originalFilename },
		{
			label: t("campaigns.review.dimensions"),
			value: `${creative.width}×${creative.height}`,
		},
	];
	if (length) {
		rows.push({ label: t("campaigns.review.length"), value: length });
	}
	return (
		<div className="flex flex-col gap-3">
			<CreativePreview creative={creative} />
			<dl className="grid gap-3 sm:grid-cols-2">
				{rows.map((row) => (
					<div key={row.label} className="flex flex-col gap-1">
						<dt className="text-muted-foreground">{row.label}</dt>
						<dd>{row.value}</dd>
					</div>
				))}
			</dl>
		</div>
	);
}

function CreativePreview({ creative }: { creative: CampaignCreative }) {
	if (!creative.previewUrl) {
		return null;
	}
	if (isVideoContentType(creative.contentType)) {
		return (
			<video
				src={creative.previewUrl}
				controls
				className="max-h-64 w-full rounded-md bg-muted"
			>
				<track kind="captions" />
			</video>
		);
	}
	return (
		<img
			src={creative.previewUrl}
			alt={creative.originalFilename}
			className="max-h-64 w-full rounded-md object-contain"
		/>
	);
}

function formatFlight(flight: Campaign["flight"]): string {
	if (!flight?.startDate && !flight?.endDate) {
		return EMPTY_VALUE;
	}
	return `${flight?.startDate ?? EMPTY_VALUE} – ${flight?.endDate ?? EMPTY_VALUE}`;
}

function formatAge(age: Campaign["targeting"]["age"]): string {
	if (age.minAge === null && age.maxAge === null) {
		return EMPTY_VALUE;
	}
	const minAge = age.minAge ?? EMPTY_VALUE;
	const maxAge = age.maxAge ?? EMPTY_VALUE;
	return `${minAge}–${maxAge}`;
}

function formatNames(items: readonly { name: string }[]): string {
	if (items.length === 0) {
		return EMPTY_VALUE;
	}
	return items.map((item) => item.name).join(", ");
}

function formatZones(zones: readonly CampaignZone[], role: ZoneRole): string {
	return formatNames(zones.filter((zone) => zone.role === role));
}

function formatDayparting(
	dayparting: CampaignDayparting | null,
	t: TFunction,
): string {
	if (!dayparting) {
		return EMPTY_VALUE;
	}
	const days = dayparting.days.map((day) => dayLabel(day, t)).join(", ");
	const windowLabel = `${days} ${dayparting.startTime}–${dayparting.endTime}`;
	if (!dayparting.name) {
		return windowLabel;
	}
	return `${dayparting.name} (${windowLabel})`;
}

function dayLabel(day: number, t: TFunction): string {
	if (!isKnownDay(day)) {
		return String(day);
	}
	return t(DAY_LABEL_KEYS[day]);
}

function isKnownDay(day: number): day is keyof typeof DAY_LABEL_KEYS {
	return Object.hasOwn(DAY_LABEL_KEYS, day);
}

function formatDeliveryMode(mode: DeliveryMode | null, t: TFunction): string {
	if (mode === "MOVING") {
		return t("campaigns.targeting.moving");
	}
	if (mode === "FIXED") {
		return t("campaigns.targeting.fixed");
	}
	return EMPTY_VALUE;
}

function formatLength(durationMs: number | null, t: TFunction): string | null {
	if (durationMs === null) {
		return null;
	}
	if (durationMs % 1000 === 0) {
		return t("campaigns.review.lengthSeconds", { count: durationMs / 1000 });
	}
	return t("campaigns.review.lengthMilliseconds", { count: durationMs });
}
