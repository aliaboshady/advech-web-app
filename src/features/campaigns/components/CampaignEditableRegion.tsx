import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { isCampaignEditable } from "../is-campaign-editable";
import { CampaignStatus } from "../types";

type NoticeProps = {
	status: CampaignStatus;
};

function CampaignReadOnlyNotice({ status }: NoticeProps) {
	const { t } = useTranslation();
	if (isCampaignEditable(status)) {
		return null;
	}
	return (
		<p className="text-sm text-muted-foreground">
			{t("campaigns.identity.readOnly")}
		</p>
	);
}

type RegionProps = {
	status: CampaignStatus;
	children: ReactNode;
};

/** Locks the step when the Campaign is not a draft or returned for changes. */
export function CampaignEditableRegion({ status, children }: RegionProps) {
	const isEditable = isCampaignEditable(status);
	return (
		<>
			<CampaignReadOnlyNotice status={status} />
			<div
				inert={isEditable ? undefined : true}
				className={isEditable ? undefined : "opacity-70"}
			>
				{children}
			</div>
		</>
	);
}
