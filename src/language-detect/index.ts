import detectLanguageHeuristic from "./detectLanguageHeuristic";
import {Script} from "./types";
import {LanguagesCode} from "../../main";
import {LANGUAGES} from "./constants";

function detectScript(text: string): Script {
	if (/[А-Яа-яЁёІіЇїЄєҐґ]/.test(text)) return 'cyrillic';
	if (/[A-Za-z]/.test(text)) return 'latin';
	return 'other';
}

export default function languageDetect(fileName:string, languages:LanguagesCode):LanguagesCode {
	if (languages.firstLanguage == "AUTO") return {
		firstLanguage:"AUTO",
		secondLanguage:languages.secondLanguage
	}

	const script = detectScript(fileName);

	const languagesByCode = [
		LANGUAGES[languages.firstLanguage],
		LANGUAGES[languages.secondLanguage],
	];

	const matches = languagesByCode.filter(lang => lang.script === script);

	if (matches.length === 1){

		const to  = languagesByCode
			.find(lang => lang.script !== script)!.code
		const from = languagesByCode
			.find(lang => lang.script === script)!.code

		return {firstLanguage:from, secondLanguage:to}
	}

	if (matches.length === 2) {
		const heuristicLang = detectLanguageHeuristic(fileName, script);
		const from = heuristicLang;

		const to = languagesByCode
			.find(lang => lang.code !== heuristicLang)?.code
			?? LANGUAGES[languages.secondLanguage].code

		return {firstLanguage:from, secondLanguage:to};
	}

	return {
		firstLanguage:"AUTO",
		secondLanguage:languages.secondLanguage
	}
}
