---
sidebar_position: 5
---

# Test assertions

Assertions are used to compare the LLM output against expected values or conditions. While assertions are not required to run an eval, they are a useful way to automate your analysis.

Different types of assertions can be used to validate the output in various ways, such as checking for equality, JSON structure, similarity, or custom functions.

In machine learning, "Accuracy" is a metric that measures the proportion of correct predictions made by a model out of the total number of predictions. With `promptfoo`, accuracy is defined as the proportion of prompts that produce the expected or desired output.

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
| provider  | string | No       | Some assertions (similarity, llm-rubric) require an [LLM provider](/docs/providers) |
| rubricPrompt | string | No       | LLM rubric grading prompt |

## Assertion Types

| Assertion Type  | Returns true if...                                                        |
| --------------- | ------------------------------------------------------------------------- |
| `equals`        | output matches exactly                                                    |
| `contains`      | output contains substring                                                 |
| `icontains`     | output contains substring, case insensitive                               |
| `regex`         | output matches regex                                                      |
| `starts-with`   | output starts with string                                                 |
| `contains-any ` | output contains any of the listed substrings                              |
| `contains-all`  | output contains all list of substrings                                    |
| `is-json`       | output is valid json (optional json schema validation)                    |
| `contains-json` | output contains valid json (optional json schema validation)              |
| `javascript`    | provided Javascript function validates the output                         |
| `python`        | provided Python function validates the output                             |
| `webhook`       | provided webhook returns `{pass: true}`                                   |
| `similar`       | embeddings and cosine similarity are above a threshold                    |
| `llm-rubric`    | LLM output matches a given rubric, using a Language Model to grade output |
| `rouge-n`       | Rouge-N score is above a given threshold                                  |
| `levenshtein`   | Levenshtein distance is below a threshold                                 |

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

### Starts-With

The `starts-with` assertion checks if the LLM output begins with the specified string.

This example checks if the output starts with "Yes":

```yaml
assert:
  - type: starts-with
    value: "Yes"
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

You may optionally set a `value` as a JSON schema.  If set, the output will be validated against this schema:

```yaml
assert:
  - type: is-json
    value:
      required: [latitude, longitude]
      type: object
      properties:
        latitude:
          minimum: -90
          type: number
          maximum: 90
        longitude:
          minimum: -180
          type: number
          maximum: 180
```

JSON is valid YAML, so you can also just copy in any JSON schema directly:

```yaml
  assert:
    - type: is-json
      value: {
        "required": ["latitude", "longitude"],
        "type": "object",
        "properties": {
          "latitude": {
            "type": "number",
            "minimum": -90,
            "maximum": 90,
          },
          "longitude": {
            "type": "number",
            "minimum": -180,
            "maximum": 180,
          }
        }
      }
  ```

### Contains-JSON

The `contains-json` assertion checks if the LLM output contains a valid JSON structure.

Example:

```yaml
assert:
  - type: contains-json
```

Just like `is-json` above, you may optionally set a `value` as a JSON schema in order to validate the JSON contents.

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

#### Multiline functions

Javascript assertions support multiline strings:

```yaml
assert:
  - type: javascript
    value: |
      // Insert your scoring logic here...
      if (output === 'Expected output') {
        return {
          pass: true,
          score: 0.5,
        };
      }
      return {
        pass: false,
        score: 0,
        reason: 'Assertion failed',
      };
```

#### Using test context

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

#### Using variables in the rubric

You can use test `vars` in the LLM rubric.  This example uses the `question` variable to help detect hallucinations:

```yaml
providers: [openai:gpt-3.5-turbo]
prompts: [prompt1.txt, prompt2.txt]
defaultTest:
  assert:
    - type: llm-rubric
      value: 'Says that it is uncertain or unable to answer the question: "{{question}}"'
tests:
  - vars:
      question: What's the weather in New York?
  - vars:
      question: Who won the latest football match between the Giants and 49ers?
```

#### Overriding the LLM grader

By default, `llm-rubric` uses GPT-4 for grading.  If you do not have access to GPT-4 or prefer not to use it, you can override the rubric grader.  There are several ways to do this, depending on your preferred workflow:

1. Using the `--grader` CLI option:

   ```
   promptfoo eval --grader openai:gpt-3.5-turbo
   ```

2. Using `test.options` or `defaultTest.options` on a per-test or testsuite basis:

   ```yaml
   defaultTest:
       options:
         provider: gpt-3.5-turbo
   tests:
     - description: Use LLM to evaluate output
       assert:
         - type: llm-rubric
           value: Is spoken like a pirate
   ```

3. Using `assertion.provider` on a per-assertion basis:

   ```yaml
   tests:
    - description: Use LLM to evaluate output
      assert:
        - type: llm-rubric
          value: Is spoken like a pirate
          provider: gpt-3.5-turbo
    ```

Note that [custom providers](/docs/providers/custom-api) are supported by the above as well.

### Levenshtein distance

The `levenshtein` assertion checks if the LLM output is within a given edit distance from an expected value.

Example:

```yaml
assert:
  # Ensure Levenshtein distance from "hello world" is <= 5
  - type: levenshtein
    threshold: 5
    value: hello world
```

## Weighted assertions

In some cases, you might want to assign different weights to your assertions depending on their importance. The `weight` property is a number that determines the relative importance of the assertion. The default weight is 1.

The final score of the test case is calculated as the weighted average of the scores of all assertions, where the weights are the `weight` values of the assertions.

Here's an example:

```yaml
tests:
  assert:
    - type: equals
      value: "Hello world"
      weight: 2
    - type: contains
      value: "world"
      weight: 1
```

In this example, the `equals` assertion is twice as important as the `contains` assertion.

If the LLM output is `Goodbye world`, the `equals` assertion fails but the `contains` assertion passes, and the final score is 0.33 (1/3).

### Setting a score requirement

Test cases support an optional `threshold` property.  If set, the pass/fail status of a test case is determined by whether the combined weighted score of all assertions exceeds the threshold value.

For example:

```yaml
tests:
  threshold: 0.5
  assert:
    - type: equals
      value: "Hello world"
      weight: 2
    - type: contains
      value: "world"
      weight: 1
```

If the LLM outputs `Goodbye world`, the `equals` assertion fails but the `contains` assertion passes and the final score is 0.33.  Because this is below the 0.5 threshold, the test case fails.  If the threshold were lowered to 0.2, the test case would succeed.

## Load an external tests file

The [Tests file](/docs/configuration/parameters#tests-file) is an optional format that lets you specify test cases outside of the main config file.

To add an assertion to a test case in a vars file, use the special `__expected` column.

Here's an example tests.csv:

| text | \_\_expected |
| --- | --- |
| Hello, world! | Bonjour le monde |
| Goodbye, everyone! | fn:output.includes('Au revoir'); |
| I am a pineapple | grade:doesn't reference any fruits besides pineapple |

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
