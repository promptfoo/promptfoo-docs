---
sidebar_position: 1
---

# Intro

`promptfoo` is a library and command-line tool that helps you evaluate LLM prompt & model quality with a systematic approach to comparing model outputs.

With promptfoo, you can:

- **Test multiple prompts** against predefined test cases
- **Evaluate quality and catch regressions** by comparing LLM outputs side-by-side
- **Speed up evaluations** by running tests concurrently
- Use as a command line tool, or integrate into your workflow as a library
- Use OpenAI API models (built-in support), or integrate custom API providers for any LLM API

promptfoo works by producing matrix views that allow you to quickly review prompt outputs across many inputs. The goal: tune prompts systematically across all relevant test cases, instead of testing prompts one-off.

![Side-by-side evaluation of LLM prompt quality](https://user-images.githubusercontent.com/310310/235529431-f4d5c395-d569-448e-9697-cd637e0372a5.gif)

Here's an example of a side-by-side comparison of multiple prompts and inputs. You can manually review outputs, or set up "expectations" that automatically flag bad outputs:

![LLM prompt quality evaluation with PASS/FAIL expectations](https://user-images.githubusercontent.com/310310/236690475-b05205e8-483e-4a6d-bb84-41c2b06a1247.png)

## Workflow and philosophy

promptfoo's core philosophy is to help developers efficiently evaluate and compare the performance of language models using a well-structured, repeatable, and customizable process.

The goal: informed, data-driven decisions for prompt tuning. At a high level, here's how to use `promptfoo`:

1. **Define your test cases**: Identify the scenarios and inputs that are relevant to your application. Create a set of prompts and test cases that closely represent these scenarios.
2. **Configure your evaluation**: Set up your evaluation by specifying the prompts, test cases, and API providers you want to use. You can customize the evaluation process by configuring the input and output formats, the level of concurrency, and other options.
3. **Run the evaluation**: Execute the evaluation using the command-line tool or library. Promptfoo will evaluate your prompts against the specified API providers, generating side-by-side comparisons of their outputs.
4. **Analyze the results**: Review results in a structured format, such as CSV, JSON, YAML, or HTML, to make informed decisions about the best model and prompt choices for your application.

### Example

Below, we've used promptfoo to test out 3 different prompts that describe the impact of a given technology on an industry.

By substituting a handful of example (technology, industry) pairs, we've generated a matrix of outputs that we can evaluate side-by-side - either by human or automatically.

Each output is graded according to our expectations. Now, we can say that Prompt #3 satisfies 80% of requirements, whereas Prompts #1 and #2 only meet 40%.

We can use this technique repeatedly to ensure that we are iteratively improving prompt quality across the board.

![Evaluating prompts as a matrix](./assets/prompt-evaluation-matrix.png)

