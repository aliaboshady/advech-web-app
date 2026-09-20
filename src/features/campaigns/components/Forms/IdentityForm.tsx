import { useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { IdCardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { Objective } from "@/features/Objectives/types";
import useRequest from "@/hooks/useRequest";
import { handleFormikError } from "@/lib/utils";
import { ServerResponse } from "@/types";
import { createCampaign } from "../../api/create-campaign";
import { editCampaign } from "../../api/edit-campaign";
import {
	Campaign,
	CreateCampaignPayload,
	EditCampaignPayload,
} from "../../types";
import { PrimaryObjective } from "./PrimaryObjective";

type Props = {
	submitButtonTitle: string;
	objectives: Objective[];
	campaign?: Campaign;
};

export function IdentityForm({
	submitButtonTitle,
	objectives,
	campaign,
}: Props) {
	const { t } = useTranslation();
	const router = useRouter();

	const {
		request: requestCreateCampaign,
		isLoading: isLoadingCreateCampaign,
		isSuccess: isSuccessCreateCampaign,
	} = useRequest<CreateCampaignPayload, ServerResponse<Campaign>>(
		createCampaign,
		{
			onSuccess: async (res: ServerResponse<Campaign>) => {
				const { id } = res?.data ?? {};
				if (id) {
					await router.navigate({
						to: "/campaigns/$id/targeting",
						params: { id },
					});
				}
			},
		},
	);

	const {
		request: requestEditCampaign,
		isLoading: isLoadingEditCampaign,
		isSuccess: isSuccessEditCampaign,
	} = useRequest<EditCampaignPayload, ServerResponse<Campaign>>(editCampaign, {
		onSuccess: async (res: ServerResponse<Campaign>) => {
			const { id } = res?.data ?? {};
			if (id) {
				await router.navigate({
					to: "/campaigns/$id/targeting",
					params: { id },
				});
			}
		},
	});

	const formik = useFormik({
		initialValues: {
			name: campaign?.name ?? "",
			objectiveCode: campaign?.objective?.id ?? "",
		},
		// validationSchema: validationSchema.login,
		onSubmit: async (values) => {
			try {
				if (campaign) {
					await requestEditCampaign({
						id: campaign?.id,
						name: values.name,
						objectiveCode: values.objectiveCode,
					});
				} else {
					await requestCreateCampaign({
						name: values.name,
						objectiveCode: values.objectiveCode,
					});
				}
			} catch (error) {
				handleFormikError(error, formik);
			}
		},
	});

	return (
		<form
			onSubmit={formik.handleSubmit}
			className="@container bg-primary-foreground w-full @sm:min-h-[calc(100vh-16rem)] flex flex-col gap-4 shadow-md p-4 border rounded-xl"
		>
			<FormikTextInput
				formik={formik}
				label={t("locale:Campaign Name")}
				placeholder={t("locale:Campaign Name")}
				name="name"
				icon={<IdCardIcon size={15} />}
				className="@xl:w-96"
			/>

			<PrimaryObjective formik={formik} objectives={objectives} />

			<div className="w-full h-full flex justify-end items-end">
				<Button
					type="submit"
					className="w-full @sm:w-fit"
					disabled={
						isLoadingCreateCampaign ||
						isSuccessCreateCampaign ||
						isLoadingEditCampaign ||
						isSuccessEditCampaign
					}
				>
					{submitButtonTitle}
				</Button>
			</div>
		</form>
	);
}
