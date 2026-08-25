export interface TtsSynthesisRequest {
  text: string;
  language: string;
}

export interface TtsSynthesisResult {
  audio: Buffer;
  mimeType: string;
  format: string;
}

export interface TtsProvider {
  readonly name: string;
  synthesize(request: TtsSynthesisRequest): Promise<TtsSynthesisResult>;
}
