declare module 'bidi-js' {
  type EmbeddingLevelsResult = {
    levels: number[];
    paragraphs: { start: number; end: number; level: number }[];
  };

  type BidiInstance = {
    getEmbeddingLevels: (text: string, direction?: 'ltr' | 'rtl' | 'auto') => EmbeddingLevelsResult;
    getReorderedString?: (text: string, embeddingLevelsResult: EmbeddingLevelsResult) => string;
    getReorderSegments?: (
      text: string,
      embeddingLevelsResult: EmbeddingLevelsResult,
      start?: number,
      end?: number
    ) => [number, number][];
    getMirroredCharactersMap?: (
      text: string,
      embeddingLevelsResult: EmbeddingLevelsResult,
      start?: number,
      end?: number
    ) => Map<number, string>;
  };

  export default function bidiFactory(): BidiInstance;
}
