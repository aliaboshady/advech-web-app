import { AlertCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

/** The Admin's request for changes, shown above the unlocked cards. */
export function ReviewReasonNotice({ reason }: { reason: string | null }) {
	const { t } = useTranslation();
	return (
		<section
			role="alert"
			className="flex gap-3 rounded-lg bg-warning-soft p-4 text-warning-soft-foreground"
		>
			<AlertCircleIcon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
			<div className="flex min-w-0 flex-col gap-1">
				<h2 className="text-body-lg font-medium">
					{t("onboarding.needsChanges.title")}
				</h2>
				<p className="text-body-md">
					{t("onboarding.needsChanges.description")}
				</p>
				{reason ? (
					<p className="mt-1 whitespace-pre-wrap text-body-md">{reason}</p>
				) : null}
			</div>
		</section>
	);
}
