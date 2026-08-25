import type { TtsProvider } from "./TtsProvider.js";

export class UnsupportedTtsProviderError extends Error {
  constructor(providerName: string) {
    super(`Unsupported TTS provider: ${providerName}`);
    this.name = "UnsupportedTtsProviderError";
  }
}

export class TtsProviderRegistry {
  private readonly providers = new Map<string, TtsProvider>();

  constructor(providers: TtsProvider[]) {
    for (const provider of providers) this.providers.set(provider.name, provider);
  }

  get(providerName: string): TtsProvider {
    const provider = this.providers.get(providerName);
    if (!provider) throw new UnsupportedTtsProviderError(providerName);
    return provider;
  }
}
