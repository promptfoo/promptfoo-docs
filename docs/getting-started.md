---
sidebar_position: 5
---

import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting started

To get started, run this command:

<Tabs>
  <TabItem value="npx" label="npx" default>
    <CodeBlock language="bash">
      npx promptfoo init
    </CodeBlock>
  </TabItem>
  <TabItem value="npm" label="npm" default>
    <CodeBlock language="bash">
      {`npm install -g promptfoo
promptfoo init`}
    </CodeBlock>
  </TabItem>
</Tabs>

This will create some templates in your current directory: `prompts.txt` and `promptfooconfig.yaml`.

1. **Set up your prompts**: Open `prompts.txt` and add 2 prompts that you want to compare. Use double curly braces as placeholders for variables: `{{variable_name}}`. For example:

   ```
   Convert this English to {{language}}: {{input}}
   ---
   Translate to {{language}}: {{input}}
   ```

   [&raquo; More information on setting up prompts](/docs/configuration/parameters)

1. **Add test inputs**: Edit `promptfooconfig.yaml` and add some example inputs for your prompts. Optionally, add assertions to automatically ensure that outputs meet your requirements.

   For example:

   ```yaml
   tests:
     - language: French
       input: Hello world
     - language: Spanish
       input: Where is the library?
   ```

   When writing test cases, think of core use cases and potential failures that you want to make sure your prompts handle correctly.

   [&raquo; More information on setting up tests](/docs/configuration/guide)

1. **Run the evaluation**: This tests every prompt for each test case:

   ```
   npx promptfoo eval
   ```

1. After the evaluation is complete, you may open the web viewer to review the outputs:

   ```
   npx promptfoo view
   ```

   [&raquo; More information on using the web viewer](/docs/usage/web-ui)

### Configuration

The YAML configuration format runs each prompt through a series of example inputs (aka "test case") and checks if they meet requirements (aka "assert").

Asserts are _optional_. Many people get value out of reviewing outputs manually, and the web UI helps facilitate this.

:::tip
See the [Configuration docs](/docs/configuration/guide) for a detailed guide.
:::

<details>
<summary>Show example YAML</summary>

```yaml
prompts: [prompts.txt]
providers: [openai:gpt-3.5-turbo]
tests:
  - description: First test case - automatic review
    vars:
      var1: first variable's value
      var2: another value
      var3: some other value
    assert:
      - type: equals
        value: expected LLM output goes here
      - type: function
        value: output.includes('some text')

  - description: Second test case - manual review
    # Test cases don't need assertions if you prefer to review the output yourself
    vars:
      var1: new value
      var2: another value
      var3: third value

  - description: Third test case - other types of automatic review
    vars:
      var1: yet another value
      var2: and another
      var3: dear llm, please output your response in json format
    assert:
      - type: contains-json
      - type: similar
        value: ensures that output is semantically similar to this text
      - type: llm-rubric
        value: ensure that output contains a reference to X
```

</details>

## Examples

### Prompt quality

In [this example](https://github.com/typpo/promptfoo/tree/main/examples/assistant-cli), we evaluate whether adding adjectives to the personality of an assistant bot affects the responses:

```bash
npx promptfoo eval -p prompts.txt -r openai:gpt-3.5-turbo -t tests.csv
```

![Peek 2023-05-01 13-53](https://user-images.githubusercontent.com/310310/235529431-f4d5c395-d569-448e-9697-cd637e0372a5.gif)

<!--
<img width="1362" alt="Side-by-side evaluation of LLM prompt quality, terminal output" src="https://user-images.githubusercontent.com/310310/235329207-e8c22459-5f51-4fee-9714-1b602ac3d7ca.png">

![Side-by-side evaluation of LLM prompt quality, html output](https://user-images.githubusercontent.com/310310/235483444-4ddb832d-e103-4b9c-a862-b0d6cc11cdc0.png)
-->

This command will evaluate the prompts in `prompts.txt`, substituing the variable values from `tests.csv`, and output results in your terminal.

Have a look at the setup and full output [here](https://github.com/typpo/promptfoo/tree/main/examples/assistant-cli).

You can also output a nice [spreadsheet](https://docs.google.com/spreadsheets/d/1nanoj3_TniWrDl1Sj-qYqIMD6jwm5FBy15xPFdUTsmI/edit?usp=sharing), [JSON](https://github.com/typpo/promptfoo/blob/main/examples/simple-cli/output.json), YAML, or an HTML file:

![Table output](https://user-images.githubusercontent.com/310310/235483444-4ddb832d-e103-4b9c-a862-b0d6cc11cdc0.png)

### Model quality

In [this example](https://github.com/typpo/promptfoo/tree/main/examples/gpt-3.5-vs-4), we evaluate the difference between GPT 3 and GPT 4 outputs for a given prompt:

```bash
npx promptfoo eval -p prompts.txt -r openai:gpt-3.5-turbo openai:gpt-4 -o output.html
```

Produces this HTML table:

![Side-by-side evaluation of LLM model quality, gpt3 vs gpt4, html output](https://user-images.githubusercontent.com/310310/235490527-e0c31f40-00a0-493a-8afc-8ed6322bb5ca.png)

Full setup and output [here](https://github.com/typpo/promptfoo/tree/main/examples/gpt-3.5-vs-4).

## Automatically assess outputs

The above examples create a table of outputs that can be manually reviewed. By setting up "Expected Outputs", you can automatically grade outputs on a pass/fail basis.

For more information on automatically assessing outputs, see [Expected Outputs](/docs/configuration/expected-outputs).
