import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
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
import { REVIEW_REASON_MAX_LENGTH, reviewReasonIssue } from "../review-reason";

type ReasonReviewAction = "reject" | "requestChanges";

type ReviewReasonDialogProps = {
	readonly action: ReasonReviewAction;
	readonly isSubmitting: boolean;
	readonly onClose: () => void;
	readonly onSubmit: (reason: string) => Promise<void>;
};

const reviewReasonValidationSchema = Yup.object({
	reason: Yup.string()
		.test("review-reason", (value, context) => {
			const issue = reviewReasonIssue(value ?? "");
			if (issue === null) {
				return true;
			}
			return context.createError({
				message:
					issue === "empty" ? "reviewReasonEmpty" : "reviewReasonTooLong",
			});
		}),
});

/** Required reason for reject or request changes. Reject warns that it is final. */
export function ReviewReasonDialog({
	action,
	isSubmitting,
	onClose,
	onSubmit,
}: ReviewReasonDialogProps) {
	const { t } = useTranslation();
	const isRejection = action === "reject";
	const formik = useFormik({
		initialValues: { reason: "" },
		validationSchema: reviewReasonValidationSchema,
		onSubmit: async (values) => {
			await onSubmit(values.reason.trim());
		},
	});
	const trimmedLength = formik.values.reason.trim().length;
	return (
		<Dialog
			open
			onOpenChange={(isOpen) => {
				if (!isOpen && !isSubmitting) {
					onClose();
				}
			}}
		>
			<DialogContent className="sm:max-w-106.25 w-[calc(100%-2rem)] gap-6">
				<DialogHeader>
					<DialogTitle>
						{isRejection
							? t("admin.advertisers.detail.rejectTitle")
							: t("admin.advertisers.detail.requestChangesTitle")}
					</DialogTitle>
					<DialogDescription
						className={
							isRejection
								? "rounded-md bg-destructive-soft p-3 text-destructive-soft-foreground"
								: undefined
						}
					>
						{isRejection
							? t("admin.advertisers.detail.rejectFinal")
							: t("admin.advertisers.detail.requestChangesDescription")}
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={formik.handleSubmit}
					className="flex flex-col gap-stack"
				>
					<FormikTextInput
						formik={formik}
						name="reason"
						label={t("admin.advertisers.detail.reason")}
						required
						isTextArea
						textAreaClassName="h-28 min-h-28"
						autoComplete="off"
					/>
					<p className="text-body-md text-muted-foreground">
						{t("admin.advertisers.detail.reasonCount", {
							count: trimmedLength,
							max: REVIEW_REASON_MAX_LENGTH,
						})}
					</p>
					<DialogFooter className="flex flex-row justify-center gap-2">
						<Button
							type="button"
							variant="secondary"
							className="flex-1"
							onClick={onClose}
							disabled={isSubmitting}
						>
							{t("common.cancel")}
						</Button>
						<Button
							type="submit"
							className="flex-1"
							variant={isRejection ? "destructive" : "default"}
							disabled={isSubmitting}
						>
							{isSubmitting
								? t("admin.advertisers.detail.acting")
								: isRejection
									? t("admin.advertisers.detail.reject")
									: t("admin.advertisers.detail.requestChanges")}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
