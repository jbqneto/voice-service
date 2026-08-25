# Voice Service

A lightweight asynchronous Text-to-Speech (TTS) service built with Node.js, TypeScript, Express, Docker, and Piper.

The project provides a provider-agnostic API for submitting TTS jobs and is designed to run efficiently on CPU-only environments, including ARM64 systems.

## Features

- Asynchronous TTS job processing
- Provider abstraction using the Strategy Pattern
- Provider selection through a registry
- Piper as the initial TTS provider
- HTTP callback when a job completes
- Docker and Docker Compose support
- CPU-only execution
- ARM64-friendly deployment
- Persistent storage for downloaded voice models
- Simple HTTP API

## Architecture

```text
Client
  |
  | HTTP
  v
voice-service:3000
  |
  | Internal HTTP
  v
piper:5000
  |
  v
Voice Model
```

The application and TTS engine run as separate containers connected through an internal Docker network.

## Requirements

- Docker
- Docker Compose v2
- Linux, macOS, or Windows for development
- ARM64 or x86_64 supported by the underlying Docker images
- CPU-only environments are supported

## Getting Started

Clone the repository and create the environment configuration:

```bash
cp .env.example .env
```

Build and start the services:

```bash
docker compose build
docker compose up -d
```

The first startup may take longer because the Piper image is built and the configured voice model is downloaded.

## Configuration

Configuration is provided through environment variables:

```env
PORT=3000
PIPER_URL=http://piper:5000
PIPER_VOICE=pt_BR-cadu-medium
TTS_CALLBACK_URL=
```

### `PIPER_VOICE`

Defines the Piper voice model used for synthesis.

The default configuration uses a Brazilian Portuguese voice. Any compatible Piper voice can be configured through this variable.

### `TTS_CALLBACK_URL`

Optional HTTP endpoint that receives the result of a completed or failed job.

If it is not configured, the service still processes the TTS job but does not send a callback.

## API

### Health Check

```http
GET /health
```

Example response:

```json
{
  "status": "ok"
}
```

### Create TTS Job

```http
POST /v1/tts/jobs
Content-Type: application/json
```

Request:

```json
{
  "provider": "piper",
  "language": "pt-BR",
  "text": "Hello, this is a voice generation test."
}
```

Response:

```http
202 Accepted
```

```json
{
  "jobId": "uuid",
  "status": "queued"
}
```

Processing happens asynchronously.

## Callback

When synthesis finishes, the service sends a `POST` request to `TTS_CALLBACK_URL`.

Successful synthesis:

```json
{
  "jobId": "uuid",
  "status": "completed",
  "provider": "piper",
  "language": "pt-BR",
  "audioBase64": "...",
  "mimeType": "audio/wav"
}
```

Failed synthesis:

```json
{
  "jobId": "uuid",
  "status": "failed",
  "provider": "piper",
  "language": "pt-BR",
  "error": "..."
}
```

For the current implementation, generated audio is returned as Base64 in the callback payload. This keeps the initial architecture simple and avoids introducing an object-storage dependency.

## Provider Architecture

TTS engines are isolated behind a common provider interface:

```text
TtsProvider
    |
    +-- PiperTtsProvider
    +-- KokoroTtsProvider   (future)
    +-- Other providers     (future)
```

The `TtsProviderRegistry` resolves the requested provider at runtime.

Adding another engine should only require implementing the provider contract and registering the implementation; the HTTP API does not need to change.

## Docker Services

The default Compose stack contains two services:

```text
voice-service
    |
    +-- Node.js / TypeScript / Express
    |
    +-- HTTP API
    |
    +-- Job orchestration
    |
    +-- Provider selection

piper
    |
    +-- Piper TTS engine
    +-- Voice model
```

The Piper container is not exposed directly to the host. It is accessible only through the internal Docker network.

Downloaded voice models are stored in a named Docker volume so they survive container recreation.

## Current Scope

The project intentionally keeps the first version small. It currently does not include:

- Persistent job storage
- Message brokers
- Distributed workers
- External object storage
- Job retry policies
- Authentication or authorization
- Rate limiting

These can be introduced independently as the project evolves.

## Development

Install dependencies:

```bash
npm install
```

Run the service in development mode:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run type checking:

```bash
npm run typecheck
```

## License

License information will be added as the project matures.
