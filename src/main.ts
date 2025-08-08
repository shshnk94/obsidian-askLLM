import { Notice, Plugin } from 'obsidian';
import { LLMAssistantSettings, DEFAULT_SETTINGS } from '@settings/settings';
import { LLMAssistantSettingTab } from '@settings/settingsTab';
import { CHAT_VIEW_TYPE, ChatView } from '@views/chatView';
import { LLMService } from '@services/llmService';

export default class LLMAssistant extends Plugin {
    settings: LLMAssistantSettings;
    llmService: LLMService;

    async onload() {
        await this.loadSettings();
        
        // Initialize services
        this.llmService = new LLMService(this.settings);

        this.addSettingTab(new LLMAssistantSettingTab(this.app, this));
        
        // Register the chat view
        this.registerView(
            CHAT_VIEW_TYPE,
            (leaf) => new ChatView(leaf, this)
        );

        // Add ribbon icon
        this.addRibbonIcon("message-square", "Open LLM Chat", async () => {
            this.activateChatView();
        });
    }

    async activateChatView() {
        let leaf = this.app.workspace.getRightLeaf(false);
        if (leaf) {
            await leaf.setViewState({
                type: CHAT_VIEW_TYPE,
                active: true,
            });
            this.app.workspace.revealLeaf(leaf);
        } else {
            new Notice("Unable to open chat view: no available workspace leaf.");
        }
    }

    onunload() {
        // Cleanup
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
        // Update service settings when changed
        this.llmService?.updateSettings(this.settings);
    }
}