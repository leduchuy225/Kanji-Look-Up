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

createDatabase(() => {
  console.log("DB OPENED.");
});

chrome.runtime.onMessage.addListener(
  (request: MessagePayload, sender, sendResponse) => {
    console.log("Receive message", request.message);
    (async () => {
      if (!request.payload?.table) {
        return;
      }
      const payload = request.payload.data;
      const tableName = request.payload?.table;
      switch (request.message) {
        case Message.GetMany:
          await getManyRecord(payload, { tableName: tableName })?.then(
            (data) => {
              if (isAllElementNull(data)) {
                sendResponse({
                  payload: undefined,
                  message: Message.GetEmpty,
                } as MessagePayload);
                return;
              }
              sendResponse({
                payload: { data: data },
                message: Message.GetSuccessful,
              } as MessagePayload);
            }
          );
          break;
        case Message.GetOne:
          await getRecord(payload, { tableName: tableName })?.then((data) => {
            if (!data) {
              sendResponse({
                payload: undefined,
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
          await insertRecords(payload, { tableName: tableName })?.then(() => {
            sendResponse({
              message: Message.InsertSuccessful,
              payload: { data: "Insert database successfully" },
            } as MessagePayload);
          });
          break;
        case Message.ClearAndInsert:
          await clearTable({ tableName: tableName })
            ?.then(() => {
              return insertRecords(payload, { tableName: tableName });
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
