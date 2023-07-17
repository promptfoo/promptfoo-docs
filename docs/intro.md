---
sidebar_position: 1
---

# Intro

`promptfoo` is a CLI and library for evaluating LLM output quality.

With promptfoo, you can:

- **Systematically test prompts** against predefined [test cases](/docs/configuration/expected-outputs)
- **Evaluate quality and catch regressions** by comparing LLM outputs [side-by-side](/docs/usage/web-ui)
- **Speed up evaluations** with [caching](/docs/configuration/caching) and concurrent tests
- **Score outputs automatically** by defining [expectations](/docs/configuration/expected-outputs)
- Use as a [CLI](/docs/usage/command-line), or integrate into your workflow as a [library](/docs/usage/node-package)
- Use OpenAI models, open-source models like Llama and Vicuna, or integrate custom API providers for [any LLM API](/docs/configuration/providers)

The goal: **test-driven prompt engineering**, not trial-and-error.

promptfoo produces matrix views that let you quickly evaluate outputs across many prompts.

Here's an example of a side-by-side comparison of multiple prompts and inputs:

![Side-by-side evaluation of LLM prompt quality](https://user-images.githubusercontent.com/310310/244891219-2b79e8f8-9b79-49e7-bffb-24cba18352f2.png)

It works on the command line too.

![LLM prompt quality evaluation with PASS/FAIL expectations](https://user-images.githubusercontent.com/310310/236690475-b05205e8-483e-4a6d-bb84-41c2b06a1247.png)

## Workflow and philosophy

Test-driven prompt engineering is much more effective than trial-and-error.

[Serious LLM development requires a systematic approach to prompt engineering](https://www.ianww.com/blog/2023/05/21/prompt-engineering-framework). Promptfoo streamlines the process of evaluating and improving language model performance.

1. **Define test cases**: Identify core use cases and failure modes. Prepare a set of prompts and test cases that represent these scenarios.
2. **Configure evaluation**: Set up your evaluation by specifying prompts, test cases, and API providers.
3. **Run evaluation**: Use the command-line tool or library to execute the evaluation and record model outputs for each prompt.
4. **Analyze results**: Set up automatic requirements, or review results in a structured format/web UI. Use these results to select the best model and prompt for your use case.

![test-driven llm ops](https://user-images.githubusercontent.com/310310/241601160-cf0461a7-2832-4362-9fbb-4ebd911d06ff.png)

As you gather more examples and user feedback, continue to expand your test cases.

### Example

Using promptfoo, we evaluate three prompts describing the impact of specific technologies on various industries. We substitute several example (technology, industry) pairs, generating a matrix of outputs for side-by-side evaluation.

Each output is graded based on predefined expectations. The results show that Prompt #3 satisfies 80% of the requirements, while Prompts #1 and #2 meet only 40%.

This technique can be applied iteratively to continuously improve prompt quality across diverse test cases.

![Evaluating prompts as a matrix](./assets/prompt-evaluation-matrix.png)
