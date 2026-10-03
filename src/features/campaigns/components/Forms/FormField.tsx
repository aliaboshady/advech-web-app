import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { Label } from "@/components/ui/label";
import { FieldMessage } from "./FieldMessage";

type Props = {
	label: string;
	/** Id of the control the label belongs to. Omit for a group of controls. */
	htmlFor?: string;
	/** Helper text under the control; replaced by the error when there is one. */
	hint?: string;
	error?: string;
	/** Span both columns of the section. */
	wide?: boolean;
	className?: string;
	children: ReactNode;
};

/**
 * Label, control, helper text and error for fields that are not a TextInput
 * (dropdowns, pickers, button groups). Looks the same as a TextInput field.
 */
export function FormField({
	label,
	htmlFor,
	hint,
	error,
	wide = false,
	className,
	children,
}: Props) {
	return (
		<div
			className={twMerge(
				"flex min-w-0 flex-col gap-2",
				wide && "@md/formSection:col-span-2",
				className,
			)}
		>
			<Label htmlFor={htmlFor}>{label}</Label>
			{children}
			{error ? (
				<FieldMessage message={error} />
			) : hint ? (
				<p className="text-body-md text-muted-foreground">{hint}</p>
			) : null}
		</div>
	);
}
