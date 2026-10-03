import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import noData from "@/assets/no-data-amico.svg";

type Props = {
	className?: string;
	/** Defaults to "Nothing here yet". */
	title?: string;
	/** Defaults to "There is no data to show." Say what to do next when you can. */
	description?: string;
	/** Optional call to action, usually a primary Button. */
	action?: React.ReactNode;
};

/** The one empty state: illustration, title, description and an optional action. */
const NoDataFound = ({ className, title, description, action }: Props) => {
	const { t } = useTranslation();
	return (
		<div
			className={twMerge(
				"flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-center",
				className,
			)}
		>
			<img
				src={noData}
				alt=""
				className="mb-2 w-48 max-w-full object-contain"
			/>
			<p className="text-body-lg font-medium">
				{title ?? t("common.noDataTitle")}
			</p>
			<p className="max-w-sm text-body-md text-muted-foreground">
				{description ?? t("common.noDataDescription")}
			</p>
			{action ? <div className="mt-2">{action}</div> : null}
		</div>
	);
};

export default NoDataFound;
