import { Message } from "./config/config";
import { MessagePayload } from "./models/interface";
import {
  clearTable,
  getRecord,
  getManyRecord,
  insertRecords,
  createDatabase,
} from "./data/local_database";
import { isAllElementNull } from "./utils/utils";

export const sendMessageToDB = async (
  request: MessagePayload,
  sendResponse?: (data: MessagePayload) => void
) => {
  switch (request.message) {
    case Message.CheckDbReady:
      createDatabase(() => {
        sendResponse && sendResponse({ message: Message.DbReady });
      });
      break;
    case Message.GetMany:
      if (!request.payload?.table) {
        return;
      }
      await getManyRecord(request.payload.data, {
        tableName: request.payload.table,
      })?.then((data) => {
        if (isAllElementNull(data)) {
          sendResponse && sendResponse({ message: Message.GetEmpty });
          return;
        }
        sendResponse &&
          sendResponse({
            payload: { data: data },
            message: Message.GetSuccessful,
          });
      });
      break;
    case Message.GetOne:
      if (!request.payload?.table) {
        return;
      }
      await getRecord(request.payload.data, {
        tableName: request.payload.table,
      })?.then((data) => {
        if (!data) {
          sendResponse && sendResponse({ message: Message.GetEmpty });
          return;
        }
        sendResponse &&
          sendResponse({
            payload: { data: data },
            message: Message.GetSuccessful,
          });
      });
      break;
    case Message.Insert:
      if (!request.payload?.table) {
        return;
      }
      await insertRecords(request.payload.data, {
        tableName: request.payload.table,
      })?.then(() => {
        sendResponse &&
          sendResponse({
            message: Message.InsertSuccessful,
            payload: { data: "Insert database successfully" },
          });
      });
      break;
    case Message.ClearAndInsert:
      if (!request.payload?.table || !request.payload.data) {
        return;
      }
      await clearTable({ tableName: request.payload.table })
        ?.then(() => {
          return insertRecords(request.payload!.data, {
            tableName: request.payload!.table!,
          });
        })
        .then(() => {
          sendResponse &&
            sendResponse({
              message: Message.InsertSuccessful,
              payload: { data: "Clear and insert database successfully" },
            });
        });
      break;
    default:
      break;
  }
};
