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
| provider  | string | No       | Some assertions (similarity, llm-rubric) require an [LLM provider](/docs/configuration/providers) |

## Assertion Types

### Equality

The `equals` assertion checks if the LLM output is equal to the expected value.

Example:

```yaml
assert:
  - type: equals
    value: "The expected output"
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

The `javascript` assertion allows you to provide a custom JavaScript function to validate the LLM output. The function should return `true` if the output passes the assertion, and `false` otherwise.

Example:

```yaml
assert:
  - type: javascript
    value: "output.includes('Hello, World!')"
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

## Load an external tests file

The [Tests file](/docs/configuration/parameters#tests-file) is an optional format that lets you specify test cases outside of the main config file.

To add an assertion to a test case in a vars file, use the special `__expected` column.

Here's an example tests.csv:

```
text,__expected
"Hello, world!","Bonjour le monde"
"Goodbye, everyone!","fn:return output.includes('Au revoir');"
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
