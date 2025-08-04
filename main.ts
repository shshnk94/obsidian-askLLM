import { Notice, Plugin, TFile, MarkdownView, PluginSettingTab, Setting, App, Modal } from 'obsidian';
import OpenAI from 'openai';


interface LLMAssistantSettings {
	apiKey: string;
	persona: string;
}

const DEFAULT_SETTINGS: LLMAssistantSettings = {
	apiKey: '',
	persona: 'You are an assistant that provides helpful suggestions to improve the text.',
}

class SuggestImprovementsModal extends Modal {
	suggestion: string;
	onAccept: (suggestion: string) => void;
	onReject: () => void;

	constructor(app: App, suggestion: string, onAccept: (suggestion: string) => void, onReject: () => void) {
		super(app);
		this.suggestion = suggestion;
		this.onAccept = onAccept;
		this.onReject = onReject;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		contentEl.createEl('h3', { text: 'Auto-complete Suggestion' });
		contentEl.createEl('pre', { text: this.suggestion });

		const buttonContainer = contentEl.createDiv({ cls: 'modal-button-container' });

		const acceptBtn = buttonContainer.createEl('button', { text: 'Accept' });
		acceptBtn.onclick = () => {
			this.onAccept(this.suggestion);
			this.close();
		};

		const rejectBtn = buttonContainer.createEl('button', { text: 'Reject' });
		rejectBtn.onclick = () => {
			this.onReject();
			this.close();
		};
	}

	onClose() {
		this.contentEl.empty();
	}
}

class LLMAssistantSettingTab extends PluginSettingTab {
	plugin: LLMAssistant;

	constructor(app: App, plugin: LLMAssistant) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('API Key')
			.setDesc('Enter your OpenAI API key')
			.addText(text => text
				.setPlaceholder('Enter your API key')
				.setValue(this.plugin.settings.apiKey)
				.onChange(async (value) => {
					this.plugin.settings.apiKey = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Persona')
			.setDesc('Define the persona for the LLM to use when generating suggestions.')
			.addTextArea(text => text
				.setPlaceholder('Enter the persona description')
				.setValue(this.plugin.settings.persona)
				.onChange(async (value) => {
					this.plugin.settings.persona = value;
					await this.plugin.saveSettings();
				}));
	}
}

export default class LLMAssistant extends Plugin {
	settings: LLMAssistantSettings;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new LLMAssistantSettingTab(this.app, this));
		
		this.registerDomEvent(document, 'keydown', async (evt: KeyboardEvent) => {
			if (
				evt.key.toLowerCase() === 'i' &&
				evt.ctrlKey && // Option key on macOS
				!evt.altKey &&
				!evt.shiftKey &&
				!evt.metaKey
			) {
				const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
				const editor = activeView?.editor;
				const activeFile = this.app.workspace.getActiveFile();
				if (editor && activeFile) {
					const selection = editor.getSelection();
					if (selection && selection.length > 0) {
						evt.preventDefault();
						const response = await this.suggestImprovements(selection);
						if (response) {
							new SuggestImprovementsModal(
								this.app,
								response,
								(suggestion) => {
									const from = editor.getCursor('from');
									const to = editor.getCursor('to');
									editor.replaceRange(suggestion, from, to);
								},
								() => {}
							).open();
						}
					}
				}
			}
		});
	}

	async suggestImprovements(text: string): Promise<string> {

		// My key : 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
		const client = new OpenAI({
			baseURL: 'https://openrouter.ai/api/v1',
  			apiKey: this.settings.apiKey,
			dangerouslyAllowBrowser: true
		});

		const response = await client.chat.completions.create({
			model: 'openai/gpt-4.1-nano',
			messages: [
				{ role: 'system', content: this.settings.persona },
				{ role: 'user', content: text }
			],
			max_tokens: 100,
			temperature: 0.7,
		});

		const content = response.choices[0].message.content ?? '';
		new Notice(`Summary: ${content}`);
		return content;
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
