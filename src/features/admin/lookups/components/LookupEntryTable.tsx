import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
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
		<div className="flex flex-col gap-1">
			<span dir="ltr">
				{labels} {startTime}–{endTime}
			</span>
			{crossesMidnight ? (
				<span className="text-xs">{t("admin.lookups.crossesMidnight")}</span>
			) : null}
		</div>
	);
}

/** Every entry in one Lookup, with inactive ones marked. */
export function LookupEntryTable({
	entries,
	isLoading,
	isUpdating,
	showWindow,
	onEdit,
	onSetActive,
}: LookupEntryTableProps) {
	const { t } = useTranslation();
	if (isLoading && entries.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				{t("admin.lookups.loading")}
			</p>
		);
	}
	if (entries.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				{t("admin.lookups.empty")}
			</p>
		);
	}
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>{t("admin.lookups.columns.code")}</TableHead>
					<TableHead>{t("admin.lookups.columns.name")}</TableHead>
					<TableHead>{t("admin.lookups.columns.description")}</TableHead>
					{showWindow ? (
						<TableHead>{t("admin.lookups.columns.window")}</TableHead>
					) : null}
					<TableHead>{t("admin.lookups.columns.sortOrder")}</TableHead>
					<TableHead>{t("admin.lookups.columns.status")}</TableHead>
					<TableHead>{t("admin.lookups.columns.actions")}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{entries.map((entry) => (
					<TableRow
						key={entry.code}
						className={entry.isActive ? undefined : "text-muted-foreground"}
					>
						<TableCell className="font-mono text-xs" dir="ltr">
							{entry.code}
						</TableCell>
						<TableCell>{entry.name}</TableCell>
						<TableCell className="max-w-64 truncate">
							{entry.description}
						</TableCell>
						{showWindow ? (
							<TableCell>
								<ScheduleWindowCell entry={entry} />
							</TableCell>
						) : null}
						<TableCell>{entry.sortOrder}</TableCell>
						<TableCell>
							{entry.isActive ? (
								t("admin.lookups.active")
							) : (
								<Badge variant="outline">{t("admin.lookups.inactive")}</Badge>
							)}
						</TableCell>
						<TableCell>
							<div className="flex flex-wrap gap-2">
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
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
