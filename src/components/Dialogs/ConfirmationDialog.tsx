import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DropdownActionDialogProps } from "../Table/DropdownActions";

const ConfirmationDialog = ({
	open,
	setOpen,
	item,
	onAction,
	closeOnAction = true,
}: DropdownActionDialogProps<any>) => {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-106.25 w-[calc(100%-2rem)] rounded-lg gap-10">
				<DialogHeader>
					<DialogTitle>{t("common.areYouSure")}</DialogTitle>
				</DialogHeader>

				<DialogFooter className="flex flex-row justify-center gap-2">
					<DialogClose asChild>
						<Button disabled={isLoading} variant="secondary" className="w-full">
							{t("common.cancel")}
						</Button>
					</DialogClose>

					<Button
						disabled={isLoading}
						onClick={async () => {
							setIsLoading(true);
							await onAction?.(item);
							setIsLoading(false);
							if (closeOnAction) {
								setOpen(false);
							}
						}}
						className="w-full"
					>
						{t("common.submit")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmationDialog;
