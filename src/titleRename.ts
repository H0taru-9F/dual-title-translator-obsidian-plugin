import {App, Notice, TFile} from "obsidian";
import {DualTitleTranslatorSettings} from "../main";
import deeplTranslate from "./deeplTranslate";

export async function titleRename(app: App, settings: DualTitleTranslatorSettings, file:TFile, oldPath: string) {

	const separator = `${settings.separator}`;

	const activeFile = app.workspace.getActiveFile();

	const path = window.require("path");
	const oldName = path.basename(oldPath, `.${file.extension}`);
	const newName = file.basename

	if (!activeFile?.basename.includes(separator)) {
		if (activeFile && activeFile.parent) {

			const fileName = `${activeFile.basename}`;

			// const translatedName = await deeplTranslate(fileName, 'EN', settings.api);
			const translatedName = "placeholder"; // Replace with actual translation logic

			const extension = `.${activeFile.extension}`
			const newName = `${fileName} ${separator} ${translatedName}${extension}`;

			try {
				await app.fileManager.renameFile(activeFile, `${activeFile.parent.path}/${newName}`);
				console.log(activeFile)
			} catch (error) {
				console.error('Error renaming file:', error);
			}
		}else {
			new Notice('Something is wrong!');
		}

	}else if (oldName !== newName) {
		console.log("name changed", oldName, newName);
		const nameBeforeSeparator = newName.split(separator)[0];
		console.log("nameBeforeSeparator",nameBeforeSeparator);

	} else {
		new Notice('File already has a translated title!');
		return;
	}

}
