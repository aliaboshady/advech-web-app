import { useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { IdCardIcon } from "lucide-react";
import { useRef } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { DatePicker } from "@/components/Inputs/DatePicker";
import Dropdown from "@/components/Inputs/Dropdown";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LookupItem } from "@/features/lookups/types";
import { Objective } from "@/features/Objectives/types";
import useRequest from "@/hooks/useRequest";
import { handleFormikError } from "@/lib/utils";
import { ServerResponse } from "@/types";
import { createCampaign } from "../../api/create-campaign";
import { editCampaign } from "../../api/edit-campaign";
import {
	buildCampaignDetailsPayload,
	CampaignDetailsFormValues,
	formatCalendarDate,
	parseCalendarDate,
} from "../../build-campaign-details-payload";
import { identityValidationSchema } from "../../identity-validation";
import { isCampaignEditable } from "../../is-campaign-editable";
import {
	Campaign,
	CreateCampaignPayload,
	EditCampaignPayload,
} from "../../types";
import { PrimaryObjective } from "./PrimaryObjective";

const DETAILS_FIELD_NAMES: Record<string, string> = {
	"totalBudget.amount": "totalAmount",
	"totalBudget.currency": "currency",
	"dailyBudget.amount": "dailyAmount",
	"dailyBudget.currency": "currency",
};

type Props = {
	submitButtonTitle: string;
	objectives: Objective[];
	currencies: LookupItem[];
	campaign?: Campaign;
};

function initialCurrency(
	campaign: Campaign | undefined,
	currencies: LookupItem[],
): string {
	const saved =
		campaign?.budget?.total?.currency ?? campaign?.budget?.daily?.currency;
	if (saved) {
		return saved;
	}
	if (currencies.length === 1) {
		return currencies[0].id;
	}
	return "";
}

/** Domain error codes from the details endpoint, and the field each one belongs to. */
const DETAILS_ERROR_FIELDS: Record<string, string> = {
	FLIGHT_DATES_INVALID: "endDate",
	CURRENCY_NOT_ACCEPTED: "currency",
	MONEY_PRECISION_EXCEEDED: "totalAmount",
};

function fieldMessage(
	translate: (key: string, options: { defaultValue: string }) => string,
	message: string | undefined,
): string {
	if (!message) {
		return "";
	}
	return translate(`errors.${message}`, { defaultValue: message });
}

