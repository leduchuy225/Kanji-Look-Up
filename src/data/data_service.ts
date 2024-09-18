import { JotobaRoot } from "../models/jotoba_dictionary";
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

export const seachManyFromKanji = async (options: {
  data: string[];
  callback: (request: MessagePayload) => void;
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

export const searchWordMeaning = (
  data: string,
  callback: (response?: JotobaRoot) => void
) => {
  return lookUpDictionary(data).then(callback);
};

export const getLastWord = () => {
  const wordString = localStorage.getItem(LocalStorage.LastWord);
  return wordString?.split(" ") ?? [];
};

export const getIsDataImported = () => {
  return localStorage.getItem(LocalStorage.IsDataImported) ?? false;
};

export const saveLastWord = (data: string) => {
  const newWord = data.trim();

  const wordString = localStorage.getItem(LocalStorage.LastWord);
  var wordArray = wordString?.split(" ") ?? [];

  wordArray = wordArray.filter((word) => word != newWord);

  const newWordArray = [newWord].concat(wordArray);

  const slicedArray = newWordArray.slice(0, HistoryWordLength);

  localStorage.setItem(LocalStorage.LastWord, slicedArray.join(" "));
};
