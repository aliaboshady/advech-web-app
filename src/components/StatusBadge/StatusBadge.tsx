import {
	AlertCircleIcon,
	BanIcon,
	CheckCircle2Icon,
	ClockIcon,
	type LucideIcon,
	PauseCircleIcon,
	RadioIcon,
	XCircleIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	type StatusIcon,
	type StatusKind,
	type StatusOf,
	type StatusToken,
	type StatusTone,
	statusVisual,
} from "./status-visual";

const ICONS: Record<StatusIcon, LucideIcon> = {
	check: CheckCircle2Icon,
	clock: ClockIcon,
	alert: AlertCircleIcon,
	x: XCircleIcon,
	ban: BanIcon,
	radio: RadioIcon,
	pause: PauseCircleIcon,
};

const BADGE_VARIANT = {
	success: "success",
	warning: "warning",
	info: "info",
	destructive: "destructive",
	neutral: "secondary",
} as const satisfies Record<StatusToken, string>;

// Literal class strings so Tailwind can see them.
const FILLED: Record<StatusToken, string> = {
	success: "bg-success text-success-foreground",
	warning: "bg-warning text-warning-foreground",
	info: "bg-info text-info-foreground",
	destructive: "bg-destructive text-destructive-foreground",
	neutral: "bg-foreground text-background",
};

type StatusBadgeProps<K extends StatusKind> = {
	kind: K;
	status: StatusOf<K>;
	className?: string;
};

/** The only place a status colour is chosen. */
export function StatusBadge<K extends StatusKind>({
	kind,
	status,
	className,
}: StatusBadgeProps<K>) {
	const { t } = useTranslation();
	const { token, tone, labelKey, icon } = statusVisual(kind, status);
	const Icon = icon ? ICONS[icon] : null;
	const toneClass: Record<StatusTone, string | undefined> = {
		soft: undefined,
		filled: FILLED[token],
	};

	return (
		<Badge
			variant={BADGE_VARIANT[token]}
			data-status={status}
			className={cn(toneClass[tone], className)}
		>
			{Icon && <Icon aria-hidden="true" />}
			{t(labelKey as never)}
		</Badge>
	);
}
