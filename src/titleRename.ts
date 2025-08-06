import {App, Notice} from "obsidian";
import {DualTitleTranslatorSettings} from "../main";

export default async function titleRename(app:App, settings:DualTitleTranslatorSettings) {

	const separator = ` ${settings.separator} `;

	const activeFile = app.workspace.getActiveFile();


	if (activeFile && activeFile.parent) {

		const fileName = `${activeFile.basename}`;

		// const translatedName = await deeplTranslate(fileName, 'EN', settings.api);
		const translatedName = "placeholder"; // Replace with actual translation logic

		const extension = `.${activeFile.extension}`
		const newName = `${fileName}${separator}${translatedName}${extension}`;

		try {
			await app.fileManager.renameFile(activeFile, `${activeFile.parent.path}/${newName}`);
			console.log(activeFile)
		} catch (error) {
			console.error('Error renaming file:', error);
		}
	}else {
		new Notice('Something is wrong!');
	}

}
