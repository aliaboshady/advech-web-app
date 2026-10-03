import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { DatePicker } from "@/components/Inputs/DatePicker";
import Dropdown from "@/components/Inputs/Dropdown";
import TextInput from "@/components/Inputs/TextInput";
import { CampaignStatus, campaignStatusItems } from "../types";

type Props = {
	search?: string;
	setSearch?: (val: string) => void;
	date?: DateRange;
	setDate?: (val: DateRange) => void;
	statuses: CampaignStatus[];
	setStatuses: (val: CampaignStatus[]) => void;
};

const Filter = ({
	search,
	setSearch,
	date,
	setDate,
	statuses,
	setStatuses,
}: Props) => {
	const { t } = useTranslation();
	const [openAssessmentDialog, setOpenAssessmentDialog] = useState(false);

	return (
		<>
			<div className="w-full flex flex-col @lg/pageLayout:flex-row gap-2">
				<TextInput
					className="w-full @lg/pageLayout:w-1/2 @5xl/pageLayout:w-1/2"
					placeholder={t("search")}
					value={search}
					setValue={setSearch}
					icon={<SearchIcon size={15} className="text-muted-foreground" />}
				/>

				<DatePicker
					mode="range"
					localTime
					date={date}
					setDate={setDate}
					className="w-full @lg/pageLayout:w-1/4 @5xl/pageLayout:w-1/4"
				/>

				<Dropdown
					items={campaignStatusItems}
					selected={statuses}
					placeholder="campaigns.table.statusPlaceholder"
					setSelected={setStatuses as (val: string[]) => void}
					multiSelect
					className="w-full @lg/pageLayout:w-1/4 @5xl/pageLayout:w-1/4"
				/>
			</div>

			{/* <SendAssessmentsDialog
				open={openAssessmentDialog}
				setOpen={setOpenAssessmentDialog}
				item={selectedRows}
				onAction={onSendAssessment}
				closeOnAction
			/> */}
		</>
	);
};

export default Filter;
