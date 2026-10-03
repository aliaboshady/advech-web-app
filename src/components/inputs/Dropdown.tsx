import { ChevronDownIcon, LoaderIcon, PlusIcon } from "lucide-react";
import { FocusEventHandler, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Item } from "@/types";
import { MultiSelectValue } from "./MultiSelectValue";

export type DropdownProps = {
	selected: string | string[];
	setSelected: ((val: string) => void) | ((val: string[]) => void);
	items: Item[];
	placeholderValueSingle?: string;
	placeholderValueMulti?: Item[];
	noneOptionValue?: string;
	allOptionValue?: string;
	showNoneOption?: boolean;
	showAllOption?: boolean;
	addNewOption?: boolean;
	addNewOptionOnClick?: () => void;
	className?: string;
	contentClassName?: string;
	placeholder?: string;
	placeholderOnly?: boolean;
	disabled?: boolean;
	onReachTheEnd?: () => void;
	loadingData?: boolean;
	multiSelect?: boolean;
	multiSelectExpandMode?: "countOnly" | "showSome" | "showAll";
	searchable?: boolean;
	searchValue?: string;
	setSearchValue?: (val: string) => void;
	searchPlaceholder?: string;
	onBlur?: FocusEventHandler<HTMLDivElement>;
	error?: string;
};

