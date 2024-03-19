import { KanjiApiTable, KanjiTable, Message } from "../config/config";
import { KanjiResponse, MessagePayload } from "../models/interface";
import { getKanjiCharacter } from "./external_api";

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
