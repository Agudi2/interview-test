# Sentari – “Transcript to Empathy” Pipeline

This repository implements the full 13-step Sentari diary processing pipeline. It converts a voice transcript into:

* A short, empathetic AI reply (≤ 25 chars)
* An updated long-term user profile

## Installation

Ensure you have Node.js 18+ installed, then:

```bash
pnpm install
```

## Simulations

* **First-ever entry** (no prior data):

  ```bash
  pnpm run simulate:first
  ```
* **100th entry** (with 99 mock entries):

  ```bash
  pnpm run simulate:hundred
  ```

Each command logs all 13 required steps:
`RAW_TEXT_IN`, `EMBEDDING`, `FETCH_RECENT`, …, `COST_LATENCY_LOG`.

## Development

* **Lint**:  `pnpm run lint`
* **Tests**: `pnpm run test`

## Assumptions

* Embeddings are mocked as fixed 8-dimensional vectors.
* Empathy replies are trimmed to 25 characters.
* Carry-in logic is randomly simulated.

*No actual API keys are committed. To enable real OpenAI calls, add `OPENAI_API_KEY` in a `.env` file.*
