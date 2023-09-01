---
sidebar_position: 1
---

# OpenAI

To use the OpenAI API, set the `OPENAI_API_KEY` environment variable or pass the API key as an argument to the constructor.

Example:

```bash
export OPENAI_API_KEY=your_api_key_here
```

The OpenAI provider supports the following model formats:

- `openai:chat` - defaults to gpt-3.5-turbo
- `openai:completion` - defaults to `text-davinci-003`
- `openai:<model name>` - uses a specific model name (mapped automatically to chat or completion endpoint)
- `openai:chat:<model name>` - uses any model name against the chat endpoint
- `openai:completion:<model name>` - uses any model name against the completion endpoint

The `openai:<endpoint>:<model>` construction is useful if OpenAI releases a new model, or if you have a custom model. For example, if OpenAI releases gpt-5 chat completion, you could begin using it immediately with `openai:chat:gpt-5`.

## Formatting chat messages

The [prompt file](/docs/configuration/parameters#prompt-files) supports a message in OpenAI's JSON prompt format.  This allows you to set multiple messages including the system prompt.  For example:

```json
[
  { "role": "system", "content": "You are a helpful assistant." },
  { "role": "user", "content": "Who won the world series in {{ year }}?" }
]
```

Equivalent yaml is also supported:

```yaml
- role: system
  content: You are a helpful assistant.
- role: user
  content: Who won the world series in {{ year }}?
```

## Configuring parameters

The `providers` list takes a `config` key that allows you to set parameters like `temperature`, `max_tokens`, and [others](https://platform.openai.com/docs/api-reference/chat/create#chat/create-temperature).  For example:

```yaml
providers:
  - id: openai:gpt-3.5-turbo-0613
    config:
      temperature: 0
      max_tokens: 128
      apiKey: sk-abc123
```

Supported parameters include:

| Parameter | Description |
|-----------|-------------|
| `temperature` | Controls the randomness of the AI's output. Higher values (close to 1) make the output more random, while lower values (close to 0) make it more deterministic. |
| `max_tokens` | Controls the maximum length of the output in tokens. |
| `top_p` | Controls the nucleus sampling, a method that helps control the randomness of the AI's output. |
| `frequency_penalty` | Applies a penalty to frequent tokens, making them less likely to appear in the output. |
| `presence_penalty` | Applies a penalty to new tokens (tokens that haven't appeared in the input), making them less likely to appear in the output. |
| `best_of` | Controls the number of alternative outputs to generate and select from. |
| `functions` | Allows you to define custom functions. Each function should be an object with a `name`, optional `description`, and `parameters`. |
| `function_call` | Controls whether the AI should call functions. Can be either 'none' or 'auto'. |
| `stop` | Defines a list of tokens that signal the end of the output. |
| `apiKey` | Your OpenAI API key. |
| `apiHost` | The hostname of the OpenAI API. |
| `organization` | Your OpenAI organization key. |

Here are the type declarations of `config` parameters:

```typescript
// Completion parameters
temperature?: number;
max_tokens?: number;
top_p?: number;
frequency_penalty?: number;
presence_penalty?: number;
best_of?: number;
functions?: {
  name: string;
  description?: string;
  parameters: any;
}[];
function_call?: 'none' | 'auto';
stop?: string[];

// General OpenAI parameters
apiKey?: string;
apiHost?: string;
organization?: string;
```

## Chat conversations

The OpenAI provider supports full "multishot" chat conversations, including multiple assistant, user, and system prompts.

The most straightforward way to do this is by creating a list of `{role, content}` objects.  Here's an example:

```yaml
prompts: ['prompt.json']

providers:
  - openai:gpt-3.5-turbo:
      id: openai:gpt-3.5-turbo

tests:
  - vars:
      messages:
        - role: system
          content: Respond as a pirate
        - role: user
          content: Who founded Facebook?
        - role: assistant
          content: Mark Zuckerberg
        - role: user
          content: Did he found any other companies?
```

Then the prompt itself is just a JSON dump of `messages`:

```liquid title=prompt.json
{{ messages | dump }}
```

### Simplified chat markup

Alternatively, you may prefer to specify a list of `role: message`, like this:

```yaml
tests:
  - vars:
      messages:
        - user: Who founded Facebook?
        - assistant: Mark Zuckerberg
        - user: Did he found any other companies?
```

This simplifies the config, but we need to work some magic in the prompt template:

```liquid title=prompt.json
[
{% for message in messages %}
  {% set outer_loop = loop %}
  {% for role, content in message %}
  {
    "role": "{{ role }}",
    "content": "{{ content }}"
  }{% if not (loop.last and outer_loop.last) %},{% endif %}
  {% endfor %}
{% endfor %}
]
```

### Creating a conversation history fixture

Using nunjucks templates, we can combine multiple chat messages.  Here's an example in which the previous conversation is a fixture for _all_ tests.  Each case tests a different follow-up message:

```yaml
# Set up the conversation history
defaultTest:
  - vars:
      previous_messages:
        - user: Who founded Facebook?
        - assistant: Mark Zuckerberg
        - user: What's his favorite food?
        - assistant: Pizza

# Test multiple follow-ups
tests:
  - vars:
      question: Did he create any other companies?
  - vars:
      question: What is his role at Internet.org?
  - vars:
      question: Will he let me borrow $5?
```

In the prompt template, we construct the conversation history followed by a user message containing the `question`:

```liquid title=prompt.json
[
  {% for message in messages %}
    {% set outer_loop = loop %}
    {% for role, content in message %}
      {
        "role": "{{ role }}",
        "content": "{{ content }}"
      },
    {% endfor %}
  {% endfor %}
  {
    "role": "user",
    "content": "{{ question }}"
  }
]
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

## Supported environment variables

These OpenAI-related environment variables are supported:

| Variable | Description |
|----------|-------------|
| `OPENAI_TEMPERATURE` | Temperature model parameter, defaults to 0. |
| `OPENAI_MAX_TOKENS` | Max_tokens model parameter, defaults to 1024. |
| `OPENAI_API_HOST` | The hostname to use (useful if you're using an API proxy). |
| `OPENAI_ORGANIZATION` | The OpenAI organization key to use. |
| `PROMPTFOO_REQUIRE_JSON_PROMPTS` | By default the chat completion provider will wrap non-JSON messages in a single user message. Setting this envar to true disables that behavior. |
| `PROMPTFOO_DELAY_MS` | Number of milliseconds to delay between API calls. Useful if you are hitting OpenAI rate limits (defaults to 0). |
| `PROMPTFOO_REQUEST_BACKOFF_MS` | Base number of milliseconds to backoff and retry if a request fails (defaults to 5000). |

## Troubleshooting

### OpenAI rate limits


There are a few things you can do if you encounter OpenAI rate limits (most commonly with GPT-4):

1. **Reduce concurrency to 1** by setting `--max-concurrency 1` in the CLI, or by setting `evaluateOptions.maxConcurrency` in the config.
2. **Set a delay between requests** by setting `--delay 3000` in the CLI, or by setting `evaluateOptions.delay` in the config, or with the environment variable `PROMPTFOO_DELAY_MS` (all values are in milliseconds).
3. **Adjust the exponential backoff for failed requests** by setting the environment variable `PROMPTFOO_REQUEST_BACKOFF_MS`.  This defaults to 5000 milliseconds and retries exponential up to 4 times.  You can increase this value if requests are still failing, but note that this can significantly increase end-to-end test time.
