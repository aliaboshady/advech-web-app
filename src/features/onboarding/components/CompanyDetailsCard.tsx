import { useFormik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormikDropdown } from "@/components/FormikInputs/FormikDropdown";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { FormSectionCard } from "@/components/FormSectionCard";
import { Button } from "@/components/ui/button";
import useRequest from "@/hooks/useRequest";
import { handleFormikError } from "@/lib/utils";
import { BackendResponse } from "@/types";
import { listCities } from "../api/list-cities";
import { listCountries } from "../api/list-countries";
import { buildFormPayload } from "../build-onboarding-payload";
import type { SectionCompleteness } from "../form-sections";
import { BLANK_COMPANY, type CompanyFormValues } from "../form-values";
import { companyValidationSchema } from "../onboarding-validation";
import type { PlaceOption } from "../types";
import { useDraftAutosave } from "../use-draft-autosave";
import { useSaveOnboardingForm } from "../use-save-onboarding-form";
import { SectionStatus } from "./SectionStatus";

/** Server field names for company errors, and the form field each one belongs to. */
const FIELD_NAMES: Record<string, string> = {
	"company.name": "name",
	"company.email": "email",
	"company.country": "country",
	"company.city": "city",
	"company.telephone": "telephone",
	"company.address": "address",
};

type Props = {
	userId: string;
	draft: Partial<CompanyFormValues> | undefined;
	completeness: SectionCompleteness;
	/** This card holds the one primary action of the page right now. */
	primary: boolean;
};

function toItems(places: PlaceOption[], keyOf: (place: PlaceOption) => string) {
	const seen = new Set<string>();
	return places.flatMap((place) => {
		const value = keyOf(place);
		if (seen.has(value)) {
			return [];
		}
		seen.add(value);
		return [{ value, label: place.name }];
	});
}

export function CompanyDetailsCard({
	userId,
	draft,
	completeness,
	primary,
}: Props) {
	const { t } = useTranslation();
	const save = useSaveOnboardingForm();
	const countriesRequest = useRequest<void, BackendResponse<PlaceOption[]>>(
		listCountries,
		{ fetchOnMount: true, showTopLoader: false },
	);
	const citiesRequest = useRequest<string, BackendResponse<PlaceOption[]>>(
		listCities,
		{ showTopLoader: false },
	);
	const [cities, setCities] = useState<PlaceOption[]>([]);
	const initialValues = useMemo<CompanyFormValues>(
		() => ({ ...BLANK_COMPANY, ...draft }),
		[draft],
	);

	const formik = useFormik<CompanyFormValues>({
		initialValues,
		validationSchema: companyValidationSchema,
		onSubmit: async (values) => {
			try {
				await save.request(buildFormPayload({ company: values }));
			} catch (error) {
				handleFormikError(error, formik, FIELD_NAMES);
			}
		},
	});

	useDraftAutosave(userId, "company", formik.values, formik.dirty);

	const { countryCode } = formik.values;
	useEffect(() => {
		if (countryCode === "") {
			setCities([]);
			return;
		}
		let current = true;
		citiesRequest
			.request(countryCode)
			.then((res) => {
				if (current) {
					setCities(res.data ?? []);
				}
			})
			.catch(() => {
				if (current) {
					setCities([]);
				}
			});
		return () => {
			current = false;
		};
	}, [countryCode]);

	const countryItems = toItems(countriesRequest.data?.data ?? [], (c) => c.id);
	const cityItems = toItems(cities, (c) => c.name);

	return (
		<FormSectionCard
			title={t("onboarding.company.title")}
			description={t("onboarding.company.description")}
			actions={<SectionStatus complete={completeness.complete} />}
			footer={
				<Button
					type="submit"
					form="onboarding-company-form"
					variant={primary ? "default" : "outline"}
					disabled={save.isLoading}
				>
					{save.isLoading ? t("onboarding.saving") : t("onboarding.save")}
				</Button>
			}
		>
			<form
				id="onboarding-company-form"
				onSubmit={formik.handleSubmit}
				noValidate
				className="contents"
			>
				<FormikTextInput
					formik={formik}
					name="name"
					label={t("onboarding.company.name")}
					placeholder={t("onboarding.company.namePlaceholder")}
					autoComplete="organization"
					className="@md/formSection:col-span-2"
					required
					dir="auto"
				/>
				<FormikTextInput
					formik={formik}
					name="email"
					type="email"
					label={t("onboarding.company.email")}
					hint={t("onboarding.company.emailHint")}
					placeholder={t("onboarding.company.emailPlaceholder")}
					autoComplete="off"
					className="@md/formSection:col-span-2"
					required
				/>
				<FormikDropdown
					formik={formik}
					name="countryCode"
					errorField="country"
					label={t("onboarding.company.country")}
					items={countryItems}
					placeholder="onboarding.company.countryPlaceholder"
					searchPlaceholder="onboarding.company.countrySearch"
					loading={countriesRequest.isLoading}
					required
					onSelect={(item) => {
						// One setValues, so validation sees the country and the cleared city together.
						formik.setValues({
							...formik.values,
							countryCode: item?.value ?? "",
							country: item?.label ?? "",
							city: "",
						});
						formik.setFieldTouched("country", true, false);
					}}
				/>
				<FormikDropdown
					formik={formik}
					name="city"
					label={t("onboarding.company.city")}
					items={cityItems}
					placeholder="onboarding.company.cityPlaceholder"
					searchPlaceholder="onboarding.company.citySearch"
					disabled={countryCode === ""}
					loading={citiesRequest.isLoading}
					hint={
						countryCode === "" ? t("onboarding.company.cityHint") : undefined
					}
					required
				/>
				<FormikTextInput
					formik={formik}
					name="telephone"
					type="tel"
					label={t("onboarding.company.telephone")}
					placeholder={t("onboarding.company.telephonePlaceholder")}
					autoComplete="tel"
					className="@md/formSection:col-span-2"
					required
				/>
				<FormikTextInput
					formik={formik}
					name="address"
					label={t("onboarding.company.address")}
					hint={t("onboarding.company.addressHint")}
					placeholder={t("onboarding.company.addressPlaceholder")}
					autoComplete="street-address"
					className="@md/formSection:col-span-2"
					dir="auto"
				/>
			</form>
		</FormSectionCard>
	);
}