export default function Dropdown({
	selected,
	setSelected,
	items,
	placeholderValueSingle,
	placeholderValueMulti,
	noneOptionValue = "NONE",
	allOptionValue = "ALL",
	showNoneOption,
	showAllOption,
	addNewOption,
	addNewOptionOnClick,
	className,
	contentClassName,
	placeholder = "SELECT",
	placeholderOnly = false,
	disabled = false,
	onReachTheEnd,
	loadingData = false,
	multiSelect = false,
	multiSelectExpandMode = "countOnly",
	searchable = false,
	searchValue,
	setSearchValue,
	searchPlaceholder = "SEARCH",
	onBlur,
	error,
}: DropdownProps) {
	const { t } = useTranslation();

	useEffect(() => {
		if (multiSelect && placeholderValueMulti) {
			const placeholderMultiValues = placeholderValueMulti.map(
				(item) => item.value,
			);
			const allSelected = [...selected, ...placeholderMultiValues];
			setSelected(allSelected as any);
		}
	}, []);

	const renderSelectedText = () => {
		if (placeholderOnly) return t(placeholder as any);

		// 🧠 If nothing selected, show placeholder (even if showNoneOption is true)
		if (
			!selected ||
			(Array.isArray(selected) &&
				selected.length === 0 &&
				Array.isArray(placeholderValueMulti) &&
				placeholderValueMulti.length === 0)
		) {
			return t(placeholder as any);
		}

		if (multiSelect) {
			const selectedItems = items.filter((item) =>
				selected.includes(item.value),
			);

			let mergedItems = selectedItems;

			if (placeholderValueMulti?.length) {
				mergedItems = [
					...selectedItems,
					...placeholderValueMulti.filter(
						(ph) =>
							!selectedItems.some((si) => si.value === ph.value) &&
							selected.includes(ph.value),
					),
				];
			}

			if (mergedItems.length === 0) {
				return t(placeholder as any);
			}
			return (
				<MultiSelectValue
					items={mergedItems}
					expandMode={multiSelectExpandMode}
					removeSelection={handleSelectMultiple}
				/>
			);
		}

		const selectedItem = items?.find((item) => item.value === selected);

		const selectedValue =
			selectedItem?.labelNode ||
			selectedItem?.label ||
			placeholderValueSingle ||
			selected;

		return typeof selectedValue === "string" ? (
			<p className="truncate">{t(selectedValue as any)}</p>
		) : (
			selectedValue
		);
	};

	const handleSelectMultiple = (item: string) => {
		if (!multiSelect || !Array.isArray(selected)) return;

		const newSelected = selected.includes(item)
			? selected.filter((val) => val !== item)
			: [...selected, item];

		(setSelected as (val: string[]) => void)(newSelected);
	};

	const handleSelectSingle = (value: string) => {
		(setSelected as (val: string) => void)(value);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild disabled={disabled}>
				<Button
					variant="outline"
					className={twMerge(
						`cursor-pointer text-xs relative group min-h-9 h-fit shadow-none max-w-full min-w-0 justify-between outline-none font-normal border focus-visible:outline-none focus-visible:ring-0 ${
							!selected && "text-muted-foreground"
						} ${error ? "border-destructive focus:border-destructive" : ""} `,
						multiSelectExpandMode === "showAll" ? "min-h-9 h-fit" : "",
						className,
					)}
				>
					{renderSelectedText()}

					{loadingData ? (
						<LoaderIcon className="animate-spin fill-primary" />
					) : (
						<ChevronDownIcon
							className="ms-2 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
							aria-hidden="true"
						/>
					)}

					{error && (
						<div className="absolute inset-s-3 bottom-2 translate-y-full px-2 max-w-[calc(100%-2rem)]">
							<div className="absolute bottom-1.5 inset-s-0 inset-e-0 bg-background group-hover:bg-accent h-1 transition-all" />
							<p className="relative text-xs text-destructive font-medium whitespace-nowrap truncate z-10">
								{t(error as any)}
							</p>
						</div>
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				onBlur={onBlur}
				align="start"
				className={twMerge(
					"max-h-72 space-y-1 w-[--radix-dropdown-menu-trigger-width]",
					contentClassName,
				)}
				onScroll={(e) => {
					if (loadingData) return;

					const el = e.currentTarget;
					if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
						onReachTheEnd?.();
					}
				}}
			>
				{/* Search input */}
				{searchable && (
					<div className="p-2">
						<Input
							value={searchValue}
							onChange={(e) => {
								e.preventDefault();
								setSearchValue?.(e.target.value);
							}}
							onKeyDown={(e) => e.stopPropagation()}
							placeholder={t(searchPlaceholder as any)}
							className="w-full"
						/>
					</div>
				)}

				{(showNoneOption || showAllOption) && (
					<>
						<div className="flex flex-row justify-center">
							{/* None option */}
							{showNoneOption && (
								<DropdownMenuItem
									onClick={(e) => {
										// 🧹 Clear selection completely
										if (multiSelect) {
											e.preventDefault();
											(setSelected as (val: string[]) => void)([]);
										} else {
											(setSelected as (val: string) => void)(undefined as any);
										}
									}}
									className={twMerge(
										"w-full justify-center hover:bg-secondary/30! hover:text-primary!",
										(!selected ||
											(Array.isArray(selected) && selected.length === 0)) &&
											"bg-secondary text-primary",
									)}
								>
									{t(noneOptionValue as any)}
								</DropdownMenuItem>
							)}

							{/* ALL Option - only for multi-select */}
							{multiSelect && showAllOption && (
								<DropdownMenuItem
									onClick={(e) => {
										e.preventDefault();
										const allValues = items?.map((item) => item.value);
										(setSelected as (val: string[]) => void)(allValues);
									}}
									className={twMerge(
										"w-full justify-center hover:bg-secondary/30! hover:text-primary!",
										Array.isArray(selected) &&
											selected.length === items?.length &&
											"bg-secondary text-primary",
									)}
								>
									{t(allOptionValue as any)}
								</DropdownMenuItem>
							)}
						</div>

						<DropdownMenuSeparator className="bg-secondary" />
					</>
				)}

				{/* Search input */}
				{addNewOption && (
					<>
						<DropdownMenuItem
							onClick={() => addNewOptionOnClick?.()}
							dir="auto"
							className="w-full justify-center truncate hover:bg-secondary/30! hover:text-primary!"
						>
							<div className="flex flex-row items-center gap-2">
								<p className="truncate">{t("locale:ADD_NEW_OPTION")}</p>
								<PlusIcon />
							</div>
						</DropdownMenuItem>

						<DropdownMenuSeparator className="bg-secondary" />
					</>
				)}

				{/* Multi Select */}
				{multiSelect ? (
					items?.map((item) => {
						const isSelected =
							Array.isArray(selected) && selected.includes(item?.value);

						return (
							<DropdownMenuItem
								key={item?.value}
								dir="auto"
								onSelect={(e) => {
									e.preventDefault();
									handleSelectMultiple(item?.value);
								}}
								className={twMerge(
									"font-medium px-2 py-2 cursor-pointer flex rtl:justify-end hover:bg-secondary/30! hover:text-primary!",
									isSelected ? "bg-secondary text-primary" : "",
								)}
							>
								{item.labelNode ? (
									item.labelNode
								) : (
									<p className="truncate">{t(item.label as any)}</p>
								)}
							</DropdownMenuItem>
						);
					})
				) : (
					<>
						{/* Single Select */}
						{items?.map((item) => (
							<DropdownMenuItem
								key={item.value}
								onClick={() => handleSelectSingle(item.value)}
								dir="auto"
								className={`truncate hover:bg-secondary/30! hover:text-primary! ${
									selected === item.value && "bg-secondary text-primary"
								}`}
							>
								{item.labelNode ? (
									item.labelNode
								) : (
									<p className="truncate">{t(item.label as any)}</p>
								)}
							</DropdownMenuItem>
						))}
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
