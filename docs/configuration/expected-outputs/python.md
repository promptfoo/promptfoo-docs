---
sidebar_position: 51
sidebar_label: Python
---

# Python assertions

The `python` assertion allows you to provide a custom Python function to validate the LLM output.

A variable named `output` is injected into the context. The function should return `true` if the output passes the assertion, and `false` otherwise. If the function returns a number, it will be treated as a score.

Example:

```yaml
assert:
  - type: python
    value: output[5:10] == 'Hello'
```

You may also return a number, which will be treated as a score:

```yaml
assert:
  - type: python
    value: math.log10(len(output)) * 10
```

## Multiline functions

Python assertions support multiline strings:

```yaml
assert:
  - type: python
    value: |
      // Insert your scoring logic here...
      if output == 'Expected output':
          print(json.dumps({
            'pass': True,
            'score': 0.5,
          }))
      else:
          print(json.dumps({
            'pass': False,
            'score': 0,
          }))
```

## Using test context

A `context` object is also available in the context.  Here is its type definition:

```py
class AssertContext:
    prompt: str
    vars: Dict[str, Union[str, object]]
```

For example, if the test case has a var `example`, access it in Python like this:

```yaml
tests:
  - description: 'Test with context'
    vars:
      example: 'Example text'
    assert:
      - type: python
        value: 'context['vars']['example'] in output'
```

## External .py

To reference an external file, use the `file://` prefix:

```yaml
    assert:
      - type: python
        value: file://relative/path/to/script.py
```

This file will be called from the shell in the form of: `python relative/path/to/assert.py <output> <context>`.  The contents of `stdout` are used as the assertion response.

The context variable is a JSON string, described above.  Here's an example assert.py:

```py
import json
import sys

def main():
    if len(sys.argv) >= 3:
        output = sys.argv[1]
        context = json.loads(sys.argv[2])
    else:
        raise ValueError("Model output and context are expected from promptfoo.")
    processed = preprocess_output(output)
    success = test_output(processed)
    return success

print(main())
```

## Other assertion types

For more info on assertions, see [Test assertions](/docs/configuration/expected-outputs).