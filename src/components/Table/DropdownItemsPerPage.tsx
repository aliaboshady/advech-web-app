import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
	itemsPerPage: number;
	setCurrentItemsPerPage: (val: number) => void;
};

export function DropdownItemsPerPage({
	itemsPerPage,
	setCurrentItemsPerPage,
}: Props) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const itemsPerPageList: Record<string, number> = {
		"10": 10,
		"20": 20,
		"50": 50,
		"100": 100,
	};

	return (
		<DropdownMenu onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild className="pointer-events-auto">
				<Button
					variant="ghost"
					className="p-2 text-white hover:text-white font-medium rounded-md bg-primary hover:bg-primary/80! focus:outline-none focus-visible:outline-none data-[state=open]:bg-primary data-[state=open]:text-white"
				>
					{t(itemsPerPageList[itemsPerPage?.toString()]?.toString() as any)}
					<ChevronDownIcon
						className={`text-white transition-transform ${
							open ? "rotate-180" : ""
						}`}
					/>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={itemsPerPage?.toString()}
					onValueChange={(value) => setCurrentItemsPerPage?.(parseInt(value))}
				>
					{Object.keys(itemsPerPageList).map((item) => (
						<DropdownMenuRadioItem
							key={item}
							value={item}
							className="text-foreground font-medium"
						>
							{t(item as any)}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
