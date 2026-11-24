import { useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import ConfirmationDialog from "@/components/Dialogs/ConfirmationDialog";
import useRequest from "@/hooks/useRequest";
import { BackendResponse } from "@/types";
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
	const { request } = useRequest<string, BackendResponse<null>>(deleteRole);
	async function confirmDelete(): Promise<void> {
		if (!role) {
			return;
		}
		try {
			await request(role.id);
			await router.invalidate();
		} catch {
			// The request hook already toasts the error; the dialog closes either way.
		}
	}
	return (
		<ConfirmationDialog
			open={open}
			setOpen={onOpenChange}
			item={role}
			title={t("admin.roles.deleteTitle")}
			description={t("admin.roles.deleteBody", { name: role?.name ?? "" })}
			confirmLabel={t("common.delete")}
			destructive
			onAction={confirmDelete}
		/>
	);
}
