import { JotobaRoot, LocalJotobaWord } from "../models/jotoba_dictionary";
import { KanjiResponse, MessagePayload } from "../models/interface";
import {
  HistoryWordLength,
  KanjiApiTable,
  KanjiTable,
  LocalStorage,
  Message,
} from "../config/config";
import { getKanjiCharacter, lookUpDictionary } from "./external_api";
import { sendMessageToDB } from "../popup_fn";

export const importDataToLocalDB = async (option: {
  data: any[];
  table: string;
  message: "Insert" | "ClearAndInsert";
  callback?: (request: MessagePayload) => void;
}) => {
  await sendMessageToDB(
    {
      message: option.message,
      payload: {
        table: option.table,
        data:
          typeof option.data == "string"
            ? JSON.parse(option.data)
            : option.data,
      },
    },
    option.callback
  );
};

export const seachManyFromKanji = async <T>(options: {
  data: string[];
  callback: (request: MessagePayload<T>) => void;
}) => {
  await sendMessageToDB(
    {
      message: Message.GetMany,
      payload: {
        data: options.data,
        table: KanjiTable.name,
      },
    },
    options.callback
  );
};

export const seachOneFromKanjiApi = async (
  data: string,
  callback: (param?: KanjiResponse) => void
) => {
  await sendMessageToDB(
    {
      message: Message.GetOne,
      payload: {
        data: data,
        table: KanjiApiTable.name,
      },
    },
    async (request: MessagePayload) => {
      if (request.message == Message.GetEmpty) {
        const apiData = await getKanjiCharacter(data);
        if (apiData) {
          await importDataToLocalDB({
            data: [apiData],
            message: "Insert",
            table: KanjiApiTable.name,
          });
        }
        callback(apiData);
        return;
      }
      callback(request.payload?.data);
      return;
    }
  );
};

export const searchWordMeaning = async (
  data: string,
  callback: (response?: JotobaRoot) => void
) => {
  return lookUpDictionary(data).then(callback);
};

export const getLastWordsFromStorage = (): LocalJotobaWord[] => {
  const wordArray = localStorage.getItem(LocalStorage.LastWord) ?? "[]";
  try {
    return JSON.parse(wordArray);
  } catch (error) {
    localStorage.removeItem(LocalStorage.LastWord);
    return [];
  }
};

export const getIsDataImported = () => {
  return localStorage.getItem(LocalStorage.IsDataImported) ?? false;
};

export const addLastWordToStorage = (data: LocalJotobaWord) => {
  const newWord = data.word.trim();

  var wordArray = getLastWordsFromStorage();

  wordArray = wordArray.filter((word) => word.word != newWord);

  const newWordArray = [data].concat(wordArray);

  const slicedArray = newWordArray.slice(0, HistoryWordLength);

  localStorage.setItem(LocalStorage.LastWord, JSON.stringify(slicedArray));
};
