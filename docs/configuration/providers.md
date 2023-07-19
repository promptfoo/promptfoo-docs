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

### Replicate

Replicate is an API for machine learning models.  It currently hosts models like [Llama v2](https://replicate.com/replicate/llama70b-v2-chat).

To run a model, specify the Replicate model name and version, like so:

```
replicate:replicate/llama70b-v2-chat:e951f18578850b652510200860fc4ea62b3b16fac280f83ff32282f87bbd2e48
```

This example uses the `replicate/llama70b-v2-chat`, version `e951f...`.

Supported environment variables:

- `REPLICATE_API_TOKEN` - your Replicate API key

### Script Provider

You may use any shell command as an API provider. This is particularly useful when you want to use a language or framework that is not directly supported by promptfoo.

While Script Providers are particularly useful for evaluating chains, they can generally be used to test your prompts if they are implemented in Python or some other language.

To use a script provider, you need to create an executable that takes a prompt as its first argument and returns the result of the API call. The script should be able to be invoked from the command line.

Here is an example of how to use a script provider:

```yaml
providers: ['script: python chain.py']
```

Or in the CLI:

```bash
promptfoo eval -p prompt1.txt prompt2.txt -o results.csv  -v vars.csv -r 'script: python chain.py'
```

In the above example, `chain.py` is a Python script that takes a prompt as an argument, executes an LLM chain, and outputs the result.

For a more in-depth example of a script provider, see the [LLM Chain](/docs/configuration/testing-llm-chains#using-a-script-provider) example.

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

Include the custom provider in promptfoo config:

```yaml
providers: ['./customApiProvider.js']
```

Alternatively, you can pass the path to the custom API provider directly in the CLI:

```bash
promptfoo eval -p prompt1.txt prompt2.txt -o results.csv  -v vars.csv -r ./customApiProvider.js
```

This command will evaluate the prompts using the custom API provider and save the results to the specified CSV file.
