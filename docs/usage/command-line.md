---
sidebar_position: 10
sidebar_label: Command line
---

# Command-line options

If you're looking to customize your usage, there are a wide set of `promptfoo eval` parameters at your disposal.

| Option                              | Description                                                                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-p, --prompts <paths...>`          | Paths to [prompt files](/docs/configuration/parameters#prompt-files), directory, or glob                                                                                     |
| `-r, --providers <name or path...>` | One of: openai:chat, openai:completion, openai:model-name, localai:chat:model-name, localai:completion:model-name. See [API providers](/docs/configuration/providers)        |
| `-o, --output <path>`               | Path to [output file](/docs/configuration/parameters#output-file) (csv, json, yaml, html)                                                                                    |
| `-t, --tests <path>`                | Path to [external test file](/docs/configuration/expected-outputs#load-an-external-tests-file)                                                                               |
| `-c, --config <path>`               | Path to [configuration file](/docs/configuration/guide). `promptfooconfig.js/json/yaml` is automatically loaded if present                                                   |
| `-j, --max-concurrency <number>`    | Maximum number of concurrent API calls                                                                                                                                       |
| `--table-cell-max-length <number>`  | Truncate console table cells to this length                                                                                                                                  |
| `--prompt-prefix <path>`            | This prefix is prepended to every prompt                                                                                                                                     |
| `--prompt-suffix <path>`            | This suffix is append to every prompt                                                                                                                                        |
| `--grader`                          | [Provider](/docs/configuration/providers) that will conduct the evaluation, if you are [using LLM to grade your output](/docs/configuration/expected-outputs#llm-evaluation) |
