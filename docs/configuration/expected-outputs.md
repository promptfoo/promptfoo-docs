---
sidebar_position: 10
---

# Expected outputs

You can specify an expected value for each test case to evaluate the success or failure of the model's output.

To do this, add a special field called `__expected` in the `vars` file.

## Types of evaluation

The `__expected` field supports these types of value comparisons:

1. **String equality**: By default, promptfoo attempts an exact string match comparison between the expected value and the model's output.

1. **Code evaluation**: If the expected value starts with `eval:`, it will evaluate the contents as the body of a JavaScript function defined like: `function(output) { <eval> }`. The function should return a boolean value, where `true` indicates success and `false` indicates failure.

  [Example setup and outputs](https://github.com/typpo/promptfoo/tree/main/examples/simple-test)

1. **LLM evaluation**: If the expected value starts with `grade:`, it will ask an LLM to evaluate whether the output meets the condition.

  For example: `grade: don't mention being an AI`

  To enable grading, you must supply a provider name to via the `--grader` argument:
  ```
  promptfoo --grader openai:gpt-4 ...
  ```

  Here's an example output that indicates PASS/FAIL based on LLM assessment:

  [![LLM prompt quality evaluation with PASS/FAIL expectations](https://user-images.githubusercontent.com/310310/236690475-b05205e8-483e-4a6d-bb84-41c2b06a1247.png)](https://user-images.githubusercontent.com/310310/236690475-b05205e8-483e-4a6d-bb84-41c2b06a1247.png)

  [Example setup and outputs](https://github.com/typpo/promptfoo/tree/main/examples/self-grading)

## Add expected values to the Vars file

Edit your [vars file](/docs/configuration/parameters#vars-file) and add an `__expected` column.

Here's an example vars.csv:

```
text,__expected
"Hello, world!","Bonjour le monde"
"Goodbye, everyone!","eval:return output.includes('Au revoir');"
"I am a pineapple","grade:doesn't reference any fruits besides pineapple"
```

Here's an example vars.json:

```json
[
  { "text": "Hello, world!", "__expected": "Bonjour le monde" },
  { "text": "Goodbye, everyone!", "__expected": "eval:output.includes('Au revoir');" },
  { "text": "I am a pineapple", "__expected": "grade:doesn't reference any fruits besides pineapple" }
]
```

When the `__expected` field is provided, the success and failure statistics in the evaluation summary will be based on whether the expected criteria are met.

For more advanced test cases, we recommend using a testing framework like [Jest](https://jestjs.io/) or [Mocha](https://mochajs.org/) and using promptfoo [as a library](/docs/node-package/).

