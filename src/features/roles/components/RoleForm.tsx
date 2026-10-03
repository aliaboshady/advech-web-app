import { useRouter } from "@tanstack/react-router";
import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { FormSectionCard } from "@/components/FormSectionCard";
import { Button } from "@/components/ui/button";
import { isPermissionDenied } from "@/features/access/is-permission-denied";
import useRequest from "@/hooks/useRequest";
import { resolveErrorMessage } from "@/lib/error-messages";
import { isErrorResponse } from "@/lib/utils";
import { ServerResponse } from "@/types";
import { createRole } from "../api/create-role";
import { updateRole } from "../api/update-role";
import {
	buildCreateRolePayload,
	buildUpdateRolePayload,
} from "../build-role-payload";
import { roleValidationSchema } from "../role-validation";
import { Permission, Role, RoleFormValues, UpdateRoleInput } from "../types";
import { PermissionPicker } from "./PermissionPicker";

type RoleFormProps = {
	readonly permissions: readonly Permission[];
	readonly existingRole: Role | null;
};

/** Creates a Role, or replaces the one being edited. */
export function RoleForm({ permissions, existingRole }: RoleFormProps) {
	const { t, i18n } = useTranslation();
	const router = useRouter();
	const [formError, setFormError] = useState("");
	const { request: requestCreate, isLoading: isCreating } = useRequest<
		RoleFormValues,
		ServerResponse<Role>
	>((values) => createRole(buildCreateRolePayload(values)), {
		showErrorToast: false,
	});
	const { request: requestUpdate, isLoading: isUpdating } = useRequest<
		UpdateRoleInput,
		ServerResponse<Role>
	>(updateRole, { showErrorToast: false });
	const isSaving = isCreating || isUpdating;
	const formik = useFormik<RoleFormValues>({
		initialValues: {
			name: existingRole?.name ?? "",
			description: existingRole?.description ?? "",
			permissions: [...(existingRole?.permissions ?? [])],
		},
		validationSchema: roleValidationSchema,
		onSubmit: async (values) => {
			setFormError("");
			try {
				if (existingRole) {
					await requestUpdate({
						id: existingRole.id,
						payload: buildUpdateRolePayload(values),
					});
				} else {
					await requestCreate(values);
				}
				await router.navigate({ to: "/admin/roles" });
			} catch (error) {
				if (!isErrorResponse(error) || isPermissionDenied(error)) {
					return;
				}
				if (error.code === "ROLE_NAME_TAKEN") {
					formik.setFieldTouched("name", true, false);
					formik.setFieldError("name", "ROLE_NAME_TAKEN");
					return;
				}
				setFormError(resolveErrorMessage(error, i18n.language));
			}
		},
	});
	return (
		<form
			onSubmit={formik.handleSubmit}
			className="flex w-full max-w-3xl flex-col gap-section"
		>
			<FormSectionCard
				title={t("admin.roles.detailsTitle")}
				description={t("admin.roles.detailsDescription")}
			>
				<FormikTextInput
					formik={formik}
					name="name"
					label={t("admin.roles.name")}
					placeholder={t("admin.roles.namePlaceholder")}
					required
				/>
				<div className="col-span-full">
					<FormikTextInput
						formik={formik}
						name="description"
						label={t("admin.roles.description")}
						placeholder={t("admin.roles.descriptionPlaceholder")}
						isTextArea
						textAreaClassName="h-24 min-h-24"
					/>
				</div>
			</FormSectionCard>
			<FormSectionCard
				title={t("admin.roles.permissions")}
				description={t("admin.roles.permissionsHint")}
				footer={
					<>
						{formError ? (
							<p
								className="me-auto rounded-md bg-destructive-soft px-3 py-2 text-body-md text-destructive-soft-foreground"
								role="alert"
							>
								{formError}
							</p>
						) : null}
						<Button type="submit" disabled={isSaving}>
							{isSaving ? t("admin.roles.saving") : t("admin.roles.save")}
						</Button>
					</>
				}
			>
				<PermissionPicker
					catalog={permissions}
					selectedKeys={formik.values.permissions}
					onChange={(keys) => {
						formik.setFieldValue("permissions", keys);
					}}
				/>
			</FormSectionCard>
		</form>
	);
}
