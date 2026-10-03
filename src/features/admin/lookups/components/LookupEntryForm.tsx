import { useFormik } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormikTextInput from "@/components/FormikInputs/FormikTextInput";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import useRequest from "@/hooks/useRequest";
import { resolveErrorMessage } from "@/lib/error-messages";
import { handleFormikError, isErrorResponse } from "@/lib/utils";
import { ErrorResponse, ServerResponse } from "@/types";
import { createLookupEntry } from "../api/create-lookup-entry";
import { updateLookupEntry } from "../api/update-lookup-entry";
import {
	buildCreateLookupBody,
	buildUpdateLookupBody,
} from "../build-lookup-request";
import {
	buildCreateSchedulePresetBody,
	buildUpdateSchedulePresetBody,
	SchedulePresetFormValues,
} from "../build-schedule-preset-request";
import { lookupCodeIssue, lookupCodeMessageKey } from "../lookup-code";
import { LookupEntry } from "../lookup-entry";
import { lookupEntryValidationSchema } from "../lookup-entry-validation";
import { LookupResource } from "../lookup-resources";
import {
	isTimeOfDay,
	scheduleWindowIssue,
	scheduleWindowMessageKey,
} from "../schedule-window";
import { ScheduleWindowFields } from "./ScheduleWindowFields";

const TAKEN_CODE = "LOOKUP_CODE_TAKEN";

export type LookupEditor =
	| { readonly mode: "create" }
	| { readonly mode: "edit"; readonly entry: LookupEntry };

type LookupEntryFormProps = {
	readonly resource: LookupResource;
	readonly editor: LookupEditor | null;
	readonly onClose: () => void;
	readonly onSaved: () => Promise<void>;
};

function initialValues(editor: LookupEditor | null): SchedulePresetFormValues {
	if (editor?.mode !== "edit") {
		return {
			code: "",
			name: "",
			description: "",
			sortOrder: "",
			days: [],
			startTime: "",
			endTime: "",
		};
	}
	return {
		code: editor.entry.code,
		name: editor.entry.name,
		description: editor.entry.description ?? "",
		sortOrder: String(editor.entry.sortOrder),
		days: [...(editor.entry.days ?? [])],
		startTime: editor.entry.startTime ?? "",
		endTime: editor.entry.endTime ?? "",
	};
}

function rejectWindow(formik: {
	values: SchedulePresetFormValues;
	setFieldError: (field: string, message: string) => void;
}): void {
	const issue = scheduleWindowIssue(formik.values);
	if (issue === "no-days" || issue === "day-out-of-range") {
		formik.setFieldError("days", scheduleWindowMessageKey(issue));
		return;
	}
	if (issue !== "invalid-time") {
		return;
	}
	if (!isTimeOfDay(formik.values.startTime)) {
		formik.setFieldError("startTime", "invalidTime");
		return;
	}
	formik.setFieldError("endTime", "invalidTime");
}

