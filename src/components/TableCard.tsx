import { cn } from "@/lib/utils";

type RootProps = React.ComponentProps<"section">;

/**
 * Flat card that frames a table: optional header and toolbar on top, the
 * table in the middle, an optional footer (pagination) at the bottom.
 * Compose with TableCardHeader, TableCardToolbar and TableCardFooter.
 */
export function TableCard({ className, ...props }: RootProps) {
	return (
		<section
			data-slot="table-card"
			className={cn(
				"flex w-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
				className,
			)}
			{...props}
		/>
	);
}

type HeaderProps = Omit<React.ComponentProps<"div">, "title"> & {
	title: React.ReactNode;
	description?: React.ReactNode;
	/** Buttons shown at the end of the header. */
	actions?: React.ReactNode;
};

export function TableCardHeader({
	title,
	description,
	actions,
	className,
	...props
}: HeaderProps) {
	return (
		<div
			data-slot="table-card-header"
			className={cn(
				"flex flex-wrap items-start justify-between gap-3 border-b border-border p-4",
				className,
			)}
			{...props}
		>
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
	);
}

/** Row for search and filters, between the header and the table. */
export function TableCardToolbar({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="table-card-toolbar"
			className={cn(
				"flex flex-wrap items-center gap-2 border-b border-border p-4",
				className,
			)}
			{...props}
		/>
	);
}

export function TableCardFooter({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="table-card-footer"
			className={cn(
				"flex items-center justify-center border-t border-border p-4 sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}
