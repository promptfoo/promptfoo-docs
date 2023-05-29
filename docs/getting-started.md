---
sidebar_position: 5
---

import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Getting started

To get started, run the following command:

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

This will create some templates in your current directory: `prompts.txt`, `vars.csv`, and `promptfooconfig.js`.

1. **Set up your prompts**: Open `prompts.txt` and add 2 prompts that you want to compare. Use double curly braces as placeholders for variables: `{{variable_name}}`. For example:

   ```
   Convert this English to {{language}}: {{input}}
   ---
   Translate to {{language}}: {{input}}
   ```

1. **Create test cases**: Edit `vars.csv` and add variables that you want to substitute in the prompt.

   The first row are the variable names. All other rows are test cases:

   ```
   language,input
   German,"Hello, world!"
   Spanish,Where is the library?
   ```

   When writing test cases, think of core use cases and potential failures that you want to make sure your prompts handle correctly.

   For more info on test case setup, see [Vars configuration](/docs/configuration/parameters#vars-file). For more info on creating test cases, see [Expected Outputs](/docs/configuration/expected-outputs).

1. **Run the evaluation**: This tests every prompt for each test case:

   ```
   npx promptfoo eval
   ```

1. After the eval is complete, you may optionally open the web viewer:

   ```
   npx promptfoo view
   ```

## Command-line options

If you're looking to customize your usage, there are a wide set of `promptfoo eval` parameters at your disposal. See the [Configuration docs](/docs/configuration/parameters) for more detail:

| Option                              | Description                                                                                                                                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-p, --prompts <paths...>`          | Paths to prompt files, directory, or glob                                                                                                                             |
| `-r, --providers <name or path...>` | One of: openai:chat, openai:completion, openai:model-name, localai:chat:model-name, localai:completion:model-name. See [API providers](/docs/configuration/providers) |
| `-o, --output <path>`               | Path to output file (csv, json, yaml, html)                                                                                                                           |
| `-v, --vars <path>`                 | Path to file with prompt variables (csv, json, yaml)                                                                                                                  |
| `-c, --config <path>`               | Path to configuration file. `promptfooconfig.js[on]` is automatically loaded if present                                                                               |
| `-j, --max-concurrency <number>`    | Maximum number of concurrent API calls                                                                                                                                |
| `--table-cell-max-length <number>`  | Truncate console table cells to this length                                                                                                                           |
| `--prompt-prefix <path>`            | This prefix is prepended to every prompt                                                                                                                              |
| `--prompt-suffix <path>`            | This suffix is append to every prompt                                                                                                                                 |
| `--grader`                          | Provider that will conduct the evaluation, if you are [using LLM to grade your output](/docs/configuration/expected-outputs#llm-evaluation)                           |

## Examples

### Prompt quality

In [this example](https://github.com/typpo/promptfoo/tree/main/examples/assistant-cli), we evaluate whether adding adjectives to the personality of an assistant bot affects the responses:

```bash
npx promptfoo eval -p prompts.txt -v vars.csv -r openai:gpt-3.5-turbo
```

![Peek 2023-05-01 13-53](https://user-images.githubusercontent.com/310310/235529431-f4d5c395-d569-448e-9697-cd637e0372a5.gif)

<!--
<img width="1362" alt="Side-by-side evaluation of LLM prompt quality, terminal output" src="https://user-images.githubusercontent.com/310310/235329207-e8c22459-5f51-4fee-9714-1b602ac3d7ca.png">

![Side-by-side evaluation of LLM prompt quality, html output](https://user-images.githubusercontent.com/310310/235483444-4ddb832d-e103-4b9c-a862-b0d6cc11cdc0.png)
-->

This command will evaluate the prompts in `prompts.txt`, substituing the variable values from `vars.csv`, and output results in your terminal.

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

### Automatically assess outputs

The above examples create a table of outputs that can be manually reviewed. By setting up "Expected Outputs", you can automatically grade outputs on a pass/fail basis.

For more information on automatically assessing outputs, see [Expected Outputs](/docs/configuration/expected-outputs).
