import {App, Notice, Plugin, PluginSettingTab, Setting, TFile,} from 'obsidian';
import {titleRename} from "./src/titleRename";

export interface DualTitleTranslatorSettings {
	api: string;
	separator: string;
	untranslatableNames: string[];
	historySeparators: string[];
}

const DEFAULT_SETTINGS: DualTitleTranslatorSettings = {
	api: "",
	separator : '⇋',
	untranslatableNames: [],
	historySeparators: []
}

export default class DualTitleTranslator extends Plugin {
	settings: DualTitleTranslatorSettings;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.vault.on('rename', (file: TFile) => {
				if (file.extension === 'md') {
					if (file.path === this.app.workspace.getActiveFile()?.path) {
						titleRename({
							app:this.app,
							settings:this.settings,
							saveSettings: this.saveSettings
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
					saveSettings: this.saveSettings
				})
			}
		})

		this.addSettingTab(new SampleSettingTab(this.app, this));

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
