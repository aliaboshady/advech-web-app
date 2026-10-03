import {
	BanIcon,
	CheckIcon,
	LucideIcon,
	MessageSquareWarningIcon,
	PlayIcon,
	XIcon,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { isPermissionDenied } from "@/features/access/is-permission-denied";
import useRequest from "@/hooks/useRequest";
import { resolveErrorMessage } from "@/lib/error-messages";
import { isErrorResponse } from "@/lib/utils";
import { ServerResponse } from "@/types";
import { AdvertiserDetail } from "../advertiser-detail";
import {
	ADVERTISER_INVALID_STATUS_TRANSITION,
	ReviewAdvertiserInput,
	reviewAdvertiser,
} from "../api/review-advertiser";
import {
	OfferedReviewAction,
	offeredReviewActions,
	ReviewAction,
} from "../offered-review-actions";
import { reviewActionVariant } from "../review-action-style";
import { ReviewReasonDialog } from "./ReviewReasonDialog";
import { SuspendAdvertiserDialog } from "./SuspendAdvertiserDialog";

const actionLabelKeys = {
	approve: "admin.advertisers.detail.approve",
	reject: "admin.advertisers.detail.reject",
	requestChanges: "admin.advertisers.detail.requestChanges",
	suspend: "admin.advertisers.detail.suspend",
	unsuspend: "admin.advertisers.detail.unsuspend",
} as const;

type AdvertiserReviewActionsProps = {
	readonly advertiser: AdvertiserDetail;
	readonly onUpdated: (advertiser: AdvertiserDetail) => void;
	readonly onInvalidTransition: () => Promise<void>;
};

type ReasonReviewAction = "reject" | "requestChanges";

const actionIcons: Record<ReviewAction, LucideIcon> = {
	approve: CheckIcon,
	reject: XIcon,
	requestChanges: MessageSquareWarningIcon,
	suspend: BanIcon,
	unsuspend: PlayIcon,
};

function isReasonAction(action: ReviewAction): action is ReasonReviewAction {
	return action === "reject" || action === "requestChanges";
}

/**
 * The Review actions this Advertiser's status allows.
 * Approve and unsuspend send immediately. Reject and request changes ask for a reason.
 * Suspend confirms that it signs the Advertiser's Users out.
 */
export function AdvertiserReviewActions({
	advertiser,
	onUpdated,
	onInvalidTransition,
}: AdvertiserReviewActionsProps) {
	const { t, i18n } = useTranslation();
	const [reasonAction, setReasonAction] = useState<ReasonReviewAction | null>(
		null,
	);
	const [isSuspendOpen, setIsSuspendOpen] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);
	const [pendingAction, setPendingAction] = useState<ReviewAction | null>(null);
	const { request, isLoading } = useRequest<
		ReviewAdvertiserInput,
		ServerResponse<AdvertiserDetail>
	>(reviewAdvertiser, { showErrorToast: false });
	const offers = offeredReviewActions(advertiser.status);
	const applyAction = async (
		action: ReviewAction,
		reason?: string,
	): Promise<boolean> => {
		setActionError(null);
		setPendingAction(action);
		try {
			const result = await request({ id: advertiser.id, action, reason });
			if (result.data) {
				onUpdated(result.data);
			}
			return true;
		} catch (error) {
			if (!isErrorResponse(error)) {
				if (error instanceof Error) {
					setActionError(error.message);
				}
				return false;
			}
			if (isPermissionDenied(error)) {
				return false;
			}
			if (error.code === ADVERTISER_INVALID_STATUS_TRANSITION) {
				setReasonAction(null);
				setIsSuspendOpen(false);
				setActionError(resolveErrorMessage(error, i18n.language));
				await onInvalidTransition();
				return false;
			}
			setActionError(resolveErrorMessage(error, i18n.language));
			return false;
		} finally {
			setPendingAction(null);
		}
	};
	const startAction = (offer: OfferedReviewAction): void => {
		if (offer.prompt === "immediate") {
			void applyAction(offer.action);
			return;
		}
		if (offer.prompt === "signOut") {
			setIsSuspendOpen(true);
			return;
		}
		if (isReasonAction(offer.action)) {
			setReasonAction(offer.action);
		}
	};
	if (offers.length === 0) {
		return actionError === null ? null : <ActionError message={actionError} />;
	}
	return (
		<section className="flex w-full flex-col rounded-lg border border-border bg-card text-card-foreground">
			<div className="flex flex-col gap-1 border-b border-border p-4">
				<h2 className="text-body-lg font-medium">
					{t("admin.advertisers.detail.actions")}
				</h2>
				<p className="text-body-md text-muted-foreground">
					{t("admin.advertisers.detail.actionsDescription")}
				</p>
			</div>
			<div className="flex flex-col gap-stack p-4">
				{actionError ? <ActionError message={actionError} /> : null}
				<div className="flex flex-wrap gap-2">
					{offers.map((offer) => {
						const Icon = actionIcons[offer.action];
						return (
							<Button
								key={offer.action}
								type="button"
								variant={reviewActionVariant(offer.action)}
								disabled={pendingAction !== null}
								onClick={() => {
									startAction(offer);
								}}
							>
								<Icon aria-hidden="true" />
								{pendingAction === offer.action
									? t("admin.advertisers.detail.acting")
									: t(actionLabelKeys[offer.action])}
							</Button>
						);
					})}
				</div>
			</div>
			{reasonAction ? (
				<ReviewReasonDialog
					key={reasonAction}
					action={reasonAction}
					isSubmitting={isLoading}
					onClose={() => {
						setReasonAction(null);
					}}
					onSubmit={async (reason) => {
						const didApply = await applyAction(reasonAction, reason);
						if (didApply) {
							setReasonAction(null);
						}
					}}
				/>
			) : null}
			{isSuspendOpen ? (
				<SuspendAdvertiserDialog
					isSubmitting={isLoading}
					onClose={() => {
						setIsSuspendOpen(false);
					}}
					onConfirm={async () => {
						const didApply = await applyAction("suspend");
						if (didApply) {
							setIsSuspendOpen(false);
						}
					}}
				/>
			) : null}
		</section>
	);
}

function ActionError({ message }: { readonly message: string }) {
	return (
		<p
			role="alert"
			className="rounded-md bg-destructive-soft p-3 text-body-md text-destructive-soft-foreground"
		>
			{message}
		</p>
	);
}
