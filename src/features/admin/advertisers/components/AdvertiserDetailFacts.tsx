import { useTranslation } from "react-i18next";
import { FormSectionCard } from "@/components/FormSectionCard";
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
		<>
			<FormSectionCard title={t("admin.advertisers.columns.status")}>
				<div className="flex flex-col items-start gap-1">
					<StatusBadge kind="advertiser" status={advertiser.status} />
				</div>
				<div className="flex flex-col gap-1 @md/formSection:col-span-2">
					<h3 className="text-body-md text-muted-foreground">
						{t("admin.advertisers.detail.reviewReason")}
					</h3>
					<p className="whitespace-pre-wrap text-body-md">
						{advertiser.reviewReason === null ||
						advertiser.reviewReason.trim().length === 0
							? t("admin.advertisers.detail.noReviewReason")
							: advertiser.reviewReason}
					</p>
				</div>
			</FormSectionCard>
			<FormSectionCard
				title={t("admin.advertisers.detail.company")}
				description={t("admin.advertisers.detail.companyDescription")}
			>
				<Facts fields={companyFields} />
			</FormSectionCard>
			<FormSectionCard
				title={t("admin.advertisers.detail.contact")}
				description={t("admin.advertisers.detail.contactDescription")}
			>
				<Facts fields={contactFields} />
			</FormSectionCard>
			<FormSectionCard
				title={t("admin.advertisers.detail.consent")}
				description={
					advertiser.consent.complete
						? t("admin.advertisers.detail.consentAccepted")
						: t("admin.advertisers.detail.consentMissing")
				}
			>
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
			</FormSectionCard>
		</>
	);
}

function Facts({
	fields,
}: {
	readonly fields: readonly {
		readonly label: string;
		readonly value: string;
	}[];
}) {
	return fields.map((field) => (
		<Fact key={field.label} label={field.label} value={field.value} />
	));
}

function Fact({
	label,
	value,
}: {
	readonly label: string;
	readonly value: string;
}) {
	return (
		<dl className="flex min-w-0 flex-col gap-1">
			<dt className="text-body-md text-muted-foreground">{label}</dt>
			<dd className="wrap-break-word text-body-md">{value}</dd>
		</dl>
	);
}
