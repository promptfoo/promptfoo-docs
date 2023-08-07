---
sidebar_position: 50
---

# Custom API Provider

To create a custom API provider, implement the `ApiProvider` interface in a separate module. Here is the interface:

```javascript
export interface ApiProvider {
  id: () => string;
  callApi: (prompt: string) => Promise<ProviderResult>;
}
```

Below is an example of a custom API provider that returns a predefined output and token usage:

```javascript
// customApiProvider.js
import fetch from "node-fetch";

class CustomApiProvider {
  id() {
    return "my-custom-api";
  }

  async callApi(prompt) {
    // Add your custom API logic here

    return {
      // Required
      output: "Model output",

      // Optional
      tokenUsage: {
        total: 10,
        prompt: 5,
        completion: 5,
      },
    };
  }
}

module.exports = CustomApiProvider;
```

Include the custom provider in promptfoo config:

```yaml
providers: ['./customApiProvider.js']
```

Alternatively, you can pass the path to the custom API provider directly in the CLI:

```bash
promptfoo eval -p prompt1.txt prompt2.txt -o results.csv  -v vars.csv -r ./customApiProvider.js
```

This command will evaluate the prompts using the custom API provider and save the results to the specified CSV file.
