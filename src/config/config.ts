const port = Number(process.env.PORT ?? 3000);

export const config = {
  port,
  piperUrl: process.env.PIPER_URL ?? "http://piper:5000",
  piperVoice: process.env.PIPER_VOICE ?? "pt_BR-cadu-medium",
  callbackUrl: process.env.TTS_CALLBACK_URL ?? "",
};
