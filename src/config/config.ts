import { Table } from "../models/interface";

export const DB_VERSION = 2;
export const DB_NAME = "NiHongoDB";

export const StatusTimeOut = 2000; // ms

export const LocalStorage = {
  isDataImported: "isDataImported",
};

export const KanjiTable: Table = {
  key: "kanji",
  name: "kanjis",
};

export const KanjiApiTable: Table = {
  key: "kanji",
  name: "kanjiapi",
};

// export const ContextMenu = [
//   {
//     id: "kanki-look-up",
//     title: "Look up Kanji",
//   },
// ];

export const Message = {
  GetOne: "GetOne",
  Insert: "Insert",
  GetMany: "GetMany",
  DbReady: "DbReady",
  GetEmpty: "GetEmpty",
  GetSuccessful: "GetSuccessful",
  ClearAndInsert: "ClearAndInsert",
  InsertSuccessful: "InsertSuccessful",
  ClearAndInsertSucessful: "ClearAndInsertSuccessful",
};