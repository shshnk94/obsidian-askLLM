import { App, PluginSettingTab, Setting } from 'obsidian';
import LLMAssistant from '../main';

export class LLMAssistantSettingTab extends PluginSettingTab {
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