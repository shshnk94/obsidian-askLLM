import { ItemView, WorkspaceLeaf, MarkdownRenderer } from 'obsidian';
import { ChatMessage } from '@services/llmService';
import LLMAssistant from '../main';

export const CHAT_VIEW_TYPE = "llm-assistant-chat-view";

export class ChatView extends ItemView {
    plugin: LLMAssistant;
    messages: ChatMessage[] = [];

    constructor(leaf: WorkspaceLeaf, plugin: LLMAssistant) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return CHAT_VIEW_TYPE;
    }

    getDisplayText() {
        return "LLM Assistant Chat";
    }

    async onOpen() {
        this.render();
    }

    async onClose() {
        // Cleanup if needed
    }

    render() {
        const container = this.containerEl.children[1];
        container.empty();

        // Add title header
        const titleDiv = container.createDiv({ cls: "llm-chat-title" });
        titleDiv.createEl("h3", { text: "AskLLM", cls: "llm-chat-title-text" });

        // Chat history
        this.messages.forEach(async (msg) => {
            const msgDiv = container.createDiv({ cls: `llm-chat-msg llm-chat-msg-${msg.role}` });
            
            // Create header for sender
            const header = msgDiv.createDiv({ cls: 'llm-chat-header' });
            header.setText(msg.role === "user" ? "You" : "Assistant");
            
            // Create content area for rendered markdown
            const contentDiv = msgDiv.createDiv({ cls: 'llm-chat-content' });
            
            // Render markdown content
            await MarkdownRenderer.render(
                this.app,
                msg.content,
                contentDiv,
                '',
                this
            );
        });

        // Input box
        const inputDiv = container.createDiv({ cls: "llm-chat-input" });
        const input = inputDiv.createEl("input", { type: "text", placeholder: "Ask something..." });
        const sendBtn = inputDiv.createEl("button", { text: "Send" });

        sendBtn.onclick = async () => {
            const text = input.value.trim();
            if (!text) return;
            
            this.messages.push({ role: "user", content: text });
            this.render();
            input.value = "";

            // Get the active document's content as context
            const activeFile = this.app.workspace.getActiveFile();
            let contextMessages: ChatMessage[] = [];
            if (activeFile) {
                const documentContent = await this.app.vault.cachedRead(activeFile);
                contextMessages = [{ role: "system", content: `Context:\n${documentContent}` }];
                contextMessages = [...contextMessages, ...this.messages];
            }
            
            console.log("Generating response with context:", contextMessages);
            const reply = await this.plugin.llmService.generateResponse(contextMessages);
            this.messages.push({ role: "assistant", content: reply });
            this.render();
        };
    }
}