import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DropdownActionDialogProps } from "../Table/DropdownActions";

type Props = DropdownActionDialogProps<any> & {
	/** Defaults to "Are you sure?". */
	title?: string;
	description?: string;
	/** Defaults to "Submit". */
	confirmLabel?: string;
	/** Styles the confirm button as destructive for irreversible actions. */
	destructive?: boolean;
};

const ConfirmationDialog = ({
	open,
	setOpen,
	item,
	onAction,
	closeOnAction = true,
	title,
	description,
	confirmLabel,
	destructive = false,
}: Props) => {
	const { t } = useTranslation();
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="sm:max-w-106.25! w-[calc(100%-2rem)] rounded-lg gap-10">
				<DialogHeader>
					<DialogTitle>{title ?? t("common.areYouSure")}</DialogTitle>
					{description ? (
						<DialogDescription>{description}</DialogDescription>
					) : null}
				</DialogHeader>

				<DialogFooter className="w-full flex flex-row justify-center gap-2">
					<DialogClose asChild>
						<Button disabled={isLoading} variant="secondary" className="w-1/2">
							{t("common.cancel")}
						</Button>
					</DialogClose>

					<Button
						variant={destructive ? "destructive" : "default"}
						disabled={isLoading}
						onClick={async () => {
							setIsLoading(true);
							await onAction?.(item);
							setIsLoading(false);
							if (closeOnAction) {
								setOpen(false);
							}
						}}
						className="w-1/2"
					>
						{confirmLabel ?? t("common.submit")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ConfirmationDialog;
