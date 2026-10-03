import { AlertCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";

type Props = {
	className?: string;
	/** Defaults to "Something went wrong". */
	title?: string;
	/** Say what failed in plain words. */
	description: string;
	/** Optional way out, usually a Button that goes back. */
	action?: React.ReactNode;
};

/** The one load-error state, announced to screen readers. Use instead of a bare error line. */
export function LoadErrorState({
	className,
	title,
	description,
	action,
}: Props) {
	const { t } = useTranslation();
	return (
		<div
			role="alert"
			className={twMerge(
				"flex w-full flex-col items-center justify-center gap-2 px-4 py-10 text-center",
				className,
			)}
		>
			<span className="mb-2 flex size-12 items-center justify-center rounded-full bg-destructive-soft text-destructive-soft-foreground">
				<AlertCircleIcon aria-hidden="true" className="size-6" />
			</span>
			<p className="text-body-lg font-medium">
				{title ?? t("common.loadErrorTitle")}
			</p>
			<p className="max-w-sm text-body-md text-muted-foreground">
				{description}
			</p>
			{action ? <div className="mt-2">{action}</div> : null}
		</div>
	);
}
