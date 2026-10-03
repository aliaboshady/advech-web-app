import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

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
		<Dialog
			open
			onOpenChange={(isOpen) => {
				if (!isOpen && !isSubmitting) {
					onClose();
				}
			}}
		>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{t("admin.advertisers.detail.suspendTitle")}
					</DialogTitle>
					<DialogDescription>
						{t("admin.advertisers.detail.suspendConfirm")}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isSubmitting}
					>
						{t("common.cancel")}
					</Button>
					<Button
						type="button"
						variant="destructive"
						disabled={isSubmitting}
						onClick={() => {
							void onConfirm();
						}}
					>
						{isSubmitting
							? t("admin.advertisers.detail.acting")
							: t("admin.advertisers.detail.suspend")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
