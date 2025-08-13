import {App, Notice, TFile} from "obsidian";
import {DualTitleTranslatorSettings} from "../main";
import deeplTranslate from "./deeplTranslate";

type titleRenameProps = {
	app: App;
	settings: DualTitleTranslatorSettings;
	file: TFile;
	oldPath?: string;
}

async function renameFile (app:App,activeFile:TFile|null, name:string) {
	if (activeFile && activeFile.parent){
		try {
			await app.fileManager.renameFile(activeFile, `${activeFile.parent.path}/${name}`);
			console.log(activeFile)
		} catch (error) {
			console.error('Error renaming file:', error);
		}

	}
}

export async function titleRename({app, settings, file, oldPath}:titleRenameProps) {

	const separator = `${settings.separator}`;

	const activeFile = app.workspace.getActiveFile();

	const path = window.require("path");
	const oldName = oldPath ? path.basename(oldPath, `.${file.extension}`) : false;
	const newName = file.basename;

	if (!activeFile?.basename.includes(separator)) {
		if (activeFile && activeFile.parent) {

			const fileName = `${activeFile.basename}`;

			// const translatedName = await deeplTranslate(fileName, 'EN', settings.api);
			const translatedName = "placeholder"; // Replace with actual translation logic

			// const separatorWithSpaces = ` ${separator} `
			const extension = `.${activeFile.extension}`
			const TranslatedName = `${fileName} ${separator} ${translatedName}${extension}`;

			await renameFile(app, activeFile, TranslatedName);

		}else {
			new Notice('Something is wrong!');
		}

	}else if (oldName !== newName && !!oldName) {
		const nameBeforeSeparator = newName.split(separator)[0]
			.trim()
			.replace(/[.]+$/, "");
		const name = `${nameBeforeSeparator}.${activeFile?.extension}`;
		console.log(name);
		const translatedName = "placeholder"; // Replace with actual translation logic
		const extension = `.${activeFile.extension}`
		const TranslatedName = `${name} ${separator} ${translatedName}${extension}`;

		await renameFile(app, activeFile, TranslatedName);
	} else {
		new Notice('File already has a translated title!');
		return;
	}

}
