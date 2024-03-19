import "./styles/style.css";

import React, { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { TextView } from "./components/text_view";
import { isJapaneseCharacter } from "./utils/utils";
import { LocalStorage, Message } from "./config/config";
import { Kanji, MessagePayload } from "./models/interface";

const Popup = () => {
  const inputRef = useRef<any>(null);

  const [text, setText] = useState("");
  const [kajis, setKajis] = useState<Kanji[]>([]);

  const [isDataImported, setIsDataImported] = useState(
    localStorage.getItem(LocalStorage.isDataImported)
  );

  const setDataImportedStatus = () => {
    if (!isDataImported) {
      setIsDataImported("1");
      localStorage.setItem(LocalStorage.isDataImported, "1");
    }
  };

  const importDataToLocalDB = (data: string) => {
    chrome.runtime.sendMessage(
      {
        payload: JSON.parse(data),
        message: Message.Insert,
      } as MessagePayload,
      (request) => {
        setDataImportedStatus();
        alert(request.payload);
      }
    );
  };

  const seachDataFromLocalDB = (data: string[]) => {
    chrome.runtime.sendMessage(
      {
        payload: data,
        message: Message.Get,
      } as MessagePayload,
      (request) => {
        setDataImportedStatus();
        setKajis(request.payload ?? []);
      }
    );
  };

  const onSearchKanji = () => {
    if (!text) {
      return;
    }
    const kanjiSearch = text.trim().split("");
    seachDataFromLocalDB(kanjiSearch);
  };

  return (
    <div className="form">
      {!isDataImported ? (
        <input
          type="file"
          accept=".json"
          onChange={(event) => {
            const reader = new FileReader();
            reader.readAsText(event.target.files![0]);
            reader.onload = (e) => {
              const text = e.target?.result;
              if (text && typeof text === "string") {
                importDataToLocalDB(text);
              }
            };
          }}
        />
      ) : null}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
          flexDirection: "row",
        }}
      >
        <input
          autoFocus
          id="kanji"
          type="text"
          value={text}
          ref={inputRef}
          name="kanjiCharacter"
          placeholder="Your Kanji character..."
          onChange={(event) => {
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearchKanji();
            }
          }}
          onFocus={() => {
            navigator.clipboard.readText().then((text) => {
              if (isJapaneseCharacter(text)) {
                setText(text);
                onSearchKanji();
              }
            });
          }}
        />
        <img
          width={40}
          height={40}
          src="button.jpeg"
          style={{ marginLeft: 10 }}
          onClick={() => {
            setText("");
            inputRef.current?.focus();
          }}
        />
      </div>

      <input type="submit" value="Submit" onClick={onSearchKanji} />
      {kajis.length ? <div className="space" /> : null}
      {kajis.map((kanji) => (kanji ? <TextView kanji={kanji} /> : null))}

      <div style={{ marginTop: 10 }}>
        <img src="background.png" width={300} />
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
