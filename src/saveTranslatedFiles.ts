import {TFile} from "obsidian";
import {DualTitleTranslatorSettings} from "../main";


export default function saveTranslatedFiles (file:TFile, settings:DualTitleTranslatorSettings){

	const existingName = settings.translatedFiles.findIndex(
		fileSettings => fileSettings.name === file.name
	)

	const existingPath = settings.translatedFiles.findIndex(
		fileSettings => fileSettings.path === file.path
	)

	if (existingName !== -1) {
		settings.translatedFiles[existingName].path = file.path;
	} else if (existingPath !== -1) {
		settings.translatedFiles[existingPath].name = file.name;
	} else {
		settings.translatedFiles.push({

		})
	}
}
