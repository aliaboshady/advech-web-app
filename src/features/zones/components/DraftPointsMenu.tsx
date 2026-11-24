import { ChevronDownIcon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DraftPoint, draftPointLabel } from "../draft-point";
import { RadiusMetersInput } from "./RadiusMetersInput";

type Props = {
	points: DraftPoint[];
	onSelect: (point: DraftPoint) => void;
	onRadiusChange: (id: string, radiusMeters: number) => void;
	onRemove: (id: string) => void;
	onHover: (id: string | null) => void;
};

/**
 * The dropped points, each with its radius and a remove button. Hovering a row
 * highlights its pin on the map; choosing a row moves the map to it.
 */
export function DraftPointsMenu({
	points,
	onSelect,
	onRadiusChange,
	onRemove,
	onHover,
}: Props) {
	const { t } = useTranslation();
	return (
		<DropdownMenu
			// A closed menu must not leave a pin highlighted.
			onOpenChange={(open) => {
				if (!open) {
					onHover(null);
				}
			}}
		>
			<DropdownMenuTrigger asChild disabled={points.length === 0}>
				<Button
					type="button"
					variant="outline"
					className="h-auto shrink-0 bg-card py-2.5 text-body-md font-normal shadow-sm"
				>
					{t("campaigns.targeting.pointsCount", { count: points.length })}
					<ChevronDownIcon aria-hidden className="text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-88 max-w-[90vw]">
				{points.map((point) => {
					const label = draftPointLabel(point);
					const detail =
						point.address && point.address !== label
							? point.address
							: undefined;
					return (
						<div
							key={point.id}
							role="group"
							aria-label={label}
							className="flex items-center gap-2 px-1"
							onMouseEnter={() => onHover(point.id)}
							onMouseLeave={() => onHover(null)}
						>
							<RadiusMetersInput
								label={t("campaigns.targeting.radiusFor", { place: label })}
								radiusMeters={point.radiusMeters}
								onRadiusChange={(radiusMeters) =>
									onRadiusChange(point.id, radiusMeters)
								}
							/>
							<DropdownMenuItem
								className="min-w-0 flex-1 flex-col items-start gap-0"
								onSelect={() => onSelect(point)}
							>
								<span className="w-full truncate text-body-md font-medium">
									{label}
								</span>
								{detail ? (
									<span className="w-full truncate text-body-md text-muted-foreground">
										{detail}
									</span>
								) : null}
							</DropdownMenuItem>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label={t("campaigns.targeting.removePoint", {
									place: label,
								})}
								className="size-8 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
								onClick={(event) => {
									event.stopPropagation();
									onHover(null);
									onRemove(point.id);
								}}
							>
								<XIcon aria-hidden />
							</Button>
						</div>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
