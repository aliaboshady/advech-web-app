import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";

export type BreadcrumbItem = {
	label: string;
	link?: string;
};

type Props = {
	breadcrumbs: BreadcrumbItem[];
};

const Breadcrumb = ({ breadcrumbs }: Props) => {
	const { t } = useTranslation();
	return (
		<nav
			aria-label={t("common.breadcrumb")}
			className="flex w-full flex-row items-center"
		>
			{breadcrumbs?.map((breadcrumb, i) => (
				<Fragment key={i}>
					{i < breadcrumbs.length - 1 && breadcrumb.link ? (
						<Link
							to={breadcrumb.link || ""}
							className="text-body-md text-nowrap text-muted-foreground underline underline-offset-2 hover:text-foreground"
						>
							{breadcrumb?.label}
						</Link>
					) : (
						<p
							className={`text-body-md truncate text-nowrap ${
								i === breadcrumbs.length - 1
									? "font-semibold"
									: "text-muted-foreground"
							}`}
						>
							{breadcrumb?.label}
						</p>
					)}

					{i < breadcrumbs.length - 1 && (
						<ChevronRightIcon
							aria-hidden="true"
							className="mx-1 size-4 shrink-0 self-center text-muted-foreground rtl:rotate-180"
						/>
					)}
				</Fragment>
			))}
		</nav>
	);
};

export default Breadcrumb;
