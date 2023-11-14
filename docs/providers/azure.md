---
sidebar_position: 20
---

# Azure

The `azureopenai` provider is an interface to OpenAI through Azure. It behaves the same as the [OpenAI provider](/docs/providers/openai).

It requires the `AZURE_OPENAI_API_KEY` environment variable to be set. All `OPENAI_*` environment variables are supported.

- `azureopenai:chat` - defaults to gpt-3.5-turbo
- `azureopenai:completion` - defaults to `text-davinci-003`
- `azureopenai:<model name>` - uses a specific model name (mapped automatically to chat or completion endpoint)
- `azureopenai:chat:<model name>` - uses any model name against the chat endpoint
- `azureopenai:completion:<model name>` - uses any model name against the completion endpoint

Config parameters may also be passed like so:

```yaml
providers:
  - id: azureopenai:chat:gpt-3.5-turbo
    prompts: chat_prompt
    config:
      temperature: 0.5
      max_tokens: 1024
```

If you have a custom host with a custom engine, here's how you can configure it:

```yaml
providers:
  - id: azureopenai:chat:engineNameGoesHere
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
```

You may also specify `deployment_id` and `dataSources`, which are used for integration with the [Azure Cognitive Search API](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/use-your-data#conversation-history-for-better-results).

```yaml
providers:
  - id: azureopenai:chat:engineNameGoesHere
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
      deployment_id: 'abc123'
      dataSources:
        - type: AzureCognitiveSearch
          parameters:
            endpoint: '...'
            key: '...'
            indexName: '...'
```
