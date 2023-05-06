---
sidebar_position: 10
---

# Node package

## Installation

promptfoo is available as a node package [on npm](https://www.npmjs.com/package/promptfoo):

```
npm install promptfoo
```

## Usage

You can use `promptfoo` as a library in your Node.js project by importing the `evaluate` function. The function takes the following parameters:

- `providers`: a list of provider strings or `ApiProvider` objects, or just a single string or `ApiProvider`.
- `options`: the prompts and variables you want to test:

  ```typescript
  {
    prompts: string[];
    vars?: Record<string, string>;
  }
  ```

### Example

`promptfoo` exports an `evaluate` function that you can use to run prompt evaluations.

```javascript
import promptfoo from 'promptfoo';

const options = {
  prompts: ['Rephrase this in French: {{body}}', 'Rephrase this like a pirate: {{body}}'],
  vars: [{ body: 'Hello world' }, { body: "I'm hungry" }],
};

(async () => {
  const summary = await promptfoo.evaluate('openai:gpt-3.5-turbo', options);
  console.log(summary);
})();
```

This code imports the `promptfoo` library, defines the evaluation options, and then calls the `evaluate` function with these options. The results are logged to the console:

```js
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
    // ...
  ]
}
```

[See full example here](https://github.com/typpo/promptfoo/tree/main/examples/simple-import)
