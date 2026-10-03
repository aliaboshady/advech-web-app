import { cn } from "@/lib/utils";

type Props = Omit<React.ComponentProps<"section">, "title"> & {
	title: React.ReactNode;
	description?: React.ReactNode;
	/** Buttons shown at the end of the section header. */
	actions?: React.ReactNode;
	/** Row below the fields, e.g. a save button. */
	footer?: React.ReactNode;
};

/**
 * A titled group of related form fields. Fields stack on narrow screens and
 * sit in two columns from the `md` container up. Stack several in a form with
 * `gap-section`. Flat: no shadow, no glass.
 */
export function FormSectionCard({
	title,
	description,
	actions,
	footer,
	className,
	children,
	...props
}: Props) {
	return (
		<section
			data-slot="form-section-card"
			className={cn(
				"@container/formSection flex w-full flex-col rounded-lg border border-border bg-card text-card-foreground",
				className,
			)}
			{...props}
		>
			<div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-4">
				<div className="flex min-w-0 flex-col gap-1">
					<h2 className="text-body-lg font-medium">{title}</h2>
					{description ? (
						<p className="text-body-md text-muted-foreground">{description}</p>
					) : null}
				</div>
				{actions ? (
					<div className="flex flex-wrap items-center gap-2">{actions}</div>
				) : null}
			</div>
			<div className="grid grid-cols-1 gap-stack p-4 @md/formSection:grid-cols-2">
				{children}
			</div>
			{footer ? (
				<div className="flex flex-wrap items-center justify-end gap-2 border-t border-border p-4">
					{footer}
				</div>
			) : null}
		</section>
	);
}
