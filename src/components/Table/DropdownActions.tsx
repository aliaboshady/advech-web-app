import {
	ChevronDownIcon,
	EllipsisVerticalIcon,
	LoaderIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DropdownActionDialogProps<T, Extra extends object = object> = {
	open: boolean;
	setOpen: (val: boolean) => void;
	item?: T;
	onAction?: (item: T) => void;
	closeOnAction?: boolean;
} & Extra;

export type DropdownAction<T = any> = {
	label: string;
	icon?: React.ReactNode;
	href?: string | ((item?: T) => string);
	onAction?: (item: T) => void;
	dialog?: React.ComponentType<any>;
	isDisabled?: boolean | ((item: T) => boolean);
	props?: Omit<DropdownActionDialogProps<any>, "open" | "setOpen" | "item"> &
		Record<string, any>;
};

type Props = {
	dropdownActions: DropdownAction[];
	item: any;
	label?: string;
	className?: string;
	disabled?: boolean;
};

export default function DropdownActions({
	dropdownActions,
	item,
	label,
	className,
	disabled = false,
}: Props) {
	const extractedActions = Array.isArray(dropdownActions)
		? dropdownActions
		: [];

	const [open, setOpen] = useState<boolean[]>(
		Array(extractedActions.length).fill(false),
	);
	const [loading, setLoading] = useState<boolean[]>(
		Array(extractedActions.length).fill(false),
	);

	const handleOnAction = async (
		setting: DropdownAction,
		settingIndex: number,
	) => {
		setLoading((prev) =>
			prev.map((val, i) => (i === settingIndex ? true : val)),
		);
		await setting?.onAction?.(item);
		setLoading((prev) =>
			prev.map((val, i) => (i === settingIndex ? false : val)),
		);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger disabled={disabled} asChild>
					{label ? (
						<Button
							variant="outline"
							className={twMerge(
								"relative group min-h-12 h-fit shadow-none max-w-full min-w-0 justify-between outline-none font-normal border-2 border-border bg-background text-foreground focus-visible:outline-none focus-visible:ring-0",
								className,
							)}
						>
							{label}

							<ChevronDownIcon
								className="fill-primary ms-2 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180"
								aria-hidden="true"
							/>
						</Button>
					) : (
						<Button
							variant="ghost"
							className="text-muted-foreground font-medium bg-transparent hover:bg-muted focus:outline-none focus-visible:outline-none"
						>
							<EllipsisVerticalIcon className="w-5! h-5! font-bold" />
						</Button>
					)}
				</DropdownMenuTrigger>

				<DropdownMenuContent className="w-max min-w-(--radix-dropdown-menu-trigger-width) border-border bg-popover text-popover-foreground">
					<DropdownMenuRadioGroup>
						{extractedActions.map((setting, settingIndex) => {
							const isDisabled =
								typeof setting.isDisabled === "function"
									? setting.isDisabled(item)
									: (setting.isDisabled ?? false);

							return (
								<DropdownMenuItem
									key={settingIndex}
									className="rtl:justify-end whitespace-nowrap"
									disabled={loading[settingIndex] || isDisabled}
									onClick={
										isDisabled
											? undefined
											: setting?.onAction
												? () => handleOnAction(setting, settingIndex)
												: !setting?.href
													? () =>
															setOpen((prev) =>
																prev.map((val, i) =>
																	i === settingIndex ? true : val,
																),
															)
													: undefined
									}
								>
									{setting?.href ? (
										<Link
											href={
												typeof setting?.href === "string"
													? setting?.href
													: setting?.href(item)
											}
											className="flex flex-row gap-1.5 whitespace-nowrap"
										>
											{loading[settingIndex] ? (
												<LoaderIcon className="animate-spin fill-primary" />
											) : (
												setting?.icon
											)}
											{setting?.label}
										</Link>
									) : (
										<>
											{loading[settingIndex] ? (
												<LoaderIcon className="animate-spin fill-primary" />
											) : (
												setting?.icon
											)}
											{setting?.label}
										</>
									)}
								</DropdownMenuItem>
							);
						})}
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>

			{extractedActions.map((setting, i) => {
				const DialogComponent = setting.dialog;
				return (
					open[i] &&
					DialogComponent && (
						<DialogComponent
							key={i}
							open={open[i]}
							setOpen={(val: boolean) =>
								setOpen((prev) => prev.map((v, j) => (j === i ? val : v)))
							}
							item={item}
							{...setting.props}
						/>
					)
				);
			})}
		</>
	);
}
