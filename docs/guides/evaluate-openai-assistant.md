# How to evaluate OpenAI Assistants

OpenAI recently released an [Assistants API](https://platform.openai.com/docs/assistants/overview) that offers simplified handling for message state and tool usage.  It also enables code interpreter and knowledge retrieval features, abstracting away some of the dirty work for implementing RAG architecture.

[Test-driven development](/docs/intro#workflow-and-philosophy) allows you to compare prompts, models, and tools while measuring improvement and avoiding unexplained regressions.  It's an example of [systematic iteration vs. trial and error](https://ianww.com/blog/2023/05/21/prompt-engineering-framework).

This guide walks you through using promptfoo to select the best prompt, model, and tools using OpenAI's Assistants API.

## Step 1: Create an assistant

Use the [OpenAI playground](https://platform.openai.com/playground) to an assistant.  The eval will use this assistant with different instructions and models.

Add your desired functions and enable the code interpreter and retrieval as desired.

After you create an assistant, record its ID.  It will look similar to `asst_fEhNN3MClMamLfKLkIaoIpgB`.

## Step 2: Set up the eval

An eval config has a few key components:

- `prompts`: The user chat messages you want to test
- `providers`: The assistant(s) and/or LLM APIs you want to test
- `tests`: Individual test cases to try

Let's set up a basic `promptfooconfig.yaml`:

```yaml
prompts:
  - 'Help me out with this: {{message}}'
providers:
  - openai:assistant:asst_fEhNN3MClMamLfKLkIaoIpgB
tests:
  - vars:
      message: write a tweet about bananas
  - vars:
      message: what is the sum of 38.293 and the square root of 30300300
  - vars:
      message: reverse the string "all dogs go to heaven"
```

### Comparing providers

### Overriding the assistant config

### Adding metrics and assertions
