import { useTranslation } from "react-i18next";
import ConfirmationDialog from "@/components/Dialogs/ConfirmationDialog";

type SuspendAdvertiserDialogProps = {
	readonly isSubmitting: boolean;
	readonly onClose: () => void;
	readonly onConfirm: () => Promise<void>;
};

/** Confirm before suspend. Suspension signs out every User of the Advertiser. */
export function SuspendAdvertiserDialog({
	isSubmitting,
	onClose,
	onConfirm,
}: SuspendAdvertiserDialogProps) {
	const { t } = useTranslation();
	return (
		<ConfirmationDialog
			open
			setOpen={(isOpen: boolean) => {
				if (!isOpen && !isSubmitting) {
					onClose();
				}
			}}
			title={t("admin.advertisers.detail.suspendTitle")}
			description={t("admin.advertisers.detail.suspendConfirm")}
			confirmLabel={
				isSubmitting
					? t("admin.advertisers.detail.acting")
					: t("admin.advertisers.detail.suspend")
			}
			destructive
			closeOnAction={false}
			onAction={onConfirm}
		/>
	);
}
