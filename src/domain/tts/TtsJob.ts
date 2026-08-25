export type TtsJobStatus = "queued" | "processing" | "completed" | "failed";

export interface TtsJob {
  id: string;
  provider: string;
  language: string;
  text: string;
  status: TtsJobStatus;
}
