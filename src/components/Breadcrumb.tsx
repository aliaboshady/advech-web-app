import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

export type BreadcrumbItem = {
	label: string;
	link?: string;
};

type Props = {
	breadcrumbs: BreadcrumbItem[];
};

const Breadcrumb = ({ breadcrumbs }: Props) => {
	return (
		<div className="flex flex-row w-full">
			{breadcrumbs?.map((breadcrumb, i) => (
				<Fragment key={i}>
					{i < breadcrumbs.length - 1 && breadcrumb.link ? (
						<Link
							to={breadcrumb.link || ""}
							className="text-xs md:text-base text-nowrap text-neutral-700 underline underline-offset-2"
						>
							{breadcrumb?.label}
						</Link>
					) : (
						<p
							className={`text-xs md:text-base truncate text-nowrap ${
								i === breadcrumbs.length - 1
									? "font-semibold"
									: "text-neutral-700"
							}`}
						>
							{breadcrumb?.label}
						</p>
					)}

					{i < breadcrumbs.length - 1 && <p className="px-2">{">"}</p>}
				</Fragment>
			))}
		</div>
	);
};

export default Breadcrumb;
