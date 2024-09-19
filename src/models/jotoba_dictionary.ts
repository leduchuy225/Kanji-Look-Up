export interface JotobaRoot {
  kanji: JotobaKanji[];
  words: JotobaWord[];
}

export interface JotobaKanji {
  literal: string;
  meanings: string[];
  grade: number;
  stroke_count: number;
  frequency: number;
  jlpt: number;
  onyomi: string[];
  kunyomi: string[];
  chinese: string[];
  korean_r: string[];
  korean_h: string[];
  parts: string[];
  radical: string;
  variant?: string[];
}

export interface JotobaWord {
  reading: JotobaReading;
  common: boolean;
  senses: JotobaSense[];
  audio: string;
  pitch?: JotobaPitch[];
}

export interface JotobaReading {
  kana: string;
  kanji: string;
  furigana: string;
}

export interface JotobaSense {
  glosses: string[];
  pos: JotobaPo[];
  language: string;
}

export interface JotobaPo {
  Noun?: string;
  Verb?: string;
}

export interface JotobaPitch {
  part: string;
  high: boolean;
}

// My interface
export interface LocalJotobaWord {
  word: string;
  meaning?: JotobaRoot | null;
}
