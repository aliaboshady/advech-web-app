import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = Omit<ComponentProps<typeof Button>, "variant"> & {
	selected: boolean;
};

/**
 * A button that picks one option (or toggles one). Selected is neutral
 * emphasis, not orange: orange is reserved for the step's primary action.
 */
export function ChoiceButton({ selected, className, ...props }: Props) {
	return (
		<Button
			type="button"
			variant="outline"
			aria-pressed={selected}
			className={cn(selected && "border-foreground bg-accent", className)}
			{...props}
		/>
	);
}
