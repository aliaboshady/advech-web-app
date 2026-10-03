import { twMerge } from "tailwind-merge";
import Breadcrumb, { BreadcrumbItem } from "./Breadcrumb";

type Props = {
	title?: string;
	/** One line under the title that says what the page is for. */
	description?: string;
	/** Page-level buttons, shown at the end of the header row. */
	actions?: React.ReactNode;
	breadcrumbs?: BreadcrumbItem[];
	className?: string;
	children?: React.ReactNode;
};

/**
 * The frame every private page sits in: breadcrumbs or title, description and
 * actions in one header, then the body. Gutters come from the page spacing
 * scale (`p-page`, see DESIGN.md).
 */
export function PageLayout({
	title,
	description,
	actions,
	breadcrumbs,
	children,
	className,
}: Props) {
	return (
		<div className="@container/pageLayout flex w-full flex-col items-center p-page">
			<header className="mb-stack flex w-full flex-wrap items-start justify-between gap-x-4 gap-y-3">
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					{breadcrumbs ? <Breadcrumb breadcrumbs={breadcrumbs} /> : null}
					{title ? (
						<h1 className="text-headline-md md:text-headline-lg">{title}</h1>
					) : null}
					{description ? (
						<p className="text-body-md text-muted-foreground">{description}</p>
					) : null}
				</div>
				{actions ? (
					<div className="flex flex-wrap items-center gap-2">{actions}</div>
				) : null}
			</header>

			<div className={twMerge("w-full flex flex-col", className)}>
				{children}
			</div>
		</div>
	);
}
