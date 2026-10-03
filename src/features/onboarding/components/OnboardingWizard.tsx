import { useState } from "react";
import { useTranslation } from "react-i18next";
import { nextStep, sectionCompleteness } from "../form-sections";
import { loadDraft } from "../onboarding-draft";
import type { OnboardingState } from "../types";
import { CompanyDetailsCard } from "./CompanyDetailsCard";
import { ContactDetailsCard } from "./ContactDetailsCard";
import { TermsCard } from "./TermsCard";

type Props = {
	userId: string;
	onboarding: OnboardingState;
};

/** The unlocked form: one page of cards, each saved on its own and in any order. */
export function OnboardingWizard({ userId, onboarding }: Props) {
	const { t } = useTranslation();
	const [draft] = useState(() => loadDraft(window.localStorage, userId));
	const sections = sectionCompleteness(onboarding.form.missingFields);
	const next = nextStep(sections, onboarding.consent.complete);

	return (
		<>
			<header className="flex flex-col gap-1">
				<h1 className="text-headline-md">{t("onboarding.wizard.title")}</h1>
				<p className="text-body-md text-muted-foreground">
					{t("onboarding.wizard.description")}
				</p>
			</header>
			<CompanyDetailsCard
				userId={userId}
				draft={draft.company}
				completeness={sections.company}
				primary={next === "company"}
			/>
			<ContactDetailsCard
				userId={userId}
				draft={draft.contact}
				completeness={sections.contact}
				primary={next === "contact"}
			/>
			<TermsCard consent={onboarding.consent} primary={next === "consent"} />
		</>
	);
}
