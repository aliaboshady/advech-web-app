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
import { Campaign, CreateCampaignPayload } from "../../types";
import { PrimaryObjective } from "./PrimaryObjective";

type Props = {
	submitButtonTitle: string;
	objectives: Objective[];
};

export function IdentityForm({ submitButtonTitle, objectives }: Props) {
	const { t } = useTranslation();
	const router = useRouter();

	const { request, isLoading, isSuccess } = useRequest<
		CreateCampaignPayload,
		ServerResponse<Campaign>
	>(createCampaign, {
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
		initialValues: { name: "", objectiveCode: "" },
		// validationSchema: validationSchema.login,
		onSubmit: async (values) => {
			try {
				await request({
					name: values.name,
					objectiveCode: values.objectiveCode,
				});
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
					disabled={isLoading || isSuccess}
				>
					{submitButtonTitle}
				</Button>
			</div>
		</form>
	);
}
