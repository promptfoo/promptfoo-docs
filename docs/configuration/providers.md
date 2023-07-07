---
sidebar_position: 20
---

# API providers

`promptfoo` supports OpenAI API models out of the box. To use a custom API provider, create a custom module that implements the `ApiProvider` interface and pass the path to the module as the `provider` option.

### OpenAI

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

#### Using functions

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

### LocalAI

LocalAI is an API wrapper for open-source LLMs that is compatible with OpenAI. You can run LocalAI for compatibility with Llama, Alpaca, Vicuna, GPT4All, RedPajama, and many other models compatible with the ggml format.

View all compatible models [here](https://github.com/go-skynet/LocalAI#model-compatibility-table).

Once you have LocalAI up and running, specify one of the following based on the model you have selected:

- `localai:chat:<model name>`
- `localai:completion:<model name>`
- `localai:<model name>` - defaults to chat-type model

The model name is typically the filename of the .bin file that you downloaded to set up the model in LocalAI. For example, `ggml-vic13b-uncensored-q5_1.bin`

Supported environment variables:

- `LOCALAI_BASE_URL` - defaults to `http://localhost:8080/v1`
- `REQUEST_TIMEOUT_MS` - maximum request time, in milliseconds. Defaults to 60000.

### Custom API Provider

To create a custom API provider, implement the `ApiProvider` interface in a separate module. Here is the interface:

```javascript
export interface ApiProvider {
  id: () => string;
  callApi: (prompt: string) => Promise<ProviderResult>;
}
```

Below is an example of a custom API provider that returns a predefined output and token usage:

```javascript
// customApiProvider.js
import fetch from "node-fetch";

class CustomApiProvider {
  id() {
    return "my-custom-api";
  }

  async callApi(prompt) {
    // Add your custom API logic here

    return {
      // Required
      output: "Model output",

      // Optional
      tokenUsage: {
        total: 10,
        prompt: 5,
        completion: 5,
      },
    };
  }
}

module.exports = CustomApiProvider;
```

To use the custom API provider with `promptfoo`, pass the path to the module as the `provider` option in the CLI invocation:

```bash
promptfoo eval -p prompt1.txt prompt2.txt -o results.csv  -v vars.csv -r ./customApiProvider.js
```

This command will evaluate the prompts using the custom API provider and save the results to the specified CSV file.
