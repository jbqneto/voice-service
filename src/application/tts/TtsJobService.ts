import { randomUUID } from "node:crypto";
import type { TtsJob } from "../../domain/tts/TtsJob.js";
import { TtsProviderRegistry } from "../../domain/tts/TtsProviderRegistry.js";

export interface TtsCallbackPayload {
  jobId: string;
  status: "completed" | "failed";
  provider: string;
  language: string;
  audioBase64?: string;
  mimeType?: string;
  error?: string;
}

export class TtsJobService {
  constructor(private readonly providerRegistry: TtsProviderRegistry, private readonly callbackUrl: string) {}

  createJob(provider: string, language: string, text: string): TtsJob {
    const job: TtsJob = { id: randomUUID(), provider, language, text, status: "queued" };
    void this.processJob(job);
    return job;
  }

  private async processJob(job: TtsJob): Promise<void> {
    job.status = "processing";
    try {
      const provider = this.providerRegistry.get(job.provider);
      const result = await provider.synthesize({ text: job.text, language: job.language });
      job.status = "completed";
      await this.sendCallback({ jobId: job.id, status: "completed", provider: job.provider, language: job.language, audioBase64: result.audio.toString("base64"), mimeType: result.mimeType });
    } catch (error) {
      job.status = "failed";
      await this.sendCallback({ jobId: job.id, status: "failed", provider: job.provider, language: job.language, error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  private async sendCallback(payload: TtsCallbackPayload): Promise<void> {
    if (!this.callbackUrl) {
      console.warn("TTS_CALLBACK_URL is not configured");
      return;
    }
    const response = await fetch(this.callbackUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    if (!response.ok) throw new Error(`TTS callback failed with HTTP ${response.status}`);
  }
}
