import { ChevronDownIcon, ChevronsUpDownIcon, LoaderIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PaginatedResponse, SortType } from "@/types";
import NoDataFound from "../NoDataFound";
import DropdownActions, { DropdownAction } from "./DropdownActions";
import Pagination from "./Pagination";
import { TableSkeletonRows } from "./TableSkeletonRows";

export type Column = {
	header: (item: any) => React.ReactNode;
	value: (item: any) => React.ReactNode;
	sortKey?: string;
	headerClassName?: string;
	cellClassName?: string;
};

type Props = {
	items: any[];
	columns: Column[];
	selection?: boolean;
	setSelectedRows?: (val: string[]) => void;
	sortBy?: string;
	setSortBy?: (val: string) => void;
	sortType?: SortType;
	setSortType?: (val: SortType) => void;
	page?: number;
	setPage?: (val: number) => void;
	itemsPerPage?: number;
	setItemsPerPage?: (val: number) => void;
	dataPagination?: PaginatedResponse<any>;
	dropdownActions?: DropdownAction[];
	loading?: boolean;
	className?: string;
};

const DataTable = ({
	items,
	columns,
	selection,
	setSelectedRows,
	sortBy,
	setSortBy,
	sortType,
	setSortType,
	page,
	setPage,
	itemsPerPage,
	setItemsPerPage,
	dataPagination,
	dropdownActions,
	loading,
	className,
}: Props) => {
	const { t } = useTranslation();
	const [selectedAll, setSelectedAll] = useState<"indeterminate" | boolean>(
		false,
	);
	const [selected, setSelected] = useState<string[]>([]);

	const checkSelectionState = (currentSelected: string[]) => {
		if (!items) {
			setSelectedAll(false);
			return;
		}

		const allIds = items.map((item) => String(item.id));
		if (
			allIds.length > 0 &&
			allIds.every((id) => currentSelected.includes(id))
		) {
			setSelectedAll(true);
		} else if (currentSelected.length === 0) {
			setSelectedAll(false);
		} else {
			setSelectedAll("indeterminate");
		}
	};

	const handleSelectAllRows = (checked: boolean) => {
		if (checked) {
			const allIds = items.map((item) => String(item.id));
			setSelected(allIds);
			setSelectedAll(true);
		} else {
			setSelected([]);
			setSelectedAll(false);
		}
	};

	const handleSelectRow = (id: string, checked: boolean) => {
		setSelected((currentSelected) => {
			const newSelected = checked
				? [...currentSelected, id]
				: currentSelected.filter((item) => item !== id);

			checkSelectionState(newSelected);

			return newSelected;
		});
	};

	const handleSort = (sortKey: string | undefined) => {
		if (!sortKey) return;
		if (sortBy === sortKey) {
			setSortType?.(sortType === "asc" ? "desc" : "asc");
		} else {
			setSortBy?.(sortKey);
			setSortType?.("desc");
		}
	};

	useEffect(() => {
		setSelectedRows?.(selected || []);
	}, [selected]);

	useEffect(() => {
		checkSelectionState(selected);
	}, [items]);

	const isEmpty = !items || items.length <= 0;

	return (
		<div
			aria-busy={loading || undefined}
			className={twMerge(
				"relative w-full h-full flex flex-col justify-between border border-border rounded-lg overflow-hidden bg-card",
				className,
			)}
		>
			<div className="min-h-0 flex-1 overflow-auto">
				<Table>
					<TableHeader className="bg-muted h-12 sticky top-0 z-10">
						<TableRow className="border-border/60">
							{selection && (
								<TableHead className="w-10 h-10 ps-2! text-center text-foreground">
									<Checkbox
										checked={selectedAll}
										onCheckedChange={handleSelectAllRows}
									/>
								</TableHead>
							)}
							{columns.map((column, i) => (
								<TableHead
									key={i}
									className={twMerge(
										`w-24 text-foreground text-nowrap ps-5 ${
											sortBy && sortBy === column.sortKey
												? "font-semibold"
												: "font-normal"
										}`,
										column.headerClassName,
									)}
								>
									<button
										type="button"
										disabled={!column.sortKey}
										onClick={() => handleSort(column.sortKey)}
										className="w-full h-full flex items-center gap-2 text-foreground/80 hover:text-foreground"
									>
										{column.header(column)}

										{column.sortKey ? (
											sortBy && sortBy === column.sortKey ? (
												<ChevronDownIcon
													className={`w-4 h-4 text-current transition-transform ${
														sortType === "desc" ? "rotate-0" : "rotate-180"
													}`}
												/>
											) : (
												<ChevronsUpDownIcon
													className={`w-3 h-3 text-current transition-transform ${
														sortType === "desc" ? "rotate-0" : "rotate-180"
													}`}
												/>
											)
										) : null}
									</button>
								</TableHead>
							))}

							{dropdownActions && (
								<TableHead className="w-20 text-muted-foreground text-nowrap" />
							)}
						</TableRow>
					</TableHeader>

					<TableBody>
						{loading && isEmpty && (
							<TableSkeletonRows
								columns={
									columns.length +
									(selection ? 1 : 0) +
									(dropdownActions ? 1 : 0)
								}
							/>
						)}
						{items?.map((item, i) => (
							<TableRow key={i} className="border-border/60 hover:bg-muted/60">
								{selection && (
									<TableCell className="w-10 h-10 ps-2! text-center text-foreground">
										<Checkbox
											id={item.id}
											checked={selected.includes(item.id)}
											onCheckedChange={(checked) =>
												handleSelectRow(item.id, checked as boolean)
											}
										/>
									</TableCell>
								)}

								{columns.map((column, i) => (
									<TableCell
										key={i}
										className={twMerge(
											"text-nowrap font-medium ps-5 text-foreground",
											column.cellClassName,
										)}
									>
										{column.value(item)}
									</TableCell>
								))}

								{dropdownActions && (
									<TableCell>
										<DropdownActions
											dropdownActions={dropdownActions}
											item={item}
										/>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>

				{!loading && isEmpty && <NoDataFound />}
			</div>

			<div className="w-full p-4 flex justify-center sm:justify-end items-center">
				{/* {selection && <div className="text-sm">Selected {selected.length}</div>} */}

				{page && setPage && dataPagination && (
					<Pagination
						currentPage={page}
						setPage={setPage}
						dataPagination={dataPagination}
						itemsPerPage={itemsPerPage}
						setItemsPerPage={setItemsPerPage}
					/>
				)}
			</div>

			{loading && !isEmpty && (
				<div
					role="status"
					className="absolute inset-0 flex items-center justify-center bg-background/70"
				>
					<LoaderIcon
						aria-hidden="true"
						className="size-6 animate-spin text-primary"
					/>
					<span className="sr-only">{t("common.loading")}</span>
				</div>
			)}
		</div>
	);
};

export default DataTable;
