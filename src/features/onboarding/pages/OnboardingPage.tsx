import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { LoadErrorState } from "@/components/LoadErrorState";
import { Button } from "@/components/ui/button";
import { OnboardingStatusScreen } from "../components/OnboardingStatusScreen";
import { clearCachedOnboarding } from "../load-cached-onboarding";
import { onboardingViewFor } from "../onboarding-view";
import type { OnboardingState } from "../types";

type Props = {
	/** Null when the state could not be loaded. */
	onboarding: OnboardingState | null;
};

/** One URL. The Advertiser's status picks what it shows. */
export function OnboardingPage({ onboarding }: Props) {
	const { t } = useTranslation();
	const router = useRouter();
	if (onboarding === null) {
		return (
			<LoadErrorState
				description={t("onboarding.loadError.description")}
				action={
					<Button
						variant="outline"
						onClick={() => {
							clearCachedOnboarding();
							void router.invalidate();
						}}
					>
						{t("onboarding.loadError.retry")}
					</Button>
				}
			/>
		);
	}
	const view = onboardingViewFor(onboarding.status);
	if (view === null) {
		return null;
	}
	if (view === "wizard") {
		return (
			<header className="flex flex-col gap-1">
				<h1 className="text-headline-md">{t("onboarding.wizard.title")}</h1>
				<p className="text-body-md text-muted-foreground">
					{t("onboarding.wizard.description")}
				</p>
			</header>
		);
	}
	return (
		<OnboardingStatusScreen
			view={view}
			reviewReason={onboarding.reviewReason}
		/>
	);
}
