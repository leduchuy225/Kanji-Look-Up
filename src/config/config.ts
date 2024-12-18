import { Table } from "../models/interface";

export const DB_VERSION = 2;
export const DB_NAME = "NiHongoDB";

export const HistoryWordLengthDefault = 20;

export const SearchWordLength = 8;

export const StatusTimeOut = 2000; // ms

export const LocalStorage = {
  LastWord: "LastWord",
  IsDataImported: "IsDataImported",
  HistoryWordLength: "HistoryWordLength",
};

export const KanjiTable: Table = {
  key: "kanji",
  name: "kanjis",
};

export const KanjiApiTable: Table = {
  key: "kanji",
  name: "kanjiapi",
};

export const Message = {
  GetOne: "GetOne",
  Insert: "Insert",
  GetMany: "GetMany",
  DbReady: "DbReady",
  GetEmpty: "GetEmpty",
  CheckDbReady: "CheckDbReady",
  GetSuccessful: "GetSuccessful",
  ClearAndInsert: "ClearAndInsert",
  InsertSuccessful: "InsertSuccessful",
  ClearAndInsertSucessful: "ClearAndInsertSuccessful",
};

export const CanvasWidth = 350;
export const CanvasHeight = 400;

export const SeparatorElement = " - ";
