import { useRouter } from "@tanstack/react-router";

type Props = {
	title: string;
	redirect?: string;
	submit?: () => Promise<void>;
	activeTabId?: boolean;
	disabled?: boolean;
	done?: boolean;
};

export function Tab({
	title,
	redirect,
	submit,
	activeTabId,
	disabled,
	done,
}: Props) {
	const router = useRouter();

	const handleOnClick = async () => {
		await submit?.();
		if (redirect) {
			await router.navigate({ to: redirect });
		}
	};

	return (
		<div className="flex flex-col gap-2 justify-center items-center">
			<button
				type="button"
				onClick={handleOnClick}
				className={`rounded-full bg-background p-1 w-10 h-10 outline-none transition-shadow focus-visible:ring-3 focus-visible:ring-ring/50 ${
					activeTabId ? "border border-primary shadow-md" : ""
				} ${disabled || activeTabId ? "" : "cursor-pointer"}`}
				disabled={disabled || activeTabId}
			>
				<div
					className={`rounded-full ${
						activeTabId
							? "bg-background border-2 border-primary"
							: done
								? "bg-primary"
								: disabled
									? "bg-background border-2 border-foreground/10"
									: "bg-background border-2 border-foreground/20"
					} w-full h-full flex justify-center items-center`}
				>
					<p
						className={`${activeTabId ? "text-primary" : done ? "text-primary-foreground" : disabled ? "text-foreground/30" : "text-foreground"}`}
					>
						{done ? "✓" : "!"}
					</p>
				</div>
			</button>

			<p
				className={`${
					activeTabId
						? "text-primary font-semibold text-sm"
						: done
							? "text-primary text-xs"
							: disabled
								? "text-foreground/30 text-xs"
								: "text-foreground text-xs"
				} text-nowrap`}
			>
				{title}
			</p>
		</div>
	);
}
