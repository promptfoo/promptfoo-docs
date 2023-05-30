---
sidebar_position: 20
sidebar_label: Node package
---

# Using the node package

## Installation

promptfoo is available as a node package [on npm](https://www.npmjs.com/package/promptfoo):

```
npm install promptfoo
```

## Usage

You can use `promptfoo` as a library in your project by importing the `evaluate` function. The function takes the following parameters:

- `testSuite`: the Javascript equivalent of the promptfooconfig.yaml

  ```typescript
  interface TestSuiteConfig {
    providers: string[]; // Valid provider name (e.g. openai:gpt-3.5-turbo)
    prompts: string[]; // List of prompts
    tests: string | TestCase[]; // Path to a CSV file, or list of test cases

    defaultTestProperties?: Omit<TestCase, "description">; // Optional: add default vars and assertions on test case
    outputPath?: string; // Optional: write results to file
  }

  interface TestCase {
    description?: string;
    vars?: Record<string, string>;
    assert?: Assertion[];

    prompt?: PromptConfig;
    grading?: GradingConfig;
  }

  interface Assertion {
    type:
      | "equality"
      | "is-json"
      | "contains-json"
      | "function"
      | "similarity"
      | "llm-rubric";
    value?: string;
    threshold?: number; // For similarity assertions
    provider?: ApiProvider; // For assertions that require an LLM provider
  }
  ```

- `options`: misc options related to how the tests are run

  ```typescript
  interface EvaluateOptions {
    maxConcurrency?: number;
    showProgressBar?: boolean;
    generateSuggestions?: boolean;
  }
  ```

### Example

`promptfoo` exports an `evaluate` function that you can use to run prompt evaluations.

```js
import promptfoo from "promptfoo";

const results = await promptfoo.evaluate({
  prompts: [
    "Rephrase this in French: {{body}}",
    "Rephrase this like a pirate: {{body}}",
  ],
  providers: ["openai:gpt-3.5-turbo"],
  tests: [
    {
      vars: {
        body: "Hello world",
      },
    },
    {
      vars: {
        body: "I'm hungry",
      },
    },
  ],
});

console.log(results);
```

This code imports the `promptfoo` library, defines the evaluation options, and then calls the `evaluate` function with these options.

See the full example [here](https://github.com/typpo/promptfoo/tree/main/examples/simple-import).

Here's the example output in JSON format:

```json
{
  "results": [
    {
      "prompt": {
        "raw": "Rephrase this in French: Hello world",
        "display": "Rephrase this in French: {{body}}"
      },
      "vars": {
        "body": "Hello world"
      },
      "response": {
        "output": "Bonjour le monde",
        "tokenUsage": {
          "total": 19,
          "prompt": 16,
          "completion": 3
        }
      }
    },
    {
      "prompt": {
        "raw": "Rephrase this in French: I&#39;m hungry",
        "display": "Rephrase this in French: {{body}}"
      },
      "vars": {
        "body": "I'm hungry"
      },
      "response": {
        "output": "J'ai faim.",
        "tokenUsage": {
          "total": 24,
          "prompt": 19,
          "completion": 5
        }
      }
    }
    // ...
  ],
  "stats": {
    "successes": 4,
    "failures": 0,
    "tokenUsage": {
      "total": 120,
      "prompt": 72,
      "completion": 48
    }
  },
  "table": [
    [
      "Rephrase this in French: {{body}}",
      "Rephrase this like a pirate: {{body}}",
      "body"
    ],
    [
      "Bonjour le monde",
      "Ahoy thar, me hearties! Avast ye, world!",
      "Hello world"
    ],
    [
      "J'ai faim.",
      "Arrr, me belly be empty and me throat be parched! I be needin' some grub, matey!",
      "I'm hungry"
    ]
  ]
}
```
