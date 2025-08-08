import OpenAI from 'openai';
import { LLMAssistantSettings } from '@settings/settings';

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

export class LLMService {
    private settings: LLMAssistantSettings;

    constructor(settings: LLMAssistantSettings) {
        this.settings = settings;
    }

    updateSettings(settings: LLMAssistantSettings) {
        this.settings = settings;
    }

    async generateResponse(history: ChatMessage[]): Promise<string> {
        const client = new OpenAI({
            baseURL: 'https://openrouter.ai/api/v1',
            apiKey: this.settings.apiKey,
            dangerouslyAllowBrowser: true
        });

        const messages: { role: "system" | "user" | "assistant", content: string }[] = [
            { role: 'system', content: this.settings.persona },
            ...history
        ];

        const response = await client.chat.completions.create({
            model: 'openai/gpt-4.1-nano',
            messages: messages,
            max_tokens: 100,
            temperature: 0.7,
        });

        const content = response.choices[0].message.content ?? '';
        console.log(content);
        return content;
    }
}