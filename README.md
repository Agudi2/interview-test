# Sentari – Transcript to Empathy Pipeline

This repository contains two parts:

1. **CLI Pipeline** (`template/`) – processes diary transcripts through all 13 steps.
2. **Frontend & API** (root) – a simple React UI and Express API.

## Prerequisites

* Node.js 18+ and pnpm

## Setup

```bash
# Install root dependencies (API & UI)
pnpm install

# Install pipeline dependencies (template)
cd template
pnpm install
cd ..

# Install UI dependencies (template/ui)
cd template/ui
pnpm install
cd ../..
```

## CLI Pipeline Simulations

```bash
# Navigate to pipeline folder
cd template

# First-ever entry (no history)
pnpm run simulate:first

# 100th entry (with 99 mock entries)
pnpm run simulate:hundred
```

Logs 13 steps per run in `[TAG] input=… | output=… | note=…` format.

## API Server

```bash
# From project root\pnpm exec tsx server.ts
```

Server listens on [http://localhost:5174]

## Frontend UI

```bash
# From project root
pnpm run dev
```

Open [http://localhost:5173/]

## Lint & Tests

```bash
# Pipeline (CLI)
cd template
pnpm run lint
pnpm run test

# UI & API (root)
cd ..
pnpm run lint
```

## Assumptions

* Embeddings are mocked as fixed 8-dimensional vectors.
* Empathy replies are trimmed to 25 characters.
* Carry-in logic is randomly simulated.