export function IdentityForm({
	submitButtonTitle,
	objectives,
	currencies,
	campaign,
}: Props) {
	const { t } = useTranslation();
	const router = useRouter();
	const campaignIdRef = useRef<string | undefined>(campaign?.id);
	const isReadOnly = campaign ? !isCampaignEditable(campaign.status) : false;
	const showCurrencyPicker = currencies.length !== 1;
	const { request: requestCreateCampaign, isLoading: isLoadingCreateCampaign } =
		useRequest<CreateCampaignPayload, ServerResponse<Campaign>>(createCampaign);
	const { request: requestEditCampaign, isLoading: isLoadingEditCampaign } =
		useRequest<EditCampaignPayload, ServerResponse<Campaign>>(editCampaign);
	const isSaving = isLoadingCreateCampaign || isLoadingEditCampaign;
	const formik = useFormik<CampaignDetailsFormValues>({
		initialValues: {
			name: campaign?.name ?? "",
			objectiveCode: campaign?.objective?.id ?? "",
			startDate: campaign?.flight?.startDate ?? "",
			endDate: campaign?.flight?.endDate ?? "",
			totalAmount: campaign?.budget?.total?.amount ?? "",
			dailyAmount: campaign?.budget?.daily?.amount ?? "",
			currency: initialCurrency(campaign, currencies),
		},
		validationSchema: identityValidationSchema,
		onSubmit: async (values) => {
			if (isReadOnly) {
				return;
			}
			try {
				const details = buildCampaignDetailsPayload(values);
				let id = campaignIdRef.current;
				if (!id) {
					const created = await requestCreateCampaign({
						name: details.name ?? "",
						objectiveCode: details.objectiveCode ?? "",
					});
					id = created.data?.id;
					if (!id) {
						return;
					}
					campaignIdRef.current = id;
				}
				await requestEditCampaign({ id, ...details });
				await router.navigate({
					to: "/campaigns/$id/targeting",
					params: { id },
				});
			} catch (error) {
				handleFormikError(
					error,
					formik,
					DETAILS_FIELD_NAMES,
					DETAILS_ERROR_FIELDS,
				);
			}
		},
	});
	const flight: DateRange = {
		from: parseCalendarDate(formik.values.startDate),
		to: parseCalendarDate(formik.values.endDate),
	};
	const flightError = fieldMessage(
		t,
		formik.touched.startDate || formik.touched.endDate
			? formik.errors.startDate || formik.errors.endDate
			: undefined,
	);
	const currencyError = fieldMessage(
		t,
		formik.touched.currency ? formik.errors.currency : undefined,
	);
	return (
		<form
			onSubmit={formik.handleSubmit}
			className="@container bg-primary-foreground w-full @sm:min-h-[calc(100vh-16rem)] flex flex-col gap-4 shadow-md p-4 border rounded-xl"
		>
			<FormikTextInput
				formik={formik}
				label={t("campaigns.identity.name")}
				placeholder={t("campaigns.identity.name")}
				name="name"
				icon={<IdCardIcon size={15} />}
				className="@xl:w-96"
				disabled={isReadOnly}
			/>
			<PrimaryObjective
				formik={formik}
				objectives={objectives}
				readOnly={isReadOnly}
			/>
			<div className="flex flex-col gap-2 @xl:w-96">
				<Label>{t("campaigns.identity.flight")}</Label>
				<DatePicker
					mode="range"
					localTime
					disabled={isReadOnly}
					date={flight}
					setDate={(value: DateRange) => {
						formik.setFieldValue(
							"startDate",
							value?.from ? formatCalendarDate(value.from) : "",
						);
						formik.setFieldValue(
							"endDate",
							value?.to ? formatCalendarDate(value.to) : "",
						);
						formik.setFieldTouched("startDate", true, false);
						formik.setFieldTouched("endDate", true, false);
					}}
					placeholder="campaigns.targeting.selectDates"
				/>
				{flightError ? (
					<p className="text-xs text-destructive font-medium">{flightError}</p>
				) : null}
			</div>
			<div className="grid gap-4 @xl:grid-cols-2 @xl:w-[40rem]">
				<FormikTextInput
					formik={formik}
					label={t("campaigns.identity.totalBudget")}
					placeholder="0.00"
					name="totalAmount"
					disabled={isReadOnly}
				/>
				<FormikTextInput
					formik={formik}
					label={t("campaigns.identity.dailyBudget")}
					placeholder="0.00"
					name="dailyAmount"
					disabled={isReadOnly}
				/>
			</div>
			{showCurrencyPicker ? (
				<div className="flex flex-col gap-2 @xl:w-96">
					<Label>{t("campaigns.identity.currency")}</Label>
					<Dropdown
						items={currencies.map((currency) => ({
							value: currency.id,
							label: currency.name,
						}))}
						selected={formik.values.currency}
						setSelected={(value: string) => {
							formik.setFieldValue("currency", value);
							formik.setFieldTouched("currency", true, false);
						}}
						disabled={isReadOnly}
						placeholder={t("campaigns.identity.currency")}
						error={currencyError}
					/>
				</div>
			) : null}
			{isReadOnly ? null : (
				<div className="w-full h-full flex justify-end items-end">
					<Button
						type="submit"
						className="w-full @sm:w-fit"
						disabled={isSaving}
					>
						{submitButtonTitle}
					</Button>
				</div>
			)}
		</form>
	);
}
