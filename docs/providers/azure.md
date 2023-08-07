---
sidebar_position: 20
---

# Azure

The `azureopenai` provider is an interface to OpenAI through Azure.  It behaves the same as the [OpenAI provider](/providers/openai).

It requires the `AZURE_OPENAI_API_KEY` environment variable to be set.  All `OPENAI_*` environment variables are supported.

- `azureopenai:chat` - defaults to gpt-3.5-turbo
- `azureopenai:completion` - defaults to `text-davinci-003`
- `azureopenai:<model name>` - uses a specific model name (mapped automatically to chat or completion endpoint)
- `azureopenai:chat:<model name>` - uses any model name against the chat endpoint
- `azureopenai:completion:<model name>` - uses any model name against the completion endpoint

Config parameters may also be passed like so:

```yaml
providers:
  - azureopenai:chat:gpt-3.5-turbo:
      prompts: chat_prompt
      config:
        temperature: 0.5
        max_tokens: 1024
```

