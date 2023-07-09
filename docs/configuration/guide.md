---
sidebar_position: 0
sidebar_label: Guide
---

# Configuration

The YAML configuration format runs each prompt through a series of example inputs (aka "test case") and checks if they meet requirements (aka "assert").

Asserts are _optional_. Many people get value out of reviewing outputs manually, and the web UI helps facilitate this.

## Examples

Let's imagine we're building an app that does language translation. This config runs each prompt through GPT-3.5 and Vicuna, substituting three variables:

```yaml
prompts: [prompt1.txt, prompt2.txt]
providers: [openai:gpt-3.5-turbo, localai:chat:vicuna]
tests:
  - vars:
      language: French
      input: Hello world
  - vars:
      language: German
      input: How's it going?
```

:::tip

For more information on setting up a prompt file, see [input and output files](/docs/configuration/parameters).

:::

Running `promptfoo eval` over this config will result in a _matrix view_ that you can use to evaluate GPT vs Vicuna.

### Auto-validate output with assertions

Next, let's add an assertion. This automatically rejects any outputs that don't contain JSON:

```yaml
prompts: [prompt1.txt, prompt2.txt]
providers: [openai:gpt-3.5-turbo, localai:chat:vicuna]
tests:
  - vars:
      language: French
      input: Hello world
      // highlight-start
      assert:
        - type: contains-json
      // highlight-end
  - vars:
      language: German
      input: How's it going?
```

We can create additional tests. Let's add a couple other [types of assertions](/docs/configuration/expected-outputs). Use an array of assertions for a single test case to ensure all conditions are met.

In this example, the `javascript` assertion runs Javascript against the LLM output. The `similar` assertion checks for semantic similarity using embeddings:

```yaml
prompts: [prompt1.txt, prompt2.txt]
providers: [openai:gpt-3.5-turbo, localai:chat:vicuna]
tests:
  - vars:
      language: French
      input: Hello world
      assert:
        - type: contains-json
        // highlight-start
        - type: javascript
          value: output.toLowerCase().includes('bonjour')
        // highlight-end
  - vars:
      language: German
      input: How's it going?
      assert:
        // highlight-start
        - type: similar
          value: was geht
          threshold: 0.6   # cosine similarity
        // highlight-end
```

:::tip

To learn more about assertions, see docs on configuring [expected outputs](/docs/configuration/expected-outputs).

:::

### Avoiding repetition

#### Default test cases

You can use `defaultTest` to set an assertion for all tests. In this case, we use an `llm-rubric` assertion to ensure that the LLM does not refer to itself as an AI.

```yaml
prompts: [prompt1.txt, prompt2.txt]
providers: [openai:gpt-3.5-turbo, localai:chat:vicuna]
// highlight-start
defaultTest:
  assert:
    - type: llm-rubric
      value: does not describe self as an AI, model, or chatbot
// highlight-end
tests:
  - vars:
      language: French
      input: Hello world
      assert:
        - type: contains-json
        - type: javascript
          value: output.toLowerCase().includes('bonjour')
  - vars:
      language: German
      input: How's it going?
      assert:
        - type: similar
          value: was geht
          threshold: 0.6
```

#### YAML references

