import { EyeIcon, EyeOffIcon } from "lucide-react";
import { HTMLInputTypeAttribute, useState } from "react";
import { useTranslation } from "react-i18next";
import { twMerge } from "tailwind-merge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dir } from "@/types";

const autoFillStyles = `
	text-foreground
	caret-foreground
	bg-background
	[&:-webkit-autofill]:bg-background!
	[&:-webkit-autofill]:border-[var(--ring-auto-fill)]!
	[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_color-mix(in_oklab,var(--input)_2%,var(--background))]!
	[&:-webkit-autofill]:[-webkit-text-fill-color:var(--foreground)]!
`;

export type TextInputProps = {
	name?: string;
	value: string;
	setValue?: (val: string) => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	type?: HTMLInputTypeAttribute;
	autoComplete?: React.InputHTMLAttributes<HTMLInputElement>["autoComplete"];
	label?: string;
	placeholder?: string;
	icon?: React.ReactNode;
	isPassword?: boolean;
	enableAutofill?: boolean;
	className?: string;
	inputClassName?: string;
	labelClassName?: string;
	fontSize?: number;
	error?: string;
	dir?: Dir;
	disabled?: boolean;
	isTextArea?: boolean;
	textAreaClassName?: string;
};

const TextInput = ({
	name,
	value,
	setValue,
	onChange,
	onBlur,
	onFocus,
	onKeyDown,
	type = "text",
	autoComplete,
	label,
	placeholder,
	icon,
	isPassword,
	enableAutofill,
	className,
	inputClassName,
	labelClassName,
	fontSize = 13,
	error,
	dir = "ltr",
	disabled,
	isTextArea = false,
	textAreaClassName,
}: TextInputProps) => {
	const { t } = useTranslation();
	const [isPasswordShown, setIsPasswordShown] = useState(false);

	return (
		<div className={twMerge("flex flex-col gap-2", className)}>
			{label && (
				<Label htmlFor={name} className={labelClassName}>
					{label}
				</Label>
			)}

			<div className="relative">
				{icon && (
					<div className="absolute inset-s-3 top-1/2 -translate-y-1/2">
						{icon}
					</div>
				)}

				{isTextArea ? (
					<Textarea
						name={name}
						aria-invalid={error ? true : undefined}
						className={twMerge("h-48 min-h-12", textAreaClassName)}
						placeholder={placeholder || name}
						value={value}
						onChange={(e) => {
							e.preventDefault();
							if (onChange) onChange(e as any);
							else if (setValue) setValue(e.target.value);
						}}
						onBlur={(e) => onBlur?.(e as any)}
						onFocus={(e) => onFocus?.(e as any)}
						onKeyDown={onKeyDown as any}
					/>
				) : (
					<Input
						dir={dir}
						id={name}
						name={name}
						value={value}
						onChange={(e) => {
							e.preventDefault();
							if (onChange) onChange(e);
							else if (setValue) setValue(e.target.value);
						}}
						onBlur={onBlur}
						onFocus={onFocus}
						onKeyDown={onKeyDown}
						autoComplete={
							autoComplete ?? (enableAutofill ? "" : "new-password")
						}
						type={isPassword && !isPasswordShown ? "password" : type}
						placeholder={placeholder}
						className={twMerge(
							`focus-visible:outline-none focus-visible:ring-0 transition-colors ${
								icon ? "ps-10" : ""
							} ${isPassword ? "pe-10" : ""} ${
								error ? "border-destructive! focus:border-destructive!" : ""
							}`,
							inputClassName,
							autoFillStyles,
						)}
						style={{ fontSize }}
						disabled={disabled}
					/>
				)}

				{isPassword && (
					<button
						className={`absolute inset-e-4 top-1/2 -translate-y-1/2 ${disabled && "opacity-50"}`}
						onClick={() => setIsPasswordShown(!isPasswordShown)}
						type="button"
						disabled={disabled}
					>
						{isPasswordShown ? <EyeIcon size={15} /> : <EyeOffIcon size={15} />}
					</button>
				)}
			</div>

			{error && (
				<p className="text-xs text-destructive font-medium whitespace-nowrap truncate">
					{t(`errors.${error}`, { defaultValue: error })}
				</p>
			)}
		</div>
	);
};

export default TextInput;
