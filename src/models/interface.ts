export interface Kanji {
  kanji: string;
  meaning: string;
  radicals: string;
  components: {
    radical: string;
    radical_name: string;
  }[];
}

export interface TransactionOptions {
  name?: string;
  tableName: string;
}

export interface KanjiResponse {
  jlpt: number;
  grade: number;
  kanji: string;
  notes: string[];
  unicode: string;
  heisig_en: string;
  meanings: string[];
  stroke_count: number;
  on_readings: string[];
  kun_readings: string[];
  name_readings: string[];
}

export interface MessagePayload {
  payload: any;
  message: string;
}
