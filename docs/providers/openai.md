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
- `OPENAI_ORGANIZATION` - the OpenAI organization key to use
- `PROMPTFOO_REQUIRE_JSON_PROMPTS` - by default the chat completion provider will wrap non-JSON messages in a single user message. Setting this envar to true disables that behavior.

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
  - openai:gpt-3.5-turbo-0613:
      prompts: chat_prompt
      config:
        temperature: 0
        max_tokens: 128
```

Supported parameters include:

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

// General OpenAI parameters
apiKey?: string;
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

