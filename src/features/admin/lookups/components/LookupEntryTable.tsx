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

type LookupEntryTableProps = {
	readonly entries: readonly LookupEntry[];
	readonly isLoading: boolean;
	readonly isUpdating: boolean;
	readonly onEdit: (entry: LookupEntry) => void;
	readonly onSetActive: (entry: LookupEntry, isActive: boolean) => void;
};

/** Every entry in one Lookup, with inactive ones marked. */
export function LookupEntryTable({
	entries,
	isLoading,
	isUpdating,
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
