import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"group/badge text-label-caps inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 whitespace-nowrap transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
	{
		variants: {
			variant: {
				default: "bg-foreground text-background [a]:hover:bg-foreground/80",
				secondary:
					"bg-secondary text-secondary-foreground [a]:hover:bg-secondary/70",
				destructive:
					"bg-destructive-soft text-destructive-soft-foreground focus-visible:ring-destructive/30 [a]:hover:bg-destructive-soft/70",
				success:
					"bg-success-soft text-success-soft-foreground [a]:hover:bg-success-soft/70",
				warning:
					"bg-warning-soft text-warning-soft-foreground [a]:hover:bg-warning-soft/70",
				info: "bg-info-soft text-info-soft-foreground [a]:hover:bg-info-soft/70",
				outline:
					"border-border text-foreground [a]:hover:bg-accent [a]:hover:text-accent-foreground",
				ghost: "text-foreground hover:bg-accent hover:text-accent-foreground",
				link: "text-foreground underline underline-offset-4 hover:text-muted-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({
	className,
	variant = "default",
	asChild = false,
	...props
}: React.ComponentProps<"span"> &
	VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
	const Comp = asChild ? Slot.Root : "span";

	return (
		<Comp
			data-slot="badge"
			data-variant={variant}
			className={cn(badgeVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Badge, badgeVariants };
