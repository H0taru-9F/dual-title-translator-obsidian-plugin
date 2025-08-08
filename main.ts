import {App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, TFile,} from 'obsidian';
import {titleRename} from "./src/titleRename";
// Remember to rename these classes and interfaces!

interface TranslatedFiles {
	path: string;
	name: string;
}

export interface DualTitleTranslatorSettings {
	translatedFiles: TranslatedFiles[];
	api: string;
	separator: string;
}

const DEFAULT_SETTINGS: DualTitleTranslatorSettings = {
	translatedFiles: [],
	api: "",
	separator : '⇋',
}



export default class DualTitleTranslator extends Plugin {
	settings: DualTitleTranslatorSettings;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.vault.on('rename', (file: TFile, oldPath:string) => {
				if (file.extension === 'md') {
					if (file.path === this.app.workspace.getActiveFile()?.path) {
						titleRename(this.app, this.settings, file, oldPath)
					}
				}
			})
		);

		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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

class SampleSettingTab extends PluginSettingTab {
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



	}
}
