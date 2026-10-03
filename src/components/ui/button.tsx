import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const primaryClasses =
	"bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-glow focus-visible:shadow-glow active:bg-primary-hover/90";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				// Primary call to action. The only variant with the glow (hover and
				// keyboard focus), so keep one per view. `default` is the same thing.
				primary: primaryClasses,
				default: primaryClasses,
				outline:
					"border-input bg-background text-foreground shadow-xs hover:bg-accent hover:text-accent-foreground active:bg-accent/70 aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/70 active:bg-secondary/55 aria-expanded:bg-secondary/70",
				ghost:
					"text-foreground hover:bg-accent hover:text-accent-foreground active:bg-accent/70 aria-expanded:bg-accent aria-expanded:text-accent-foreground",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/85 active:bg-destructive/75 focus-visible:border-destructive focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/40",
				link: "text-foreground underline underline-offset-4 hover:text-muted-foreground active:text-muted-foreground/80",
			},
			size: {
				default:
					"h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
				xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5",
				lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
				icon: "size-9",
				"icon-xs":
					"size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
				"icon-sm":
					"size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
