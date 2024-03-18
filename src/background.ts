import "./components/context_menu";
import { KanjiTable, Message } from "./config/config";
import { clearTable, insertRecords } from "./data/local_database";
import { MessagePayload } from "./models/interface";

chrome.runtime.onMessage.addListener(
  (request: MessagePayload, sender, sendResponse) => {
    console.log("Receive message", request.message);

    switch (request.message) {
      case Message.Get:
        break;
      case Message.Insert:
        console.log("Insert to local db");
        clearTable({ tableName: KanjiTable.name })?.then(() => {
          insertRecords(request.payload, { tableName: KanjiTable.name })?.then(
            () => {
              chrome.runtime.sendMessage({
                message: Message.InsertSuccessful,
                payload: "Insert database successfully",
              } as MessagePayload);
            }
          );
        });
        break;
      default:
        break;
    }
  }
);
