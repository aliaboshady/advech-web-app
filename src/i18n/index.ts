import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

export const LOCALES = {
	arabic: "ar",
	english: "en",
} as const;

export const RTL_LANGS = {
	arabic: "ar",
};

export const locales = [...Object.values(LOCALES)] as const;
export const rtlLangs = [...Object.values(RTL_LANGS)] as const;

export type Locale = (typeof LOCALES)[keyof typeof LOCALES];

const savedLanguage = localStorage.getItem("language") || "en";

function updateDocumentDirection(language: string) {
	document.documentElement.lang = language;
	document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
}

i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: en,
		},
		ar: {
			translation: ar,
		},
	},

	lng: savedLanguage,
	fallbackLng: "en",

	interpolation: {
		escapeValue: false,
	},
});

updateDocumentDirection(i18n.language);

i18n.on("languageChanged", (language) => {
	localStorage.setItem("language", language);
	updateDocumentDirection(language);
});

export default i18n;
