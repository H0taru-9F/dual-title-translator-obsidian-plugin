import {App, Notice, TFile} from "obsidian";
import {DualTitleTranslatorSettings} from "../main";
import deeplTranslate from "./deeplTranslate";

type titleRenameProps = {
	app: App;
	settings: DualTitleTranslatorSettings;
	saveSettings?: () => Promise<void>;
}

async function renameFile (app:App,activeFile:TFile|null, name:string) {
	let isRenaming = false;
	if (activeFile && activeFile.parent){
		try {
			if (isRenaming) return;
			isRenaming = true;
			await app.fileManager.renameFile(activeFile, `${activeFile.parent.path}/${name}`);
			isRenaming = false;
			console.log(activeFile)
		} catch (error) {
			console.error('Error renaming file:', error);
			new Notice('Error renaming file: ' + (error?.message || 'Unknown error'));
		}

	}
}

export async function titleRename({app, settings, saveSettings}:titleRenameProps) {

	const separatorsArr:string[] = settings.historySeparators;
	const separator = settings.separator;

	const activeFile = app.workspace.getActiveFile();

	const hasKnownSeparator = separatorsArr.some(sep => activeFile?.basename.includes(sep));

	if (!hasKnownSeparator) {
		if (activeFile && activeFile.parent) {

			const fileName = `${activeFile.basename}`;

			// const translatedName = await deeplTranslate(fileName, 'EN', settings.api);
			const translatedName = "placeholder"; // Replace with actual translation logic

			const extension = `.${activeFile.extension}`
			const TranslatedName = `${fileName} ${separator} ${translatedName}${extension}`;

			await renameFile(app, activeFile, TranslatedName);

			if (separator && !settings.historySeparators.includes(separator)) {
				settings.historySeparators.push(separator);
				if (saveSettings) {
					await saveSettings();
				} else {
					console.warn("saveSettings not provided — historySeparators updated in memory only.");
				}
			}
		}else {
			new Notice('Something is wrong!');
		}

	}else {
		new Notice('File already has a translated title!');
		return;
	}

}
