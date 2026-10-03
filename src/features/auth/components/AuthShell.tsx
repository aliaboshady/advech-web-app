import type { ReactNode } from "react";
import { Logo } from "@/components/Logo";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { LanguageAndTheme } from "./LanguageAndTheme";

/** Neutral link style for auth pages (orange is reserved for the primary action). */
export const authLinkClass =
	"font-medium text-foreground underline underline-offset-4 hover:text-muted-foreground";

type AuthShellProps = {
	title: string;
	description?: string;
	children: ReactNode;
};

/**
 * The frame of every page a person sees before signing in: canvas background,
 * the Advech wordmark, one card, and the language and theme toggles below it.
 * Pages put their form (with its single primary action) in `children`.
 */
export function AuthShell({ title, description, children }: AuthShellProps) {
	return (
		<main className="flex min-h-dvh flex-col items-center justify-center gap-section bg-background p-page">
			<Logo variant="wordmark" className="h-8 w-auto" />
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-headline-md">{title}</CardTitle>
					{description ? (
						<CardDescription>{description}</CardDescription>
					) : null}
				</CardHeader>
				<CardContent className="flex flex-col gap-stack">
					{children}
				</CardContent>
			</Card>
			<LanguageAndTheme />
		</main>
	);
}

type AuthFormErrorProps = { children: ReactNode; className?: string };

/** Server error shown inside an auth form, in the shared destructive tokens. */
export function AuthFormError({ children, className }: AuthFormErrorProps) {
	return (
		<div
			role="alert"
			className={`rounded-md bg-destructive-soft px-3 py-2 text-body-md text-destructive-soft-foreground ${className ?? ""}`}
		>
			{children}
		</div>
	);
}
