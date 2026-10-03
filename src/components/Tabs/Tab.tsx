import { useRouter } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Props = {
	title: string;
	redirect?: string;
	submit?: () => Promise<void>;
	activeTabId?: boolean;
	disabled?: boolean;
	done?: boolean;
};

/**
 * One step of the Campaign flow. Three states: done (check on success),
 * current (solid ring and dot, neutral) and incomplete (empty dashed ring).
 * The state is also spoken: current gets `aria-current`, done and incomplete
 * get visually hidden text.
 */
export function Tab({
	title,
	redirect,
	submit,
	activeTabId,
	disabled,
	done,
}: Props) {
	const { t } = useTranslation();
	const router = useRouter();

	const handleOnClick = async () => {
		await submit?.();
		if (redirect) {
			await router.navigate({ to: redirect });
		}
	};

	const stateLabel = activeTabId
		? t("campaigns.tabs.states.current")
		: done
			? t("campaigns.tabs.states.done")
			: t("campaigns.tabs.states.incomplete");

	return (
		<div className="flex flex-col items-center justify-center gap-2">
			<button
				type="button"
				onClick={handleOnClick}
				aria-current={activeTabId ? "step" : undefined}
				className={cn(
					"flex size-10 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
					activeTabId
						? "border-2 border-foreground bg-card"
						: done
							? "border-2 border-success bg-success text-success-foreground"
							: "border-2 border-dashed border-muted-foreground bg-background",
					disabled && !activeTabId && "opacity-50",
					!disabled && !activeTabId && "cursor-pointer hover:bg-accent",
					done && !activeTabId && !disabled && "hover:bg-success/85",
				)}
				disabled={disabled || activeTabId}
			>
				{activeTabId ? (
					<span
						aria-hidden="true"
						className="size-3 rounded-full bg-foreground"
					/>
				) : done ? (
					<CheckIcon aria-hidden="true" className="size-5" />
				) : null}
				<span className="sr-only">{stateLabel}</span>
			</button>

			<p
				className={cn(
					"text-nowrap text-body-md",
					activeTabId
						? "font-semibold text-foreground"
						: "text-muted-foreground",
					done && !activeTabId && "text-foreground",
				)}
			>
				{title}
			</p>
		</div>
	);
}
