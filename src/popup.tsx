import "./styles/style.css";

import { Kanji } from "./models/interface";
import { createRoot } from "react-dom/client";
import React, { useRef, useState } from "react";
import { TextView } from "./components/text_view";
import { handleJsonFile, isJapaneseCharacter } from "./utils/utils";
import {
  Message,
  KanjiTable,
  LocalStorage,
  StatusTimeOut,
} from "./config/config";
import { importDataToLocalDB, seachManyFromKanji } from "./data/data_service";

const Popup = () => {
  const inputRef = useRef<any>(null);

  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [kajis, setKajis] = useState<Kanji[]>([]);

  const [isDataImported, setIsDataImported] = useState(
    localStorage.getItem(LocalStorage.isDataImported)
  );

  const showStatus = (data: string) => {
    setStatus(data);
    const timer = setTimeout(() => {
      setStatus("");
      clearTimeout(timer);
    }, StatusTimeOut);
  };

  const setDataImportedStatus = () => {
    if (!isDataImported) {
      setIsDataImported("1");
      localStorage.setItem(LocalStorage.isDataImported, "1");
    }
  };

  const onSearchKanji = () => {
    if (!text) {
      return;
    }
    const kanjiSearch = text.trim().split("");
    seachManyFromKanji({
      data: kanjiSearch,
      callback: (request) => {
        if (request.payload) {
          setDataImportedStatus();
          setKajis(request.payload.data);
          return;
        }
        setKajis([]);
        showStatus("Not found Kanji");
      },
    });
  };

  return (
    <div className="form">
      {!isDataImported ? (
        <input
          type="file"
          accept=".json"
          title="Import local database"
          onChange={(event) => {
            const reader = new FileReader();
            reader.readAsText(event.target.files![0]);
            reader.onload = (e) => {
              const text = e.target?.result;
              if (text && typeof text === "string") {
                try {
                  const jsonData = handleJsonFile(text);
                  importDataToLocalDB({
                    data: jsonData,
                    table: KanjiTable.name,
                    message: "ClearAndInsert",
                    callback: (request) => {
                      if (request.message == Message.InsertSuccessful) {
                        setDataImportedStatus();
                        alert(request.payload?.data);
                        return;
                      }
                      alert("Insert fail");
                    },
                  });
                } catch (error) {
                  alert(error);
                }
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

      {status ? <p className="status">{status}</p> : null}

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
