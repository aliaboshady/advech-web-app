import { useFormik } from "formik";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { FormSectionCard } from "@/components/FormSectionCard";
import { Button } from "@/components/ui/button";
import { handleFormikError } from "@/lib/utils";
import { buildFormPayload } from "../build-onboarding-payload";
import type { SectionCompleteness } from "../form-sections";
import { BLANK_CONTACT, type ContactFormValues } from "../form-values";
import { contactValidationSchema } from "../onboarding-validation";
import { useDraftAutosave } from "../use-draft-autosave";
import { useSaveOnboardingForm } from "../use-save-onboarding-form";
import { SectionStatus } from "./SectionStatus";

/** Server field names for contact errors, and the form field each one belongs to. */
const FIELD_NAMES: Record<string, string> = {
	"contact.firstName": "firstName",
	"contact.lastName": "lastName",
	"contact.mobile": "mobile",
	"contact.title": "title",
};

type Props = {
	userId: string;
	draft: Partial<ContactFormValues> | undefined;
	completeness: SectionCompleteness;
	/** This card holds the one primary action of the page right now. */
	primary: boolean;
};

/** The person the Advertiser nominates. Saves on its own, before or after Company details. */
export function ContactDetailsCard({
	userId,
	draft,
	completeness,
	primary,
}: Props) {
	const { t } = useTranslation();
	const save = useSaveOnboardingForm();
	const initialValues = useMemo<ContactFormValues>(
		() => ({ ...BLANK_CONTACT, ...draft }),
		[draft],
	);

	const formik = useFormik<ContactFormValues>({
		initialValues,
		validationSchema: contactValidationSchema,
		onSubmit: async (values) => {
			try {
				await save.request(buildFormPayload({ contact: values }));
			} catch (error) {
				handleFormikError(error, formik, FIELD_NAMES);
			}
		},
	});

	useDraftAutosave(userId, "contact", formik.values, formik.dirty);

	return (
		<FormSectionCard
			title={t("onboarding.contact.title")}
			description={t("onboarding.contact.description")}
			actions={<SectionStatus complete={completeness.complete} />}
			footer={
				<Button
					type="submit"
					form="onboarding-contact-form"
					variant={primary ? "default" : "outline"}
					disabled={save.isLoading}
				>
					{save.isLoading ? t("onboarding.saving") : t("onboarding.save")}
				</Button>
			}
		>
			<form
				id="onboarding-contact-form"
				onSubmit={formik.handleSubmit}
				noValidate
				className="contents"
			>
				<FormikTextInput
					formik={formik}
					name="firstName"
					label={t("onboarding.contact.firstName")}
					placeholder={t("onboarding.contact.firstNamePlaceholder")}
					autoComplete="off"
					required
					dir="auto"
				/>
				<FormikTextInput
					formik={formik}
					name="lastName"
					label={t("onboarding.contact.lastName")}
					placeholder={t("onboarding.contact.lastNamePlaceholder")}
					autoComplete="off"
					required
					dir="auto"
				/>
				<FormikTextInput
					formik={formik}
					name="mobile"
					type="tel"
					label={t("onboarding.contact.mobile")}
					hint={t("onboarding.contact.mobileHint")}
					placeholder={t("onboarding.contact.mobilePlaceholder")}
					autoComplete="off"
					className="@md/formSection:col-span-2"
					required
				/>
				<FormikTextInput
					formik={formik}
					name="title"
					label={t("onboarding.contact.titleLabel")}
					placeholder={t("onboarding.contact.titlePlaceholder")}
					autoComplete="off"
					className="@md/formSection:col-span-2"
					dir="auto"
				/>
			</form>
		</FormSectionCard>
	);
}
