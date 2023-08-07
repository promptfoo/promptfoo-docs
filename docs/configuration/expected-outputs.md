---
sidebar_position: 5
---

# Test assertions

Assertions are used to test the output of a language model (LLM) against expected values or conditions. While they are not required, they are a useful way to automate prompt engineering analysis.

Different types of assertions can be used to validate the output in various ways, such as checking for equality, JSON structure, similarity, or custom functions.

## Using assertions

To use assertions in your test cases, add an `assert` property to the test case with an array of assertion objects. Each assertion object should have a `type` property indicating the assertion type and any additional properties required for that assertion type.

Example:

```yaml
tests:
  - description: "Test if output is equal to the expected value"
    vars:
      example: "Hello, World!"
    assert:
      - type: equals
        value: "Hello, World!"
```

## Assertion properties

| Property  | Type   | Required | Description                                                                                       |
| --------- | ------ | -------- | ------------------------------------------------------------------------------------------------- |
| type      | string | Yes      | Type of assertion                                                                                 |
| value     | string | No       | The expected value, if applicable                                                                 |
| threshold | number | No       | The threshold value, only applicable for similarity                                               |
| weight    | string | No       | How heavily to weigh the assertion. Defaults to 1.0 |
| provider  | string | No       | Some assertions (similarity, llm-rubric) require an [LLM provider](/docs/configuration/providers) |

## Assertion Types

| Assertion Type  | Returns true if...                                                        |
| --------------- | ------------------------------------------------------------------------- |
| `equals`        | output matches exactly                                                    |
| `contains`      | output contains substring                                                 |
| `icontains`     | output contains substring, case insensitive                               |
| `regex`         | output matches regex                                                      |
| `contains-any`  | output contains any of the listed substrings                              |
| `contains-all`  | output contains all list of substrings                                    |
| `is-json`       | output is valid json                                                      |
| `contains-json` | output contains valid json                                                |
| `javascript`    | provided Javascript function validates the output                         |
| `python`        | provided Python function validates the output                             |
| `webhook`       | provided webhook returns `{pass: true}                                    |
| `similar`       | embeddings and cosine similarity are above a threshold                    |
| `llm-rubric`    | LLM output matches a given rubric, using a Language Model to grade output |

:::tip
Every test type can be negated by prepending `not-`. For example, `not-equals` or `not-regex`.
:::

### Equality

The `equals` assertion checks if the LLM output is equal to the expected value.

Example:

```yaml
assert:
  - type: equals
    value: "The expected output"
```

Here are the new additions to the "Assertion Types" section:

### Contains

The `contains` assertion checks if the LLM output contains the expected value.

Example:

```yaml
assert:
  - type: contains
    value: "The expected substring"
```

The `icontains` is the same, except it ignores case:

```yaml
assert:
  - type: icontains
    value: "The expected substring"
```

### Regex

The `regex` assertion checks if the LLM output matches the provided regular expression.

Example:

```yaml
assert:
  - type: regex
    value: "\\d{4}" # Matches a 4-digit number
```

### Contains-Any

The `contains-any` assertion checks if the LLM output contains at least one of the specified values.

Example:

```yaml
assert:
  - type: contains-any
    value:
      - "Value 1"
      - "Value 2"
      - "Value 3"
```

### Contains-All

The `contains-all` assertion checks if the LLM output contains all of the specified values.

Example:

```yaml
assert:
  - type: contains-all
    value:
      - "Value 1"
      - "Value 2"
      - "Value 3"
```

### Is-JSON

The `is-json` assertion checks if the LLM output is a valid JSON string.

Example:

```yaml
assert:
  - type: is-json
```

### Contains-JSON

The `contains-json` assertion checks if the LLM output contains a valid JSON structure.

Example:

```yaml
assert:
  - type: contains-json
```

### Javascript

The `javascript` assertion allows you to provide a custom JavaScript function to validate the LLM output. The function should return `true` if the output passes the assertion, and `false` otherwise. If the function returns a number, it will be treated as a score.

You can use any valid JavaScript code in your function. The output of the LLM is provided as the `output` variable:

```yaml
assert:
  - type: javascript
    value: "output.includes('Hello, World!')"
```

In the example above, the `javascript` assertion checks if the output includes the string "Hello, World!". If it does, the assertion passes and a score of 1 is recorded. If it doesn't, the assertion fails and a score of 0 is returned.

If you want to return a custom score, your function should return a number. For example:

```yaml
assert:
  - type: javascript
    value: Math.log(output.length) * 10
```

In the example above, the longer the output, the higher the score.

If your function throws an error, the assertion will fail and the error message will be included in the reason for the failure. For example:

```yaml
assert:
  - type: javascript
    value: "throw new Error('This is an error')"
```

### Using test context

The `context` variable contains test case variables.

For example, if your test case has a var `example`, you can access it in your JavaScript function like this:

```yaml
tests:
  - description: "Test with context"
    vars:
      example: "Example text"
    assert:
      - type: javascript
        value: "output.includes(context.vars.example)"
```

You can also use the `context` variable to perform more complex checks. For example, you could check if the output is longer than a certain length defined in your test case variables:

```yaml
tests:
  - description: "Test with context"
    vars:
      min_length: 10
    assert:
      - type: javascript
        value: "output.length >= context.vars.min_length"
