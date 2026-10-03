import { Moon, SunMedium } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isDarkTheme, THEME_STORAGE_KEY } from "@/lib/theme";
import { Button } from "./ui/button";

export function ThemeToggle() {
	const { t } = useTranslation();
	const [isDark, setIsDark] = useState(() =>
		isDarkTheme(localStorage.getItem(THEME_STORAGE_KEY)),
	);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
		localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
	}, [isDark]);

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			aria-label={
				isDark ? t("common.switchToLightMode") : t("common.switchToDarkMode")
			}
			aria-pressed={isDark}
			onClick={() => setIsDark((current) => !current)}
			className="inline-flex items-center gap-2 rounded-full"
		>
			{isDark ? <SunMedium className="size-4" /> : <Moon className="size-4" />}
			<span>{isDark ? t("common.lightMode") : t("common.darkMode")}</span>
		</Button>
	);
}
