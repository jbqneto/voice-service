import express from "express";
import { TtsJobService } from "./application/tts/TtsJobService.js";
import { createTtsRouter } from "./api/routes/tts.routes.js";
import { TtsProviderRegistry } from "./domain/tts/TtsProviderRegistry.js";
import { PiperTtsProvider } from "./infrastructure/tts/piper/PiperTtsProvider.js";
import { config } from "./config/config.js";

const providerRegistry = new TtsProviderRegistry([new PiperTtsProvider()]);
const ttsJobService = new TtsJobService(providerRegistry, config.callbackUrl);

export const app = express();
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_req, res) => { res.json({ status: "ok" }); });
app.use("/v1/tts", createTtsRouter(ttsJobService));
