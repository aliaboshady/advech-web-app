import { LockIcon } from "lucide-react";
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
		<div
			role="status"
			className="flex items-start gap-3 rounded-lg border border-border bg-muted p-4"
		>
			<LockIcon
				aria-hidden="true"
				className="mt-0.5 size-4 shrink-0 text-muted-foreground"
			/>
			<div className="flex flex-col gap-1">
				<p className="text-body-md font-medium">
					{t("campaigns.identity.readOnlyTitle")}
				</p>
				<p className="text-body-md text-muted-foreground">
					{t("campaigns.identity.readOnly")}
				</p>
			</div>
		</div>
	);
}

type RegionProps = {
	status: CampaignStatus;
	children: ReactNode;
};

/**
 * Locks the step when the Campaign is not a draft or returned for changes:
 * a notice on top, and the fields inert and without their action buttons.
 */
export function CampaignEditableRegion({ status, children }: RegionProps) {
	const isEditable = isCampaignEditable(status);
	return (
		<>
			<CampaignReadOnlyNotice status={status} />
			<div
				data-read-only={isEditable ? undefined : ""}
				inert={isEditable ? undefined : true}
			>
				{children}
			</div>
		</>
	);
}
