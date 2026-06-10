# AWS Tools

This repository contains two Node.js applications implemented as a monorepo using modern best practices, clean architecture, and AWS Lambda-ready design.

## Project Structure

```
aws-tools/
├── shared/                 # Shared modules (config, logger, utils, etc.)
├── classifier-summarizer/  # Assignment 1: Text Classifier/Summarizer
└── notification-handler/   # Assignment 2: Notification Handler
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you want to use OpenAI or Mock provider (default: `OpenAI`).

## Running Assignment 1: Text Classifier / Summarizer

### Classify Mode
```bash
node classifier-summarizer/src/run.js --input classifier-summarizer/sample/emails.json --mode classify --log-level info
```

### Summarize Mode
```bash
node classifier-summarizer/src/run.js --input classifier-summarizer/sample/emails.json --mode summarize --log-level info
```

## Running Assignment 2: Notification Handler

```bash
node notification-handler/src/run.js --input notification-handler/sample/events.json --log-level info
```

## Running Tests

```bash
npm run test
```

## Architecture Overview

- **Clean Architecture:** Business logic is separated from infrastructure and delivery mechanisms. Services and Handlers contain core logic, while Providers and Repositories handle external integrations.
- **Provider Abstraction:** (Assignment 1) AI providers are abstracted behind the `AIProvider` interface, allowing easy swapping between OpenAI and Mock providers via configuration.
- **Event Handler Registry:** (Assignment 2) Uses an extensible registry of handlers. New event types can be added by creating a new handler class and registering it, following the Open/Closed Principle.
- **Repository Pattern:** (Assignment 2) Database operations are abstracted behind a repository interface.
- **Dependency Injection:** Components receive their dependencies (logger, providers, etc.) through constructors, making them highly testable and decoupled.
- **Zod Validation:** Robust schema validation for all inputs and event payloads, ensuring data integrity and automatic normalization (dates, roles).
