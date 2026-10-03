import { format } from "date-fns";
import { CalendarDaysIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
	mode?: "single" | "range";
	localTime?: boolean;
	date: Date | DateRange;
	setDate: ((value: Date) => void) | ((value: DateRange) => void);
	className?: string;
	placeholder?: string;
	disabled?: boolean;
}

export function DatePicker({
	mode = "single",
	localTime = false,
	date,
	setDate,
	className,
	placeholder = "PICK_A_DATE",
	disabled = false,
}: Props) {
	const { t } = useTranslation();
	const isRange = mode === "range";

	const displayText = () => {
		if (isRange && date && (date as DateRange).from) {
			const range = date as DateRange;
			if (range.to)
				return `${format(range.from!, "PPP")} - ${format(range.to, "PPP")}`;
			return format(range.from!, "PPP");
		} else if (!isRange && date instanceof Date) {
			return format(date, "PPP");
		}
		return placeholder;
	};

	const toUtcDateOnly = (date: Date): Date => {
		return new Date(
			Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
		);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					type="button"
					disabled={disabled}
					className={cn(
						"h-9 cursor-pointer border justify-between items-center text-xs font-normal",
						!date && "text-muted-foreground",
						className,
					)}
				>
					<p className="truncate">{t(displayText() as any)}</p>
					<CalendarDaysIcon />
				</Button>
			</PopoverTrigger>

			<PopoverContent dir="ltr" className="w-auto p-0" align="start">
				{isRange ? (
					<Calendar
						mode="range"
						selected={date as DateRange}
						onSelect={(val) => {
							if (!val) {
								setDate(val as any);
								return;
							}

							if (localTime) {
								setDate({
									from: val.from ? toUtcDateOnly(val.from) : undefined,
									to: val.to ? toUtcDateOnly(val.to) : undefined,
								} as any);
							} else {
								setDate(val as any);
							}
						}}
						captionLayout="dropdown"
						classNames={{ today: "bg-secondary/50 rounded-md text-primary" }}
					/>
				) : (
					<Calendar
						mode="single"
						selected={date as Date}
						onSelect={(val) => {
							if (!val) return;

							setDate((localTime ? toUtcDateOnly(val) : val) as any);
						}}
						captionLayout="dropdown"
						classNames={{ today: "bg-secondary/50 rounded-md text-primary" }}
					/>
				)}
			</PopoverContent>
		</Popover>
	);
}
