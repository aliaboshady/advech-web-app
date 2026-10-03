import { useTranslation } from "react-i18next";
import { LookupItem, SchedulePresetOption } from "@/features/lookups/types";
import { Zone } from "@/features/zones/types";
import { CampaignEditableRegion } from "../components/CampaignEditableRegion";
import { CampaignStepLayout } from "../components/CampaignStepLayout";
import { TargetingForm } from "../components/Forms/TargetingForm";
import { Campaign } from "../types";

type Props = {
	id: string;
	campaign: Campaign;
	timeZones: LookupItem[];
	schedulePresets: SchedulePresetOption[];
	interests: LookupItem[];
	venueTypes: LookupItem[];
	zones: Zone[];
};

export function CampaignTargetingPage({
	campaign,
	timeZones,
	schedulePresets,
	interests,
	venueTypes,
	zones,
}: Props) {
	const { t } = useTranslation();

	return (
		<CampaignStepLayout
			campaign={campaign}
			activeTabId={2}
			description={t("campaigns.targeting.description")}
		>
			<CampaignEditableRegion status={campaign.status}>
				<TargetingForm
					campaign={campaign}
					timeZones={timeZones}
					schedulePresets={schedulePresets}
					interests={interests}
					venueTypes={venueTypes}
					zones={zones}
				/>
			</CampaignEditableRegion>
		</CampaignStepLayout>
	);
}
