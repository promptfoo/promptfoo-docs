---
sidebar_position: 15
---

# Using the web viewer

The web viewer is an experimental, work-in-progress UI for viewing prompt outputs side-by-side.

To start it, run:

```
npx promptfoo view
```

After you [run an eval](/docs/getting-started), the viewer will present the latest results in a view like this one:

![promptfoo web viewer](https://user-images.githubusercontent.com/310310/238143127-ddcd77df-2783-425e-ade9-1a20dd0b6cd2.png)

Currently, the viewer is just an easier way to look at output.  It automatically updates on every eval, and allows you to thumbs up/thumbs down individual outputs to more easily compare prompts.

Remember, you can always [output](/docs/configuration/parameters#output-file) to terminal, HTML, CSV, or JSON instead if you're looking for something more portable.

The web viewer is under development and will eventually include features such as: configuring and re-running evals and viewing history.
