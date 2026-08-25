import { config } from "../../../config/config.js";
import type { TtsProvider, TtsSynthesisRequest, TtsSynthesisResult } from "../../../domain/tts/TtsProvider.js";

export class PiperTtsProvider implements TtsProvider {
  readonly name = "piper";

  async synthesize(request: TtsSynthesisRequest): Promise<TtsSynthesisResult> {
    const response = await fetch(`${config.piperUrl}/synthesize`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: request.text, voice: config.piperVoice }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Piper synthesis failed with HTTP ${response.status}: ${details}`);
    }

    const audio = Buffer.from(await response.arrayBuffer());
    return {
      audio,
      mimeType: response.headers.get("content-type")?.split(";")[0] ?? "audio/wav",
      format: "wav",
    };
  }
}
