import { Router } from "express";
import { TtsJobService } from "../../application/tts/TtsJobService.js";
import { UnsupportedTtsProviderError } from "../../domain/tts/TtsProviderRegistry.js";

export function createTtsRouter(ttsJobService: TtsJobService): Router {
  const router = Router();

  router.post("/jobs", (req, res) => {
    const { provider, language, text } = req.body ?? {};
    if (typeof provider !== "string" || typeof language !== "string" || typeof text !== "string" || !provider.trim() || !language.trim() || !text.trim()) {
      res.status(400).json({ error: "provider, language and text are required." });
      return;
    }

    try {
      const job = ttsJobService.createJob(provider.trim(), language.trim(), text.trim());
      res.status(202).json({ jobId: job.id, status: job.status });
    } catch (error) {
      if (error instanceof UnsupportedTtsProviderError) {
        res.status(400).json({ error: error.message });
        return;
      }
      console.error(error);
      res.status(500).json({ error: "Failed to create TTS job." });
    }
  });

  return router;
}