promptfoo configurations support JSON schema [references](https://opis.io/json-schema/2.x/references.html), which define reusable blocks.

Use the `$ref` key to re-use assertions without having to fully define them more than once.  Here's an example:

```yaml
prompts: [prompt1.txt, prompt2.txt]
providers: [openai:gpt-3.5-turbo, localai:chat:vicuna]
tests:
  - vars:
      language: French
      input: Hello world
      assert:
        - $ref: '#assertionTemplates/startsUpperCase'
  - vars:
      language: German
      input: How's it going?
      assert:
        - $ref: '#assertionTemplates/noAIreference'
        - $ref: '#assertionTemplates/startsUpperCase'

// highlight-start
assertionTemplates:
    noAIreference:
      - type: llm-rubric
        value: does not describe self as an AI, model, or chatbot
    startsUpperCase:
      - type: javascript
        value: output[0] === output[0].toUpperCase()
// highlight-end
```

### Multiple variables in a single test case

The `vars` map in the test also supports array values. If values are an array, the test case will run each combination of values.

For example:

```yaml
prompts: prompts.txt
providers: [openai:gpt-3.5-turbo, openai:gpt-4]
tests:
  - vars:
      // highlight-start
      language: [French, German, Spanish]
      input: ['Hello world', 'Good morning', 'How are you?']
      // highlight-end
    assert:
      - type: similar
        value: 'Hello world'
        threshold: 0.8
```

Evaluates each `language` x `input` combination:

<img alt="Multiple combinations of var inputs" src="https://user-images.githubusercontent.com/310310/243108917-dab27ca5-689b-4843-bb52-de8d459d783b.png" />

### Using nunjucks templates

In the above examples, `vars` values are strings.  But `vars` can be any JSON or YAML entity, including nested objects.  You can manipulate these objects in the prompt, which are [nunjucks](https://mozilla.github.io/nunjucks/) templates.

For example, consider this test case, which lists a handful of user and assistant messages in an OpenAI-compatible format:

```yaml
tests:
  - vars:
      previous_messages:
        - role: user
          content: hello world
        - role: assistant
          content: how are you?
        - role: user
          content: great, thanks
```

The corresponding `prompt.txt` file simply passes through the `previous_messages` object using the [dump](https://mozilla.github.io/nunjucks/templating.html#dump) and [safe](https://mozilla.github.io/nunjucks/templating.html#safe) filters to convert the object to a JSON string:

```nunjucks
{{ previous_messages | dump | safe }}
```

Running `promptfoo eval -p prompt.txt -c path_to.yaml` will call the Chat Completion API with the following prompt:

```json
[
  {
    "role": "user",
    "content": "hello world"
  },
  {
    "role": "assistant",
    "content": "how are you?"
  },
  {
    "role": "user",
    "content": "great, thanks"
  }
]
```

Use Nunjucks templates to exert additional control over your prompt templates, including loops, conditionals, and more.

### Other capabilities

promptfoo supports OpenAI functions and other provider-specific configurations. To use, override the `config` key of the provider. See example [here](/docs/configuration/providers#using-functions).

## Configuration structure

Here is the main structure of the promptfoo configuration file:

### Config

| Property    | Type                                 | Required | Description                                                                                                      |
| ----------- | ------------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------- |
| description | string                               | No       | Optional description of what your LLM is trying to do                                                            |
| providers   | string \| string[] \| [Record<string, {config: any}>](/docs/configuration/providers#using-functions)                   | Yes      | One or more [LLM APIs](/docs/configuration/providers) to use                                                                                      |
| prompts     | string \| string[]                   | Yes      | One or more prompt files to load                                                                                 |
| tests       | string \| [Test Case](#test-case) [] | Yes      | Path to a test file, OR list of LLM prompt variations (aka "test case")                                          |
| defaultTest | Partial [Test Case](#test-case)      | No       | Sets the default properties for each test case. Useful for setting an assertion, on all test cases, for example. |
| outputPath  | string                               | No       | Where to write output. Writes to console/web viewer if not set.                                                  |

### Test Case

A test case represents a single example input that is fed into all prompts and providers.

| Property             | Type                               | Required | Description                                                |
| -------------------- | ---------------------------------- | -------- | ---------------------------------------------------------- |
| description          | string                             | No       | Optional description of what you're testing                |
| vars                 | Record<string, string \| string[] \| any> | No       | Key-value pairs to substitute in the prompt                |
| assert               | [Assertion](#assertion)[]          | No       | Optional list of automatic checks to run on the LLM output |
| options              | Object                             | No       | Optional additional configuration settings                 |
| options.prefix       | string                             | No       | This is prepended to the prompt                            |
| options.suffix       | string                             | No       | This is append to the prompt                               |
| options.provider     | string                             | No       | The API provider to use for LLM rubric grading             |
| options.rubricPrompt | string                             | No       | The prompt to use for LLM rubric grading                   |

### Assertion

More details on using assertions, including examples [here](/docs/configuration/expected-outputs).

| Property  | Type   | Required | Description                                                                                           |
| --------- | ------ | -------- | ----------------------------------------------------------------------------------------------------- |
| type      | string | Yes      | Type of assertion                                                                                     |
| value     | string | No       | The expected value, if applicable                                                                     |
| threshold | number | No       | The threshold value, only applicable for `type=similar` (cosine distance)                             |
| provider  | string | No       | Some assertions (type = similar, llm-rubric) require an [LLM provider](/docs/configuration/providers) |

:::note

promptfoo supports `.js` and `.json` extensions in addition to `.yaml`.

It automatically loads `promptfooconfig.*`, but you can use a custom config file with `promptfoo eval -c path/to/config`.

:::

## Loading tests from CSV

YAML is nice, but some organizations maintain their LLM tests in spreadsheets for ease of collaboration. promptfoo supports a special [CSV file format](/docs/configuration/parameters#tests-file).

```yaml
prompts: [prompt1.txt, prompt2.txt]
providers: [openai:gpt-3.5-turbo, localai:chat:vicuna]
// highlight-next-line
tests: tests.csv
```

promptfoo also has built-in ability to pull test cases from a Google Sheet.  The sheet must be visible to "anyone with the link".  For example:


```yaml
prompts: [prompt1.txt, prompt2.txt]
providers: [openai:gpt-3.5-turbo, localai:chat:vicuna]
// highlight-next-line
tests: https://docs.google.com/spreadsheets/d/1eqFnv1vzkPvS7zG-mYsqNDwOzvSaiIAsKB3zKg9H18c/edit?usp=sharing
```
