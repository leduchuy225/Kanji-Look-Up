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

chrome.runtime.onMessage.addListener(
  (request: MessagePayload, _, sendResponse) => {
    console.log("Receive message", request.message);
    (async () => {
      switch (request.message) {
        case Message.CheckDbReady:
          createDatabase(() => {
            sendResponse({
              message: Message.DbReady,
            } as MessagePayload);
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
              sendResponse({
                message: Message.GetEmpty,
              } as MessagePayload);
              return;
            }
            sendResponse({
              payload: { data: data },
              message: Message.GetSuccessful,
            } as MessagePayload);
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
              sendResponse({
                message: Message.GetEmpty,
              } as MessagePayload);
              return;
            }
            sendResponse({
              payload: { data: data },
              message: Message.GetSuccessful,
            } as MessagePayload);
          });
          break;
        case Message.Insert:
          if (!request.payload?.table) {
            return;
          }
          await insertRecords(request.payload.data, {
            tableName: request.payload.table,
          })?.then(() => {
            sendResponse({
              message: Message.InsertSuccessful,
              payload: { data: "Insert database successfully" },
            } as MessagePayload);
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
              sendResponse({
                message: Message.InsertSuccessful,
                payload: { data: "Clear and insert database successfully" },
              } as MessagePayload);
            });
          break;
        default:
          break;
      }
    })();
    return true;
  }
);
