import { useTranslation } from "react-i18next";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { formatDate } from "@/lib/utils";
import { AdvertiserDetail } from "../advertiser-detail";

type AdvertiserDetailFactsProps = {
	readonly advertiser: AdvertiserDetail;
};

function displayText(value: string | null): string {
	if (value === null || value.trim().length === 0) {
		return "—";
	}
	return value;
}

function contactName(advertiser: AdvertiserDetail): string | null {
	const parts = [
		advertiser.contact.firstName,
		advertiser.contact.lastName,
	].filter((part): part is string => part !== null && part.trim().length > 0);
	if (parts.length === 0) {
		return null;
	}
	return parts.join(" ");
}

function formatAcceptedAt(acceptedAt: string | null): string {
	if (acceptedAt === null) {
		return "—";
	}
	const formatted = formatDate(acceptedAt, "dateTime");
	if (formatted.length === 0 || formatted === "Invalid DateTime") {
		return "—";
	}
	return formatted;
}

/** Company, contact, consent, status and the last Review reason. */
export function AdvertiserDetailFacts({
	advertiser,
}: AdvertiserDetailFactsProps) {
	const { t } = useTranslation();
	const companyFields = [
		{
			label: t("admin.advertisers.detail.companyName"),
			value: displayText(advertiser.company.name),
		},
		{
			label: t("admin.advertisers.detail.email"),
			value: displayText(advertiser.company.email),
		},
		{
			label: t("admin.advertisers.columns.country"),
			value: displayText(advertiser.company.country),
		},
		{
			label: t("admin.advertisers.columns.city"),
			value: displayText(advertiser.company.city),
		},
		{
			label: t("admin.advertisers.detail.telephone"),
			value: displayText(advertiser.company.telephone),
		},
		{
			label: t("admin.advertisers.detail.address"),
			value: displayText(advertiser.company.address),
		},
	] as const;
	const contactFields = [
		{
			label: t("admin.advertisers.detail.contactName"),
			value: displayText(contactName(advertiser)),
		},
		{
			label: t("admin.advertisers.detail.mobile"),
			value: displayText(advertiser.contact.mobile),
		},
		{
			label: t("admin.advertisers.detail.contactTitle"),
			value: displayText(advertiser.contact.title),
		},
	] as const;
	return (
		<div className="flex flex-col gap-4">
			<section className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
				<h2 className="text-base font-semibold">
					{t("admin.advertisers.columns.status")}
				</h2>
				<p>
					<StatusBadge kind="advertiser" status={advertiser.status} />
				</p>
				<h2 className="text-base font-semibold">
					{t("admin.advertisers.detail.reviewReason")}
				</h2>
				<p className="whitespace-pre-wrap text-sm">
					{advertiser.reviewReason === null ||
					advertiser.reviewReason.trim().length === 0
						? t("admin.advertisers.detail.noReviewReason")
						: advertiser.reviewReason}
				</p>
			</section>
			<FactSection
				title={t("admin.advertisers.detail.company")}
				fields={companyFields}
			/>
			<FactSection
				title={t("admin.advertisers.detail.contact")}
				fields={contactFields}
			/>
			<section className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
				<h2 className="text-base font-semibold">
					{t("admin.advertisers.detail.consent")}
				</h2>
				<p className="text-sm">
					{advertiser.consent.complete
						? t("admin.advertisers.detail.consentAccepted")
						: t("admin.advertisers.detail.consentMissing")}
				</p>
				<dl className="grid gap-4 sm:grid-cols-2">
					<Fact
						label={t("admin.advertisers.detail.currentTermsVersion")}
						value={advertiser.consent.currentVersion}
					/>
					<Fact
						label={t("admin.advertisers.detail.acceptedVersion")}
						value={displayText(advertiser.consent.acceptedVersion)}
					/>
					<Fact
						label={t("admin.advertisers.detail.acceptedAt")}
						value={formatAcceptedAt(advertiser.consent.acceptedAt)}
					/>
				</dl>
			</section>
		</div>
	);
}

function FactSection({
	title,
	fields,
}: {
	readonly title: string;
	readonly fields: readonly {
		readonly label: string;
		readonly value: string;
	}[];
}) {
	return (
		<section className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
			<h2 className="text-base font-semibold">{title}</h2>
			<dl className="grid gap-4 sm:grid-cols-2">
				{fields.map((field) => (
					<Fact key={field.label} label={field.label} value={field.value} />
				))}
			</dl>
		</section>
	);
}

function Fact({
	label,
	value,
}: {
	readonly label: string;
	readonly value: string;
}) {
	return (
		<div className="flex flex-col gap-1">
			<dt className="text-sm text-muted-foreground">{label}</dt>
			<dd className="text-sm">{value}</dd>
		</div>
	);
}
