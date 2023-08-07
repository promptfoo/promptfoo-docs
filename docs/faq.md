---
sidebar_label: FAQ
---

# Frequently asked questions

### Does promptfoo forward calls to an intermediate server?

No, the source code is executed on your machine. Any call to LLM APIs (OpenAI, Anthropic, etc) are sent directly to the LLM provider. The authors of promptfoo do not have access to these requests.

### Does promptfoo store API keys or LLM inputs and outputs?

No, promptfoo runs locally and all data remains on your local machine.

If you explicitly run the [share command](/usage/sharing), then your inputs/outputs are stored in Cloudflare KV for 2 weeks.  This only happens when you run `promptfoo share` or click the "Share" button in the web UI.

### Do you collect any PII?

No, We do not collect any PII (personally identifiable information).
