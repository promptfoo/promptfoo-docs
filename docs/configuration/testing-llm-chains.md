---
sidebar_position: 25
sidebar_label: LLM chains
---

# Testing LLM chains

Prompt chaining is a common pattern used to perform more complex reasoning with LLMs.  It's used by libraries like [LangChain](https://langchain.readthedocs.io/), and OpenAI has released baked-in support via [OpenAI functions](https://openai.com/blog/function-calling-and-other-api-updates).

A "chain" is defined by a list of LLM prompts that are executed sequentially (and sometimes conditionally).  The output of each LLM call is parsed/manipulated/executed, and then the result is fed into the next prompt.

This page explains how to test an LLM chain.  At a high level, you have these options:

- Break the chain into separate calls, and test those.  This is useful if your testing strategy is closer to unit tests, rather than end to end tests.

- Test the full end-to-end chain, with a single input and single output.  This is useful if you only care about the end result, and are not interested in how the LLM chain got there.

## Unit testing LLM chains

As mentioned above, the easiest way to test is one prompt at a time.  This can be done pretty easily with a basic promptfoo [configuration](/docs/configuration/guide).

Run `npx promptfoo init chain_step_X` to create the test harness for the first step of your chain.  After configuring test cases for that step, create a new set of test cases for step 2 and so on.

## End-to-end testing for LLM chains

promptfoo supports end-to-end testing of LLM chain implements through [custom providers](/docs/configuration/providers#custom-api-provider).

A custom provider is a short Javascript file that defines a `callApi` function.  This function can invoke your chain.  Even if your chain is not implemented in Javascript, you can write a custom provider that shells out to Python.

In the example below, we set up a custom provider that runs a Python script with a prompt as the argument.  The output of the Python script is the final result of the chain.

```js
// chainProvider.js
const { spawn } = require('child_process');

class ChainProvider {
  id() {
    return "my-python-chain";
  }

  async callApi(prompt) {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', ['./path_to_your_python_chain.py', prompt]);

      let output = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        reject(data.toString());
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(`python script exited with code ${code}`);
        } else {
          resolve({
            output,
          });
        }
      });
    });
  }
}

module.exports = ChainProvider;
```

Now, we can set up a promptfoo config pointing to `chainProvider.js`:

```yaml
prompts: [prompt1.txt, prompt2.txt]
// highlight-start
providers: ['./chainProvider.js']
// highlight-end
tests:
  - vars:
      language: French
      input: Hello world
  - vars:
      language: German
      input: How's it going?
```

promptfoo will pass the full constructed prompts to `chainProvider.js` and the Python script, with variables substituted.  In this case, the script will be called _# prompts_ * _# test cases_ = 2 * 2 = 4 times.

Using this approach, you can test your LLM chain end-to-end, view results in the [web view](/docs/usage/web-ui), set up [continuous testing](/docs/integrations/github-action), and so on.
