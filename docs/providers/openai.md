---
sidebar_position: 1
---

# OpenAI

To use the OpenAI API, set the `OPENAI_API_KEY` environment variable or pass the API key as an argument to the constructor.

Example:

```bash
export OPENAI_API_KEY=your_api_key_here
```

Other OpenAI-related environment variables are supported:

- `OPENAI_TEMPERATURE` - temperature model parameter, defaults to 0
- `OPENAI_MAX_TOKENS` - max_tokens model parameter, defaults to 1024
- `OPENAI_API_HOST` - the hostname to use (useful if you're using an API proxy)
- `PROMPTFOO_REQUIRE_JSON_PROMPTS` - by default the chat completion provider will wrap non-JSON messages in a single user message. Setting this envar to true disables that behavior.

The OpenAI provider supports the following model formats:

- `openai:chat` - defaults to gpt-3.5-turbo
- `openai:completion` - defaults to `text-davinci-003`
- `openai:<model name>` - uses a specific model name (mapped automatically to chat or completion endpoint)
- `openai:chat:<model name>` - uses any model name against the chat endpoint
- `openai:completion:<model name>` - uses any model name against the completion endpoint

The `openai:<endpoint>:<model>` construction is useful if OpenAI releases a new model, or if you have a custom model. For example, if OpenAI releases gpt-5 chat completion, you could begin using it immediately with `openai:chat:gpt-5`.

## Configuring parameters

The `providers` list takes a `config` key that allows you to set parameters like `temperature`, `max_tokens`, and [others](https://platform.openai.com/docs/api-reference/chat/create#chat/create-temperature).  For example:

```yaml
providers:
  - openai:gpt-3.5-turbo-0613:
      prompts: chat_prompt
      config:
        temperature: 0
        max_tokens: 128
```

## Using functions

OpenAI functions are supported. See [full example](https://github.com/typpo/promptfoo/tree/main/examples/openai-function-call).

To set functions on an OpenAI provider, use the provider's `config` key. Add your function definitions under this key.

```yaml
prompts: [prompt.txt]
providers:
  - openai:chat:gpt-3.5-turbo-0613:
      config:
        "functions":
          [
            {
              "name": "get_current_weather",
              "description": "Get the current weather in a given location",
              "parameters":
                {
                  "type": "object",
                  "properties":
                    {
                      "location":
                        {
                          "type": "string",
                          "description": "The city and state, e.g. San Francisco, CA",
                        },
                      "unit":
                        { "type": "string", "enum": ["celsius", "fahrenheit"] },
                    },
                  "required": ["location"],
                },
            },
          ]
tests:
  - vars:
      city: Boston
  - vars:
      city: New York
  # ...
```

