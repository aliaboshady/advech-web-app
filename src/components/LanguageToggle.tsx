import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

export function LanguageToggle() {
	const { i18n } = useTranslation();

	const isArabic = i18n.language === "ar";

	const handleLanguageChange = async () => {
		const language = isArabic ? "en" : "ar";

		await i18n.changeLanguage(language);

		document.documentElement.lang = language;
		document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
	};

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={handleLanguageChange}
		>
			{isArabic ? "English" : "العربية"}
		</Button>
	);
}
