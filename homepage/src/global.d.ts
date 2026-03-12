// Type shim for window.gameSDK used in useDeckAudio.ts
interface Window {
  gameSDK?: {
    audio?: {
      tts?: (text: string, options?: Record<string, unknown>) => Promise<void>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}
