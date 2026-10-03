import { BanIcon, ClockIcon, XCircleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { OnboardingView } from "../onboarding-view";

type StatusView = Exclude<OnboardingView, "wizard">;

const ICONS = {
	waiting: ClockIcon,
	rejected: XCircleIcon,
	suspended: BanIcon,
} as const satisfies Record<StatusView, unknown>;

type Props = {
	view: StatusView;
	/** The Admin's note; shown on the rejected screen. */
	reviewReason: string | null;
};

/** A locked status: a message and nothing to edit. Logout lives in the shell. */
export function OnboardingStatusScreen({ view, reviewReason }: Props) {
	const { t } = useTranslation();
	const Icon = ICONS[view];
	return (
		<section className="flex flex-col items-center gap-stack rounded-lg border border-border bg-card px-4 py-10 text-center text-card-foreground">
			<span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
				<Icon aria-hidden="true" className="size-6" />
			</span>
			<h1 className="text-headline-md">{t(`onboarding.${view}.title`)}</h1>
			<p className="max-w-md text-body-md text-muted-foreground">
				{t(`onboarding.${view}.description`)}
			</p>
			{view === "rejected" && reviewReason ? (
				<div className="w-full max-w-md rounded-md bg-muted p-3 text-start text-body-md">
					<p className="text-label-caps text-muted-foreground">
						{t("onboarding.rejected.reasonLabel")}
					</p>
					<p className="mt-1 whitespace-pre-wrap">{reviewReason}</p>
				</div>
			) : null}
		</section>
	);
}