```

### Python

The `python` assertion allows you to provide a custom Python function to validate the LLM output. The function should return `true` if the output passes the assertion, and `false` otherwise.

Example:

```yaml
assert:
  - type: python
    value: output[5:10] == 'Hello'
```

You may also return a number, which will be treated as a score:

```yaml
assert:
  - type: python
    value: math.log10(len(output)) * 10
```

### Webhook

The `webhook` assertion sends the LLM output to a specified webhook URL for custom validation. The webhook should return a JSON object with a `pass` property set to `true` or `false`.

Example:

```yaml
assert:
  - type: webhook
    value: "https://example.com/webhook"
```

The webhook will receive a POST request with a JSON payload containing the LLM output and the context (test case variables). For example, if the LLM output is "Hello, World!" and the test case has a variable `example` set to "Example text", the payload will look like:

```json
{
  "output": "Hello, World!",
  "context": {
    "vars": {
      "example": "Example text"
    }
  }
}
```

The webhook should process the request and return a JSON response with a `pass` property set to `true` or `false`, indicating whether the LLM output meets the custom validation criteria. Optionally, the webhook can also provide a `reason` property to describe why the output passed or failed the assertion.

Example response:

```json
{
  "pass": true,
  "reason": "The output meets the custom validation criteria"
}
```

If the webhook returns a `pass` value of `true`, the assertion will be considered successful. If it returns `false`, the assertion will fail, and the provided `reason` will be used to describe the failure.

You may also return a score:

```json
{
  "pass": true,
  "score": 0.5,
  "reason": "The output meets the custom validation criteria"
}
```

### Similarity

The `similarity` assertion checks if the LLM output is semantically similar to the expected value, using a cosine similarity threshold.

Example:

```yaml
assert:
  - type: similar
    value: "The expected output"
    threshold: 0.8
```

### LLM-Rubric

The `llm-rubric` assertion checks if the LLM output matches a given rubric, using a Language Model to grade the output based on the rubric.

Example:

```yaml
assert:
  - type: llm-rubric
    value: "The expected output"
```

Here's an example output that indicates PASS/FAIL based on LLM assessment ([see example setup and outputs](https://github.com/typpo/promptfoo/tree/main/examples/self-grading)):

[![LLM prompt quality evaluation with PASS/FAIL expectations](https://user-images.githubusercontent.com/310310/236690475-b05205e8-483e-4a6d-bb84-41c2b06a1247.png)](https://user-images.githubusercontent.com/310310/236690475-b05205e8-483e-4a6d-bb84-41c2b06a1247.png)

## Weighted assertions

In some cases, you might want to assign different weights to your assertions depending on their importance. The `weight` property is a number that determines the relative importance of the assertion. The default weight is 1.

The final score of the test case is calculated as the weighted average of the scores of all assertions, where the weights are the `weight` values of the assertions.

Here's an example:

```yaml
tests:
  - description: "Test with weighted assertions"
    vars:
      example: "Hello, World!"
    assert:
      - type: equals
        value: "Hello, World!"
        weight: 2
      - type: contains
        value: "World"
        weight: 1
```

In this example, the `equals` assertion is twice as important as the `contains` assertion. If the `equals` assertion fails but the `contains` assertion passes, the final score will be 0.67 (2/3), not 0.5 (1/2).

## Load an external tests file

The [Tests file](/docs/configuration/parameters#tests-file) is an optional format that lets you specify test cases outside of the main config file.

To add an assertion to a test case in a vars file, use the special `__expected` column.

Here's an example tests.csv:

```
text,__expected
"Hello, world!","Bonjour le monde"
"Goodbye, everyone!","fn:output.includes('Au revoir');"
"I am a pineapple","grade:doesn't reference any fruits besides pineapple"
```

All assertion types can be used in `__expected`. The column supports exactly one assertion.

- `is-json` and `contains-json` are supported directly, and do not require any value
- `fn` indicates `javascript` type. For example: `fn:output.includes('foo')`
- `similar` takes a threshold value. For example: `similar(0.8):hello world`
- `grade` indicates `llm-rubric`. For example: `grade: does not mention being an AI`
- By default, `__expected` will use type `equals`

When the `__expected` field is provided, the success and failure statistics in the evaluation summary will be based on whether the expected criteria are met.

For more advanced test cases, we recommend using a testing framework like [Jest](/docs/integrations/jest) or [Mocha](/docs/integrations/mocha-chai) and using promptfoo [as a library](/docs/usage/node-package).

## Reusing assertions with templates

If you have a set of common assertions that you want to apply to multiple test cases, you can create assertion templates and reuse them across your configuration.

```yaml
// highlight-start
assertionTemplates:
  containsMentalHealth:
    type: javascript
    value: output.toLowerCase().includes('mental health')
// highlight-end

prompts: [prompt1.txt, prompt2.txt]
providers: [openai:gpt-3.5-turbo, localai:chat:vicuna]
tests:
  - vars:
      input: Tell me about the benefits of exercise.
    assert:
      // highlight-next-line
      - $ref: "#/assertionTemplates/containsMentalHealth"
  - vars:
      input: How can I improve my well-being?
    assert:
      // highlight-next-line
      - $ref: "#/assertionTemplates/containsMentalHealth"
```

In this example, the `containsMentalHealth` assertion template is defined at the top of the configuration file and then reused in two test cases. This approach helps maintain consistency and reduces duplication in your configuration.
