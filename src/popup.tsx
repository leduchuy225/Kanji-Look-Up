import React, { useEffect, useRef, useState } from "react";
import "./styles/style.css";
import { createRoot } from "react-dom/client";
import { MessagePayload } from "./models/interface";
import { LocalStorage, Message } from "./config/config";

const Popup = () => {
  const inputRef = useRef(null);
  const [isDataImported, setIsDataImported] = useState(
    localStorage.getItem(LocalStorage.isDataImported)
  );

  const setDataImportedStatus = () => {
    if (!isDataImported) {
      setIsDataImported("1");
      localStorage.setItem(LocalStorage.isDataImported, "1");
    }
  };

  const importDataToLocalDB = async (data: string) => {
    const json = JSON.parse(data);
    chrome.runtime.sendMessage({
      payload: json,
      message: Message.Insert,
    } as MessagePayload);
  };

  const getKanjiData = async (data: string) => {};

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (request: MessagePayload, sender, sendResponse) => {
        switch (request.message) {
          case Message.InsertSuccessful:
            alert(request.payload);
            setDataImportedStatus();
            break;
          default:
            break;
        }
      }
    );
  }, []);

  return (
    <div className="form">
      {!isDataImported ? (
        <input
          type="file"
          accept=".json"
          onChange={(event) => {
            const reader = new FileReader();
            reader.readAsText(event.target.files![0]);
            reader.onload = async (e) => {
              const text = e.target?.result;
              if (text && typeof text === "string") {
                await importDataToLocalDB(text);
              }
            };
          }}
        />
      ) : null}
      <input
        type="file"
        accept=".json"
        onChange={(event) => {
          const reader = new FileReader();
          reader.readAsText(event.target.files![0]);
          reader.onload = async (e) => {
            const text = e.target?.result;
            if (text && typeof text === "string") {
              await importDataToLocalDB(text);
            }
          };
        }}
      />
      <input
        id="kanji"
        type="text"
        ref={inputRef}
        name="kanjiCharacter"
        placeholder="Your Kanji character..."
      />
      <input
        type="submit"
        value="Submit"
        onClick={(event) => {
          const input = inputRef.current!["value"];
          if (!input) {
            return;
          }
        }}
      />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
