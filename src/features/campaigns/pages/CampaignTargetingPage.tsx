import { useTranslation } from "react-i18next";
import { PageLayout } from "@/components/PageLayout";
import { HeaderTabs } from "@/components/Tabs/HeaderTabs";
import { LookupItem, SchedulePresetOption } from "@/features/lookups/types";
import { getCampaignTabs } from "../campaign-tabs";
import { CampaignEditableRegion } from "../components/CampaignEditableRegion";
import { TargetingForm } from "../components/Forms/TargetingForm";
import { Campaign } from "../types";

type Props = {
	id: string;
	campaign: Campaign;
	timeZones: LookupItem[];
	schedulePresets: SchedulePresetOption[];
	interests: LookupItem[];
	venueTypes: LookupItem[];
};

export function CampaignTargetingPage({
	id,
	campaign,
	timeZones,
	schedulePresets,
	interests,
	venueTypes,
}: Props) {
	const { t } = useTranslation();

	return (
		<PageLayout
			breadcrumbs={[
				{
					label: t("sidebar.campaigns"),
					link: "/campaigns",
				},
				{ label: campaign.name },
			]}
			className="flex flex-col gap-4"
		>
			<HeaderTabs
				url={`/campaigns/${id}`}
				tabs={getCampaignTabs(t, campaign.completeness.steps)}
				activeTabId={2}
			/>
			<CampaignEditableRegion status={campaign.status}>
				<TargetingForm
					campaign={campaign}
					timeZones={timeZones}
					schedulePresets={schedulePresets}
					interests={interests}
					venueTypes={venueTypes}
				/>
			</CampaignEditableRegion>
		</PageLayout>
	);
}
