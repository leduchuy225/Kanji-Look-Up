import { JotobaRoot } from "../models/jotoba_dictionary";
import { KanjiResponse, MessagePayload } from "../models/interface";
import {
  KanjiApiTable,
  KanjiTable,
  LocalStorage,
  Message,
} from "../config/config";
import { getKanjiCharacter, lookUpDictionary } from "./external_api";

export const importDataToLocalDB = (option: {
  data: any[];
  table: string;
  message: "Insert" | "ClearAndInsert";
  callback?: (request: MessagePayload) => void;
}) => {
  chrome.runtime.sendMessage(
    {
      message: option.message,
      payload: {
        table: option.table,
        data:
          typeof option.data == "string"
            ? JSON.parse(option.data)
            : option.data,
      },
    } as MessagePayload,
    option.callback
  );
};

export const seachManyFromKanji = (options: {
  data: string[];

  callback: (request: MessagePayload) => void;
}) => {
  chrome.runtime.sendMessage(
    {
      message: Message.GetMany,
      payload: {
        data: options.data,
        table: KanjiTable.name,
      },
    } as MessagePayload,
    options.callback
  );
};

export const seachOneFromKanjiApi = (data: string) => {
  return new Promise<KanjiResponse | undefined>((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        message: Message.GetOne,
        payload: {
          data: data,
          table: KanjiApiTable.name,
        },
      } as MessagePayload,
      async (request: MessagePayload) => {
        if (request.message == Message.GetEmpty) {
          const apiData = await getKanjiCharacter(data);
          if (apiData) {
            importDataToLocalDB({
              data: [apiData],
              message: "Insert",
              table: KanjiApiTable.name,
            });
          }
          resolve(apiData);
          return;
        }
        resolve(request.payload?.data);
      }
    );
  });
};

export const searchWordMeaning = (
  data: string,
  callback: (response?: JotobaRoot) => void
) => {
  return lookUpDictionary(data).then(callback);
};

export const getLastWord = () => {
  return localStorage.getItem(LocalStorage.LastWord);
};

export const getIsDataImported = () => {
  return localStorage.getItem(LocalStorage.IsDataImported) ?? false;
};

export const saveLastWord = (data: string) => {
  localStorage.setItem(LocalStorage.LastWord, data);
};
