export interface Kanji {
  kanji: string;
  meaning: string;
  radicals: string;
  components: KanjiComponent[];
}

export interface KanjiComponent {
  radical: string;
  radical_name: string;
  kanji_words: string[];
}

export interface TransactionOptions {
  name?: string;
  tableName: string;
}

export interface KanjiResponse {
  jlpt?: number | null;
  grade?: number | null;
  kanji?: string | null;
  notes?: string[] | null;
  unicode?: string | null;
  heisig_en?: string | null;
  meanings?: string[] | null;
  stroke_count?: number | null;
  on_readings?: string[] | null;
  kun_readings?: string[] | null;
  name_readings?: string[] | null;
}

export interface MessagePayload {
  message: string;
  payload?: Payload;
}

export interface Payload {
  data: any;
  table?: string;
}

export interface Table {
  key: string;
  name: string;
}

export interface CanvasDrawLine {
  brushColor: string;
  brushRadius: number;
  points: { x: number; y: number }[];
}
