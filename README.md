# Sentari – Transcript to Empathy Pipeline

This repository contains two parts:

1. **CLI Pipeline** (`template/`) – processes diary transcripts through all 13 steps.
2. **Frontend & API** (root) – a simple React UI and Express API.

## Prerequisites

* Node.js 18+ and pnpm

## Setup

```bash
# Install root (UI + API) dependencies\ npm install
# Install pipeline dependencies
cd template && pnpm install && cd ..
```

## CLI Pipeline Simulations

```bash
cd template
# First-ever entry (no history)
pm run simulate:first
# 100th entry (with 99 mocks)
pm run simulate:hundred
```

Outputs 13 log lines per run.

## API Server

```bash
# From project root
pnpm exec tsx server.ts
```

Server listens on [http://localhost:5174]

## Frontend UI

```bash
# From project root\ npm run dev
```

Open [http://localhost:5173/]

## Lint & Tests

```bash
# Pipeline
cd template && pnpm run lint && pnpm run test

# UI
cd .. && pnpm run lint
```

## Assumptions

* Embeddings are mocked as fixed 8-dimensional vectors.
* Empathy replies are trimmed to 25 characters.
* Carry-in logic is randomly simulated.
