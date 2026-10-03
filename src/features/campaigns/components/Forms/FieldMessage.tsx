import { useTranslation } from "react-i18next";

/** Error under a field. Same look as the error under a TextInput. */
export function FieldMessage({ message }: { message: string }) {
	const { t } = useTranslation();
	if (!message) {
		return null;
	}
	return (
		<p role="alert" className="text-body-md font-medium text-destructive">
			{t(`errors.${message}`, { defaultValue: message })}
		</p>
	);
}
