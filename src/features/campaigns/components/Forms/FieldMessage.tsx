import { useTranslation } from "react-i18next";

export function FieldMessage({ message }: { message: string }) {
	const { t } = useTranslation();
	if (!message) {
		return null;
	}
	return (
		<p className="text-xs text-destructive font-medium">
			{t(`errors.${message}`, { defaultValue: message })}
		</p>
	);
}
