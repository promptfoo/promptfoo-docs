---
sidebar_position: 20
---

# Azure

The `azureopenai` provider is an interface to OpenAI through Azure. It behaves the same as the [OpenAI provider](/docs/providers/openai).

It requires the `AZURE_OPENAI_API_KEY` environment variable to be set. All other `OPENAI_*` environment variables are supported.

- `azureopenai:chat:<deployment name>` - uses the given deployment (for chat endpoints such as gpt-35-turbo, gpt-4)
- `azureopenai:completion:<deployment name>` - uses the given deployment (for completion endpoints such as gpt-35-instruct)

Set the `apiHost` value to point to your endpoint:

```yaml
providers:
  - id: azureopenai:chat:deploymentNameHere
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
```

Additional config parameters are passed like this:

```yaml
providers:
  - id: azureopenai:chat:deploymentNameHere
    config:
      apiHost: 'xxxxxxxx.openai.azure.com'
      // highlight-start
      temperature: 0.5
      max_tokens: 1024
      // highlight-end
```

You may also specify `deployment_id` and `dataSources`, used to integrate with the [Azure Cognitive Search API](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/use-your-data#conversation-history-for-better-results).

```yaml
providers:
  - id: azureopenai:chat:deploymentNameHere
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

(The inconsistency in naming convention between `deployment_id` and `dataSources` reflects the actual naming in the Azure API.)
