---
sidebar_label: Github Actions
---

# Testing prompts with Github Actions

This guide describes how to automatically run a before vs. after evaluation of a prompt change using `promptfoo` and Github Actions.

The action will automatically run a full comparison and post it to the pull request:

![Github Action comment on modified LLM prompt](/img/docs/github-action-comment.png)

The provided link opens the [web viewer](/docs/usage/web-ui) interface, which allows you to interactively explore the before vs. after:

![promptfoo web viewer](https://user-images.githubusercontent.com/310310/244891219-2b79e8f8-9b79-49e7-bffb-24cba18352f2.png)

## Implementing the Github Action

Here's an example action that watches a PR for modifications.  If any file in the `prompts/` directory is modified, we automatically run the eval and post a link to the results:

```yml
name: LLM Prompt Evaluation

on:
  pull_request:
    paths:
      - 'prompts/**'

jobs:
  evaluate:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout base ref (original)
      uses: actions/checkout@v2
      with:
        ref: ${{ github.base_ref }}
        path: base

    - name: Checkout head ref (modified)
      uses: actions/checkout@v2
      with:
        ref: ${{ github.head_ref }}
        path: head

    - name: Cache promptfoo data
      id: cache
      uses: actions/cache@v2
      with:
        path: ~/.cache/promptfoo
        key: ${{ runner.os }}-promptfoo-${{ hashFiles('**/package-lock.json') }}
        restore-keys: |
          ${{ runner.os }}-promptfoo-

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: 16

    - name: Run promptfoo evaluation
      id: eval
      env:
        OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        PROMPTFOO_CACHE_PATH: ~/.cache/promptfoo
      run: |
        npx promptfoo eval -c head/prompts/promptfooconfig.yaml --prompts base/prompts/prompt1.json head/prompts/prompt1.json -o output.json --share
        echo "OUTPUT_JSON_PATH=$GITHUB_WORKSPACE/output.json" >> $GITHUB_ENV

    - name: Comment PR
      uses: actions/github-script@v6
      with:
        github-token: ${{secrets.GITHUB_TOKEN}}
        script: |
          const fs = require('fs');
          const output = JSON.parse(fs.readFileSync(process.env.OUTPUT_JSON_PATH, 'utf8'));
          const body = `⚠️ LLM prompt was modified.\n\n| Success | Failure |\n|---------|---------|\n| ${output.results.stats.successes}      | ${output.results.stats.failures}       |\n\n**» [View eval results](${output.shareableUrl}) «**`;
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: body
          });
```

## How to use the Action

To make this GitHub Action work for your project, you'll need to do a few things:

1. **Set paths**: Replace `'prompts/**'` with the path to the files you want to monitor for changes. This could either be a list of paths to single files, or a directory where your prompts are stored.

    Don't forget to also update the paths in the "Run promptfoo evaluation" step to point to prompts, as well as your `promptfooconfig.yaml` configuration file.

1. **Set OpenAI API key**: If you're using an OpenAI API, you need to set the `OPENAI_API_KEY` secret in your GitHub repository.

    To do this, go to your repositry's Settings > Secrets and variables > Actions > New repository secret and create on named OPENAI_API_KEY.

1. **Add it to your project**: Github automatically runs workflows in the `.github/workflows` directory, so save it as something like `.github/workflows/prompt-eval.yml`.

## How it works

1. **Checkouts**: The action begins by checking out the original (base) and modified (head) versions of the files. This allows us to compare changes made in the pull request.

1. **Caching**: We use caching to speed up subsequent runs. The cache stores LLM requests and outputs, which can be reused in future runs to save cost.

1. **Run Promptfoo Evaluation**: This is where the magic happens. We run the evaluation, passing in the configuration file and the prompts we want to evaluate. The results of this step are output to a JSON file.

1. **Comment on PR**: We read the output JSON file and create a comment on the pull request with the results of the evaluation.

