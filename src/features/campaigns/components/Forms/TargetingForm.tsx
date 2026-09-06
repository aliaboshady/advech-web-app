import { useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { IdCardIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { GoogleMaps } from "@/components/GoogleMaps/GoogleMaps";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { handleFormikError } from "@/lib/utils";

export function TargetingForm() {
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
		<div className="@container bg-primary-foreground w-full sm:min-h-[calc(100vh-16rem)] flex flex-col gap-4 shadow-md p-4 border rounded-xl">
			<div className="w-full flex flex-row flex-1 gap-4">
				<GoogleMaps />

				<Card className="rounded-lg transition-colors p-6 w-1/3">
					<CardContent className="gap-1 p-0">
						<FormikTextInput
							formik={formik}
							label={t("locale:Campaign Name")}
							placeholder={t("locale:Campaign Name")}
							name="campaignName"
							icon={<IdCardIcon size={15} />}
						/>
					</CardContent>
				</Card>
			</div>

			<div className="w-full flex justify-between items-end">
				<Button
					variant="secondary"
					onClick={async () =>
						await router.navigate({ to: "/campaigns/$id/identity" })
					}
					className="w-full @sm:w-fit"
				>
					{t("Save and go back")}
				</Button>

				<Button
					onClick={async () =>
						await router.navigate({ to: "/campaigns/$id/creative" })
					}
					className="w-full @sm:w-fit"
				>
					{t("Save and continue")}
				</Button>
			</div>
		</div>
	);
}
