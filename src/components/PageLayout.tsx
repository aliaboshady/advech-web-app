import { twMerge } from "tailwind-merge";
import Breadcrumb, { BreadcrumbItem } from "./Breadcrumb";

type Props = {
	title?: string;
	breadcrumbs?: BreadcrumbItem[];
	className?: string;
	children: React.ReactNode;
};

export function PageLayout({ title, breadcrumbs, children, className }: Props) {
	return (
		<div className="@container/pageLayout flex w-full flex-col items-center p-4">
			<div className="w-full mb-4">
				{breadcrumbs ? (
					<Breadcrumb breadcrumbs={breadcrumbs} />
				) : (
					<p className="w-full text-xl font-semibold">{title}</p>
				)}
			</div>

			<div className={twMerge("w-full flex flex-col", className)}>
				{children}
			</div>
		</div>
	);
}
