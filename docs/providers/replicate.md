---
sidebar_position: 99
---

# Replicate

Replicate is an API for machine learning models. It currently hosts models like [Llama v2](https://replicate.com/replicate/llama70b-v2-chat).

To run a model, specify the Replicate model name and version, like so:

```
replicate:replicate/llama70b-v2-chat:e951f18578850b652510200860fc4ea62b3b16fac280f83ff32282f87bbd2e48
```

This example uses the `replicate/llama70b-v2-chat`, version `e951f...`.

Supported environment variables:

- `REPLICATE_API_TOKEN` - your Replicate API key
- `REPLICATE_MAX_LENGTH` - `max_length` property
- `REPLICATE_TEMPERATURE` - `temperature` property
- `REPLICATE_REPETITION_PENALTY` - `repitition_penalty` property
