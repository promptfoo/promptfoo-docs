---
sidebar_position: 49
---

# Webhook Provider

The webhook provider can be useful for triggering more complex flows or prompt chains end to end in your app.

It is specified like so:

```
providers: [webhook:http://example.com/webhook]
```

promptfoo will send an HTTP POST request with the following JSON payload:
```json
{
  "prompt": "..."
}
```

It expects a JSON response in this format:
```json
{
  "output": "..."
}
```
