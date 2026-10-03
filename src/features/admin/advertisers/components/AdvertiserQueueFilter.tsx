import { SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import Dropdown from "@/components/Inputs/Dropdown";
import TextInput from "@/components/Inputs/TextInput";
import { Item } from "@/types";
import {
	ADVERTISER_QUEUE_ALL,
	ADVERTISER_STATUSES,
	AdvertiserQueueStatusFilter,
} from "../advertiser-summary";

const statusItems: Item[] = [
	{
		value: ADVERTISER_QUEUE_ALL,
		label: "admin.advertisers.statuses.ALL",
	},
	...ADVERTISER_STATUSES.map((status) => ({
		value: status,
		label: `admin.advertisers.statuses.${status}`,
	})),
];

type AdvertiserQueueFilterProps = {
	readonly search: string;
	readonly onSearchChange: (search: string) => void;
	readonly status: AdvertiserQueueStatusFilter;
	readonly onStatusChange: (status: AdvertiserQueueStatusFilter) => void;
};

function isQueueStatus(value: string): value is AdvertiserQueueStatusFilter {
	if (value === ADVERTISER_QUEUE_ALL) {
		return true;
	}
	return (ADVERTISER_STATUSES as readonly string[]).includes(value);
}

/** Status filter and search for the Advertiser review queue. */
export function AdvertiserQueueFilter({
	search,
	onSearchChange,
	status,
	onStatusChange,
}: AdvertiserQueueFilterProps) {
	const { t } = useTranslation();
	const changeStatus = (value: string): void => {
		if (isQueueStatus(value)) {
			onStatusChange(value);
		}
	};
	return (
		<div className="flex w-full flex-col gap-2 @lg/pageLayout:flex-row">
			<TextInput
				className="w-full @lg/pageLayout:w-1/2"
				placeholder={t("admin.advertisers.search")}
				value={search}
				setValue={onSearchChange}
				icon={<SearchIcon size={15} className="text-muted-foreground" />}
			/>
			<Dropdown
				items={statusItems}
				selected={status}
				setSelected={changeStatus}
				placeholder="admin.advertisers.statuses.ALL"
				className="w-full @lg/pageLayout:w-1/4"
			/>
		</div>
	);
}
