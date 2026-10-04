import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FormSectionCard } from "@/components/FormSectionCard";
import { Button } from "@/components/ui/button";
import i18n from "@/i18n";
import { resolveErrorMessage } from "@/lib/error-messages";
import { getAccessToken } from "@/lib/tokenUtils";
import { formatDate } from "@/lib/utils";
import { acceptCurrentTerms } from "../accept-consent";
import { acceptConsent } from "../api/accept-consent";
import { getOnboarding } from "../api/get-onboarding";
import { resolveTermsCopy } from "../consent-terms";
import { storeOnboarding } from "../load-cached-onboarding";
import type { OnboardingState } from "../types";
import { SectionStatus } from "./SectionStatus";

type Props = {
	consent: OnboardingState["consent"];
	/** This card holds the one primary action of the page right now. */
	primary: boolean;
};

/**
 * The Advertiser terms. Accepting is the last open step: once the form is
 * also complete the server moves the Advertiser to review by itself, so there
 * is no submit button anywhere.
 */
export function TermsCard({ consent, primary }: Props) {
	const { t } = useTranslation();
	const router = useRouter();
	const [accepting, setAccepting] = useState(false);
	const copy = resolveTermsCopy(consent.currentVersion);

	const accept = async () => {
		if (copy === null) {
			return;
		}
		setAccepting(true);
		try {
			const outcome = await acceptCurrentTerms(consent.currentVersion, {
				accept: acceptConsent,
				fetchState: getOnboarding,
			});
			if (outcome.kind === "failed") {
				toast.error(resolveErrorMessage(outcome.error, i18n.language));
				return;
			}
			storeOnboarding(getAccessToken(), outcome.state);
			if (outcome.kind === "version-changed") {
				toast.info(t("onboarding.terms.versionChanged"));
			}
			await router.invalidate();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : String(error));
		} finally {
			setAccepting(false);
		}
	};

	return (
		<FormSectionCard
			title={t("onboarding.terms.title")}
			description={t("onboarding.terms.description", {
				version: consent.currentVersion,
			})}
			actions={<SectionStatus complete={consent.complete} />}
			footer={
				consent.complete ? undefined : (
					<Button
						type="button"
						variant={primary ? "default" : "outline"}
						disabled={copy === null || accepting}
						onClick={accept}
					>
						{accepting ? t("onboarding.saving") : t("onboarding.terms.accept")}
					</Button>
				)
			}
		>
			{copy === null ? (
				<p
					role="alert"
					className="text-body-md font-medium text-destructive @md/formSection:col-span-2"
				>
					{t("onboarding.terms.unknownVersion")}
				</p>
			) : (
				<div className="flex flex-col gap-2 @md/formSection:col-span-2">
					<h3 className="text-body-lg font-medium">
						{t(`${copy.copyKey}.title`)}
					</h3>
					<p className="whitespace-pre-wrap text-body-md text-muted-foreground">
						{t(`${copy.copyKey}.body`)}
					</p>
				</div>
			)}
			{consent.complete && consent.acceptedAt ? (
				<p className="text-body-md text-muted-foreground @md/formSection:col-span-2">
					{t("onboarding.terms.accepted", {
						version: consent.acceptedVersion,
						date: formatDate(consent.acceptedAt, "date"),
					})}
				</p>
			) : null}
			{!consent.complete && consent.acceptedVersion ? (
				<p className="text-body-md text-muted-foreground @md/formSection:col-span-2">
					{t("onboarding.terms.updated", {
						acceptedVersion: consent.acceptedVersion,
						version: consent.currentVersion,
					})}
				</p>
			) : null}
		</FormSectionCard>
	);
}
