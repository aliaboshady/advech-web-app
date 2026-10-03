import { CheckCircle2Icon, MinusCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import NoDataFound from "@/components/NoDataFound";
import DataTable, { Column } from "@/components/Table/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LookupEntry } from "../lookup-entry";
import {
	isTimeOfDay,
	SCHEDULE_WEEKDAYS,
	windowCrossesMidnight,
} from "../schedule-window";

type LookupEntryTableProps = {
	readonly entries: readonly LookupEntry[];
	readonly isLoading: boolean;
	readonly isUpdating: boolean;
	readonly showWindow: boolean;
	readonly onEdit: (entry: LookupEntry) => void;
	readonly onSetActive: (entry: LookupEntry, isActive: boolean) => void;
	/** Shown in the empty state, usually the "Add entry" button. */
	readonly emptyAction?: React.ReactNode;
};

function ScheduleWindowCell({ entry }: { readonly entry: LookupEntry }) {
	const { t } = useTranslation();
	const days = entry.days ?? [];
	const startTime = entry.startTime ?? "";
	const endTime = entry.endTime ?? "";
	const labels = SCHEDULE_WEEKDAYS.filter((weekday) =>
		days.includes(weekday.day),
	)
		.map((weekday) => t(weekday.labelKey))
		.join(", ");
	const crossesMidnight =
		isTimeOfDay(startTime) &&
		isTimeOfDay(endTime) &&
		windowCrossesMidnight({ startTime, endTime });
	return (
		<div className="flex w-44 flex-col gap-1 text-wrap">
			<span>
				{labels}{" "}
				<span dir="ltr">
					{startTime}–{endTime}
				</span>
			</span>
			{crossesMidnight ? (
				<span className="text-body-md text-muted-foreground">
					{t("admin.lookups.crossesMidnight")}
				</span>
			) : null}
		</div>
	);
}

/** Active or Inactive, always with a label and icon so colour is never the only cue. */
function ActiveBadge({ isActive }: { readonly isActive: boolean }) {
	const { t } = useTranslation();
	if (isActive) {
		return (
			<Badge variant="success">
				<CheckCircle2Icon aria-hidden="true" />
				{t("admin.lookups.active")}
			</Badge>
		);
	}
	return (
		<Badge variant="outline" className="text-muted-foreground">
			<MinusCircleIcon aria-hidden="true" />
			{t("admin.lookups.inactive")}
		</Badge>
	);
}

/** Every entry in one Lookup. Inactive entries are muted and carry an Inactive badge. */
export function LookupEntryTable({
	entries,
	isLoading,
	isUpdating,
	showWindow,
	onEdit,
	onSetActive,
	emptyAction,
}: LookupEntryTableProps) {
	const { t } = useTranslation();
	if (!isLoading && entries.length === 0) {
		return (
			<NoDataFound
				title={t("admin.lookups.empty")}
				description={t("admin.lookups.emptyDescription")}
				action={emptyAction}
			/>
		);
	}
	const columns: Column[] = [
		{
			header: () => t("admin.lookups.columns.code"),
			value: (entry: LookupEntry) => <span dir="ltr">{entry.code}</span>,
			cellClassName: "font-normal",
		},
		{
			header: () => t("admin.lookups.columns.name"),
			value: (entry: LookupEntry) => entry.name,
		},
		{
			header: () => t("admin.lookups.columns.description"),
			value: (entry: LookupEntry) => (
				<span className="block w-44 text-wrap">{entry.description}</span>
			),
			cellClassName: "font-normal",
		},
		...(showWindow
			? [
					{
						header: () => t("admin.lookups.columns.window"),
						value: (entry: LookupEntry) => <ScheduleWindowCell entry={entry} />,
						cellClassName: "font-normal",
					},
				]
			: []),
		{
			header: () => t("admin.lookups.columns.sortOrder"),
			value: (entry: LookupEntry) => entry.sortOrder,
			cellClassName: "font-normal",
		},
		{
			header: () => t("admin.lookups.columns.status"),
			value: (entry: LookupEntry) => <ActiveBadge isActive={entry.isActive} />,
		},
		{
			header: () => t("admin.lookups.columns.actions"),
			value: (entry: LookupEntry) => (
				<div className="flex gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => onEdit(entry)}
					>
						{t("common.edit")}
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={isUpdating}
						onClick={() => onSetActive(entry, !entry.isActive)}
					>
						{entry.isActive
							? t("admin.lookups.deactivate")
							: t("admin.lookups.activate")}
					</Button>
				</div>
			),
		},
	];
	return (
		<DataTable
			className="rounded-none border-0"
			rowClassName={(entry: LookupEntry) =>
				entry.isActive
					? undefined
					: "bg-muted/40 [&>td:not(:last-child)]:text-muted-foreground"
			}
			items={[...entries]}
			columns={columns}
			loading={isLoading}
		/>
	);
}
