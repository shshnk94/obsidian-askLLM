export interface LLMAssistantSettings {
    apiKey: string;
    persona: string;
}

export const DEFAULT_SETTINGS: LLMAssistantSettings = {
    apiKey: '',
    persona: 'You are an assistant that provides helpful suggestions to improve the text.',
};