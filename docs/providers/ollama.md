---
sidebar_position: 41
---

# Ollama

The `ollama` provider is compatible with [Ollama](https://github.com/jmorganca/ollama), which enables access to Llama2, Codellama, Orca, Vicuna, Nous-Hermes, Wizard Vicuna, and more.

You can use it by specifying any of the following providers from the [Ollama library](https://ollama.ai/library):

- `ollama:llama2`
- `ollama:llama2:13b`
- `ollama:llama2:70b`
- `ollama:llama2-uncensored`
- `ollama:codellama`
- `ollama:orca-mini`
- and so on...

Supported environment variables:

- `OLLAMA_BASE_URL` - scheme, host name, and port (defaults to `http://localhost:11434`)
