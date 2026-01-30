import {App, Notice, Plugin, PluginSettingTab, Setting, TFile,} from 'obsidian';
import {titleRename} from "./src/titleRename";
import {LangCode} from "./src/language-detect/types";
import {LANGUAGES} from "./src/language-detect/constants";
import notTranslated from "./src/notTranslated";
import {FolderSuggest} from "./src/FolderSuggest";

export type LanguagesCode = {
	firstLanguage: LangCode | "AUTO";
	secondLanguage: LangCode;
}

export interface DualTitleTranslatorSettings {
	api: string;
	separator: string;
	untranslatableNames: string[];
	historySeparators: string[];
	selectedLanguages: LanguagesCode;
}

const DEFAULT_SETTINGS: DualTitleTranslatorSettings = {
	api: "",
	separator : '⇋',
	untranslatableNames: [],
	historySeparators: [],
	selectedLanguages:{
		firstLanguage: "AUTO",
		secondLanguage: "EN",
	}
}

export default class DualTitleTranslator extends Plugin {
	settings: DualTitleTranslatorSettings;
	isRenaming = false;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.vault.on('rename', (file: TFile) => {
				if (this.isRenaming) return;
				if (file.extension === 'md') {
					if (file.path === this.app.workspace.getActiveFile()?.path) {
						console.log(this.app.workspace.getActiveFile())
						const isInBlacklist = notTranslated({
							nameBlackList: this.settings.untranslatableNames,
							currentPath: this.app.workspace.getActiveFile()?.path ?? "/"
						})
						if (isInBlacklist)return;
						titleRename({
							app:this.app,
							settings:this.settings,
							saveSettings: () => this.saveSettings(),
							setRenaming: (value) => this.isRenaming = value
						})
					}
				}
			})
		);

		this.addCommand({
			id: 'rename-title',
			name: 'Rename title',
			callback: () => {
				titleRename({
					app:this.app,
					settings:this.settings,
					saveSettings: () => this.saveSettings(),
					setRenaming: (value) => this.isRenaming = value
				})
			}
		})

		this.addSettingTab(new DualTitleTranslatorSettingTab(this.app, this));

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class DualTitleTranslatorSettingTab extends PluginSettingTab {
	plugin: DualTitleTranslator;

	constructor(app: App, plugin: DualTitleTranslator) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('API Key')
			.addText(text => text
				.setPlaceholder('Enter your key')
				.setValue(this.plugin.settings.api)
				.onChange(async (value) => {
					this.plugin.settings.api = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Separator')
			.setDesc('Separator between file name and translated name')
			.addText(text => text
				.setPlaceholder('e.g. - ')
				.setValue(this.plugin.settings.separator)
				.onChange(async (value) => {
					if (!value.trim()) {
						new Notice('Separator cannot be empty. Please use at least one character.');
						text.setValue(this.plugin.settings.separator);
						return;
					}

					const invalidChars = /[<>:"/\\|?* ]/;
					if (invalidChars.test(value)) {
						new Notice('Invalid character in separator! The following characters are not allowed: < > : " / \\ | ? *');
						text.setValue(this.plugin.settings.separator);
						return;
					}
					this.plugin.settings.separator = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Select the main source language')
			.setDesc('From what language translate mostly')
			.addDropdown(dropdown => {
				[...Object.values(LANGUAGES), ...[{code:"AUTO", name:"Auto Detect", script:"N/A"}]]
				.forEach((lang) => {
					dropdown.addOption(lang.code, lang.name);
				})

				dropdown
					.setValue(this.plugin.settings.selectedLanguages.firstLanguage)
					.onChange(async (value) => {
						this.plugin.settings.selectedLanguages.firstLanguage = value as LangCode;
						await this.plugin.saveSettings();
					});
			})

		new Setting(containerEl)
			.setName('Select the second language')
			.setDesc('To what language translate mostly')
			.addDropdown(dropdown => {
				Object.values(LANGUAGES).forEach((lang) => {
					dropdown.addOption(lang.code, lang.name);
				});

				dropdown
					.setValue(this.plugin.settings.selectedLanguages.secondLanguage)
					.onChange(async (value) => {
						this.plugin.settings.selectedLanguages.secondLanguage = value as LangCode;
						await this.plugin.saveSettings();
					});
			})

		new Setting(containerEl)
			.setName('History of used separators')
			.setDesc('Previously used separators for easy selection')
			.addDropdown(dropdown => {
				this.plugin.settings.historySeparators.forEach((sep) => {
					dropdown.addOption(sep, sep);
				})

				dropdown
					.setValue(this.plugin.settings.separator)
					.onChange(async (value) => {
						this.plugin.settings.separator = value;
						await this.plugin.saveSettings();
					});
			})
			.addButton(button => {
				button.setButtonText('Clear History');
				button.onClick(async () => {
					this.plugin.settings.historySeparators = [];
					await this.plugin.saveSettings();
					this.display();
				});
			});

		let newFolderPath = "";
		new Setting(containerEl)
			.setName('Untranslatable folders')
			.setDesc('Exclude these folders from title translation')
			.addSearch(search => {
				search
					.setPlaceholder('path/to/folder')
					.setValue(newFolderPath)
					.onChange(value => newFolderPath = value.trim());

				new FolderSuggest(this.app, search.inputEl);
			})
			.addExtraButton(button => {
				button.setIcon('circle-plus');
				button.setTooltip('Add folder');
				button.onClick(async () => {
					if (!newFolderPath) return

					if (this.plugin.settings.untranslatableNames.includes(newFolderPath)) {
						new Notice('This folder is already added');
						return;
					}

					this.plugin.settings.untranslatableNames.push(newFolderPath);
					await this.plugin.saveSettings();
					this.display();
				});
			})

		this.plugin.settings.untranslatableNames.forEach((path,index) => {
			new Setting(containerEl)
				.setHeading()
				.setName(path)
				.addExtraButton(button => {
					button.setIcon('trash');
					button.setTooltip('Delete this path');
					button.onClick(async () => {
						this.plugin.settings.untranslatableNames.splice(index, 1);
						await this.plugin.saveSettings();
						this.display();
					});
				})
		})
	}
}
