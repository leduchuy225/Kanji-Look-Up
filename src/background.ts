import { MessagePayload } from "./models/interface";
import { KanjiTable, Message } from "./config/config";
import {
  clearTable,
  createDatabase,
  getManyRecord,
  insertRecords,
} from "./data/local_database";
import { isAllElementNull } from "./utils/utils";

createDatabase(() => {
  console.log("DB OPENED.");
});

chrome.runtime.onMessage.addListener(
  (request: MessagePayload, sender, sendResponse) => {
    console.log("Receive message", request.message);
    (async () => {
      switch (request.message) {
        case Message.Get:
          await getManyRecord(request.payload, {
            tableName: KanjiTable.name,
          })?.then((data) => {
            if (isAllElementNull(data)) {
              sendResponse({
                payload: undefined,
                message: Message.GetEmpty,
              } as MessagePayload);
              return;
            }
            sendResponse({
              payload: data,
              message: Message.GetSuccessful,
            } as MessagePayload);
          });
          break;
        case Message.Insert:
          await clearTable({ tableName: KanjiTable.name })
            ?.then(() => {
              return insertRecords(request.payload, {
                tableName: KanjiTable.name,
              });
            })
            .then(() => {
              sendResponse({
                message: Message.InsertSuccessful,
                payload: "Insert database successfully",
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
