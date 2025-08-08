# LLM Assistant - Obsidian Plugin

An Obsidian plugin that integrates Large Language Model (LLM) capabilities directly into your note-taking workflow through an interactive chat interface.

## Features

- **Chat Interface**: Interactive sidebar chat view for conversing with an LLM
- **Configurable Settings**: Set your API key and customize the LLM persona
- **Easy Access**: One-click ribbon icon to open the chat interface
- **Markdown Support**: Full markdown rendering in chat responses
- **Context Aware**: Can reference your current document and workspace

## Installation

1. Download the plugin files to your Obsidian vault's `.obsidian/plugins/obsidian-assistant/` directory
2. Enable the plugin in Obsidian's Community Plugins settings
3. Configure your API key in the plugin settings

## Configuration

Go to **Settings → Community Plugins → LLM Assistant** to configure:

- **API Key**: Your OpenAI/OpenRouter API key
- **Persona**: Define how the LLM should behave and respond

## Usage

1. Click the chat icon (💬) in the ribbon to open the LLM Assistant chat
2. The chat interface will appear in the right sidebar
3. Type your questions or requests and press Enter to chat with the LLM
4. All conversations support full markdown formatting

## Requirements

- Obsidian v0.15.0+
- Valid API key from OpenAI or compatible service

## Development

This plugin is built with TypeScript and follows a modular architecture:

```
src/
├── main.ts              # Plugin entry point
├── settings/            # Configuration management
├── views/              # Chat interface
└── services/           # LLM API integration
```

## Contributing

Enthusiasts are welcome to open issues for bug reports, feature requests, or suggestions. If you'd like to contribute code, please create a pull request with your proposed changes.

## License

MIT