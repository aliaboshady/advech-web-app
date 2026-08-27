import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const localesPath = path.resolve(scriptDirectory, "../i18n/locales");
const englishFile = path.join(localesPath, "en.json");

// English is the base locale used to synchronize every other locale file.
const englishContent = readJsonFile(englishFile);
const localeFiles = fs
	.readdirSync(localesPath)
	.filter((file) => file.endsWith(".json") && file !== "en.json");

function readJsonFile(filePath) {
	return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function syncKeys(englishObject, localeObject, keyPath = "") {
	let updated = false;

	for (const key of Object.keys(englishObject)) {
		const currentPath = keyPath ? `${keyPath}.${key}` : key;

		if (!Object.hasOwn(localeObject, key)) {
			localeObject[key] = englishObject[key];
			updated = true;
			console.log(`Added missing key: ${currentPath}`);
			continue;
		}

		const englishValue = englishObject[key];
		const localeValue = localeObject[key];

		if (
			typeof englishValue === "object" &&
			englishValue !== null &&
			!Array.isArray(englishValue)
		) {
			if (
				typeof localeValue !== "object" ||
				localeValue === null ||
				Array.isArray(localeValue)
			) {
				localeObject[key] = { ...englishValue };
				updated = true;
				console.log(`Reset invalid locale value: ${currentPath}`);
				continue;
			}

			if (syncKeys(englishValue, localeValue, currentPath)) {
				updated = true;
			}
		}
	}

	for (const key of Object.keys(localeObject)) {
		if (!Object.hasOwn(englishObject, key)) {
			const currentPath = keyPath ? `${keyPath}.${key}` : key;
			delete localeObject[key];
			updated = true;
			console.log(`Removed extra key: ${currentPath}`);
		}
	}

	return updated;
}

function sortKeysLikeEnglish(englishObject, localeObject) {
	const sortedObject = {};

	for (const key of Object.keys(englishObject)) {
		if (!Object.hasOwn(localeObject, key)) {
			continue;
		}

		const englishValue = englishObject[key];
		const localeValue = localeObject[key];

		if (
			typeof englishValue === "object" &&
			englishValue !== null &&
			!Array.isArray(englishValue) &&
			typeof localeValue === "object" &&
			localeValue !== null &&
			!Array.isArray(localeValue)
		) {
			sortedObject[key] = sortKeysLikeEnglish(englishValue, localeValue);
		} else {
			sortedObject[key] = localeValue;
		}
	}

	return sortedObject;
}

// Sync each locale against English, then write it back in English key order.
for (const localeFile of localeFiles) {
	const localeFilePath = path.join(localesPath, localeFile);
	const localeContent = readJsonFile(localeFilePath);
	const updated = syncKeys(englishContent, localeContent);
	const sortedContent = sortKeysLikeEnglish(englishContent, localeContent);
	const serializedContent = `${JSON.stringify(sortedContent, null, "\t")}\n`;

	if (updated) {
		fs.writeFileSync(localeFilePath, serializedContent);
		console.log(`Updated and sorted: ${localeFile}`);
	} else {
		console.log(`Checked (no changes): ${localeFile}`);
	}
}
