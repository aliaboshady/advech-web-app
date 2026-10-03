import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import useRequest from "@/hooks/useRequest";
import { ServerResponse } from "@/types";
import { deleteRole } from "../api/delete-role";
import { Role } from "../types";

type DeleteRoleDialogProps = {
	readonly role: Role | null;
	readonly open: boolean;
	readonly onOpenChange: (open: boolean) => void;
};

/** Asks before a Role is deleted, then removes it. */
export function DeleteRoleDialog({
	role,
	open,
	onOpenChange,
}: DeleteRoleDialogProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const { request, isLoading } = useRequest<string, ServerResponse<null>>(
		deleteRole,
	);
	async function confirmDelete(): Promise<void> {
		if (!role) {
			return;
		}
		try {
			await request(role.id);
			onOpenChange(false);
			await router.invalidate();
		} catch {
			onOpenChange(false);
		}
	}
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{t("admin.roles.deleteTitle")}</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					{t("admin.roles.deleteBody", { name: role?.name ?? "" })}
				</p>
				<DialogFooter className="flex flex-row justify-end gap-2">
					<Button
						type="button"
						variant="secondary"
						disabled={isLoading}
						onClick={() => onOpenChange(false)}
					>
						{t("common.cancel")}
					</Button>
					<Button
						type="button"
						variant="destructive"
						disabled={isLoading || role === null}
						onClick={() => {
							void confirmDelete();
						}}
					>
						{t("common.delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