/** Create or edit dialog shared by every Lookup. The code is locked after creation. */
export function LookupEntryForm({
	resource,
	editor,
	onClose,
	onSaved,
}: LookupEntryFormProps) {
	const { t, i18n } = useTranslation();
	const [formError, setFormError] = useState<ErrorResponse | null>(null);
	const isEditing = editor?.mode === "edit";
	const { request: requestCreate, isLoading: isCreating } = useRequest<
		Parameters<typeof createLookupEntry>[0],
		ServerResponse<LookupEntry>
	>(createLookupEntry, { showErrorToast: false });
	const { request: requestUpdate, isLoading: isUpdating } = useRequest<
		Parameters<typeof updateLookupEntry>[0],
		ServerResponse<LookupEntry>
	>(updateLookupEntry, { showErrorToast: false });
	const isSaving = isCreating || isUpdating;
	const formik = useFormik<SchedulePresetFormValues>({
		initialValues: initialValues(editor),
		enableReinitialize: true,
		validationSchema: lookupEntryValidationSchema(
			isEditing ? "edit" : "create",
			{ includeWindow: resource.hasScheduleWindow === true },
		),
		onSubmit: async (values) => {
			setFormError(null);
			try {
				if (resource.hasScheduleWindow === true) {
					if (isEditing && editor?.mode === "edit") {
						const body = buildUpdateSchedulePresetBody(values);
						if (body === null) {
							rejectWindow(formik);
							return;
						}
						await requestUpdate({
							collectionPath: resource.collectionPath,
							code: editor.entry.code,
							body,
						});
					} else {
						const body = buildCreateSchedulePresetBody(values);
						if (body === null) {
							const codeIssue = lookupCodeIssue(values.code.trim());
							if (codeIssue !== null) {
								formik.setFieldError("code", lookupCodeMessageKey(codeIssue));
							}
							rejectWindow(formik);
							return;
						}
						await requestCreate({
							collectionPath: resource.collectionPath,
							body,
						});
					}
				} else if (isEditing && editor?.mode === "edit") {
					await requestUpdate({
						collectionPath: resource.collectionPath,
						code: editor.entry.code,
						body: buildUpdateLookupBody(values),
					});
				} else {
					const body = buildCreateLookupBody(values);
					if (body === null) {
						formik.setFieldError("code", "lookupCodeInvalid");
						return;
					}
					await requestCreate({
						collectionPath: resource.collectionPath,
						body,
					});
				}
				await onSaved();
			} catch (submitError) {
				if (isErrorResponse(submitError) && submitError.code === TAKEN_CODE) {
					formik.setFieldError("code", TAKEN_CODE);
					return;
				}
				if (isErrorResponse(submitError)) {
					setFormError(submitError);
				}
				handleFormikError(submitError, formik);
			}
		},
	});
	return (
		<Dialog
			open={editor !== null}
			onOpenChange={(isOpen) => {
				if (!isOpen) {
					setFormError(null);
					onClose();
				}
			}}
		>
			<DialogContent
				className={
					resource.hasScheduleWindow === true ? "sm:max-w-lg" : "sm:max-w-md"
				}
			>
				<DialogHeader>
					<DialogTitle>
						{isEditing
							? t("admin.lookups.editTitle")
							: t("admin.lookups.createTitle")}
					</DialogTitle>
					<DialogDescription>
						{isEditing
							? t("admin.lookups.codeLocked")
							: t("admin.lookups.codeHint")}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col gap-stack"
				>
					<FormikTextInput
						formik={formik}
						name="code"
						label={t("admin.lookups.code")}
						dir="ltr"
						disabled={isEditing}
						required={!isEditing}
						autoComplete="off"
					/>
					<FormikTextInput
						formik={formik}
						name="name"
						label={t("admin.lookups.name")}
						required
						autoComplete="off"
					/>
					<FormikTextInput
						formik={formik}
						name="description"
						label={t("admin.lookups.description")}
						placeholder={t("admin.lookups.descriptionOptional")}
						isTextArea
						textAreaClassName="h-24 min-h-24"
						autoComplete="off"
					/>
					<FormikTextInput
						formik={formik}
						name="sortOrder"
						label={t("admin.lookups.sortOrder")}
						placeholder={t("admin.lookups.sortOrderHint")}
						dir="ltr"
						autoComplete="off"
					/>
					{resource.hasScheduleWindow === true ? (
						<ScheduleWindowFields formik={formik} />
					) : null}
					{formError ? (
						<p
							className="rounded-md bg-destructive-soft px-3 py-2 text-body-md text-destructive-soft-foreground"
							role="alert"
						>
							{resolveErrorMessage(formError, i18n.language)}
						</p>
					) : null}
					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={isSaving}>
							{isSaving
								? t("admin.lookups.saving")
								: isEditing
									? t("admin.lookups.save")
									: t("admin.lookups.create")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
