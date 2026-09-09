import { useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { IdCardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import { handleFormikError } from "@/lib/utils";
import { PrimaryObjective } from "./PrimaryObjective";

type Props = {
	submitButtonTitle: string;
};

export function IdentityForm({ submitButtonTitle }: Props) {
	const { t } = useTranslation();
	const router = useRouter();

	const formik = useFormik({
		initialValues: { campaignName: "", primaryObjective: "" },
		// validationSchema: validationSchema.login,
		onSubmit: async (values) => {
			try {
				// await request({
				//   email: values.email,
				//   password: values.password,
				// });
				true;
			} catch (error) {
				handleFormikError(error, formik);
			}
		},
	});

	return (
		<div className="@container bg-primary-foreground w-full @sm:min-h-[calc(100vh-16rem)] flex flex-col gap-4 shadow-md p-4 border rounded-xl">
			<FormikTextInput
				formik={formik}
				label={t("locale:Campaign Name")}
				placeholder={t("locale:Campaign Name")}
				name="campaignName"
				icon={<IdCardIcon size={15} />}
				className="@xl:w-96"
			/>

			<PrimaryObjective formik={formik} />

			<div className="w-full h-full flex justify-end items-end">
				<Button
					onClick={async () =>
						await router.navigate({ to: "/campaigns/$id/targeting" })
					}
					className="w-full @sm:w-fit"
				>
					{submitButtonTitle}
				</Button>
			</div>
		</div>
	);
}
