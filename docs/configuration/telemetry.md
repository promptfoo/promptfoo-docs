---
sidebar_position: 200
---

# Telemetry

`promptfoo` collects basic telemetry by default. This telemetry helps us decide how to spend time on development:
- Number of commands run (e.g. `init`, `eval`, `view`)
- Number of assertions used by type (e.g. `is-json`, `similar`, `llm-rubric`)

No additional information is collected. The above list is exhaustive.

To disable telemetry, set the following environment variable:

```bash
PROMPTFOO_DISABLE_TELEMETRY=1
```
