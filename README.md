# Voice Service

Serviço local assíncrono de TTS. Não possui integração com Telegram ou n8n.

## Arquitetura Docker

```text
n8n (stack existente)
        |
        | HTTP
        v
voice-service:3000
        |
        | HTTP interno
        v
piper:5000
```

O `voice-service` e o `piper` pertencem a este projeto/stack. O n8n existente continua separado.

## Deploy

No Portainer, crie uma nova Stack usando este `docker-compose.yml`. O serviço expõe a porta 3000 para a rede local; o Piper não é exposto ao host.

Configure `.env` a partir de `.env.example`, especialmente `TTS_CALLBACK_URL` e `PIPER_VOICE`.

```bash
docker compose build
docker compose up -d
```

## API

`GET /health`

`POST /v1/tts/jobs`

```json
{
  "provider": "piper",
  "language": "pt-BR",
  "text": "Olá, este é um teste."
}
```

Retorna `202 Accepted` com `jobId`. Quando terminar, o serviço envia o áudio em Base64 ao callback configurado.

## Extensibilidade

Strategy + Registry seleciona o provider. O primeiro é `piper`; futuramente podem entrar `kokoro` e `latin` sem alterar o contrato principal.

Persistência, RabbitMQ, storage e retries ficam para uma evolução posterior.
