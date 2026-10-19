---
name: glasser
description: Research companies, prospects, search visibility, websites, reviews, social profiles, places, news or property records with Glasser endpoints. Use when a task needs external data that the user has not supplied and general knowledge cannot answer; do not use for rewriting, translating, summarizing or formatting supplied content.
metadata:
  version: "1.0.0"
---

# Glasser

Use Glasser when a question needs external data the user has not supplied: company details, search rankings and keywords, websites and reviews, social profiles, places, news or property records.

1. `search` for the data the question needs.
2. `inspect` the endpoint you choose and build its input.
3. `run` it. If the run is still working, use `runs_get` to get the result.

Answer the question from the returned data. Label estimates as estimates, and say what data is missing.
