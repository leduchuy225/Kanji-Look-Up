import "./styles/style.css";
import "./styles/text_view.css";

import { Kanji, MessagePayload } from "./models/interface";
import { createRoot } from "react-dom/client";
import React, { useEffect, useRef, useState } from "react";
import { TextView } from "./components/text_view";
import { handleJsonFile, isJapaneseCharacter } from "./utils/utils";
import {
  Message,
  KanjiTable,
  LocalStorage,
  StatusTimeOut,
} from "./config/config";
import {
  getIsDataImported,
  getLastWord,
  importDataToLocalDB,
  saveLastWord,
  seachManyFromKanji,
  searchWordMeaning,
} from "./data/data_service";
import { JotobaRoot } from "./models/jotoba_dictionary";
import { WordMeaning } from "./components/word_meaning";

const Popup = () => {
  const inputRef = useRef<any>(null);

  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [kajis, setKajis] = useState<Kanji[]>([]);
  const [imageSrcs, setImageSrcs] = useState(["background.png"]);
  const [lastWord, setLastWord] = useState<string | null>(getLastWord());
  const [meaning, setMeaning] = useState<JotobaRoot | undefined>(undefined);
  const [isDataImported, setIsDataImported] = useState(getIsDataImported());

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        message: Message.CheckDbReady,
      } as MessagePayload,
      (request: MessagePayload) => {
        request.message == Message.DbReady && setIsReady(true);
      }
    );
  }, []);

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
      localStorage.setItem(LocalStorage.IsDataImported, "1");
    }
  };

  const onSearchKanji = (textSearch?: string) => {
    if (textSearch) {
      setText(textSearch);
    }
    const textTrim = (textSearch ?? text).trim();
    if (!textTrim) {
      showStatus("Please enter your Kanji");
      return;
    }
    updateLastWord(textTrim);
    const kanjiSearch = textTrim.split("");
    if (kanjiSearch.length > 1) {
      searchWordMeaning(textTrim, (response) => {
        response && setMeaning(response);
      });
    }
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

  const updateLastWord = (lastWord: string) => {
    saveLastWord(lastWord);
    setLastWord(lastWord);
  };

  if (!isReady) {
    return <></>;
  }

  return (
    <div className="form">
      {!isDataImported ? (
        <input
          type="file"
          accept=".json"
          title="Import local database"
          onChange={(event) => {
            event.preventDefault();

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
        className="row"
        style={{ alignItems: "center", whiteSpace: "nowrap" }}
      >
        <input
          autoFocus
          type="text"
          value={text}
          ref={inputRef}
          placeholder="Your Kanji character..."
          onChange={(event) => {
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            event.key === "Enter" && onSearchKanji();
          }}
          onFocus={async () => {
            await navigator.clipboard.readText().then((clipboardText) => {
              if (isJapaneseCharacter(clipboardText)) {
                onSearchKanji(clipboardText);
              }
            });
          }}
        />
        <img
          width={40}
          height={40}
          src="button.jpeg"
          title="Clear input"
          className="pointer"
          style={{ marginLeft: 10 }}
          onClick={() => {
            setText("");
            inputRef.current?.focus();
          }}
        />
      </div>

      {lastWord && lastWord != text ? (
        <p
          className="pointer no-padding"
          onClick={() => {
            onSearchKanji(lastWord);
            inputRef.current?.focus();
          }}
        >
          Last word: <span className="highlight text">{lastWord}</span>
        </p>
      ) : null}

      <input type="submit" value="Submit" onClick={() => onSearchKanji()} />

      {status ? <p className="status">{status}</p> : null}

      {meaning?.words.length ? <div className="space" /> : null}
      {meaning?.words.map((word) =>
        word ? <WordMeaning word={word} /> : null
      )}

      {kajis.length ? <div className="space" /> : null}
      {kajis.map((kanji) => (kanji ? <TextView kanji={kanji} /> : null))}

      {imageSrcs.map((src) => {
        const sharedProps = { src: src, width: 300, style: { marginTop: 8 } };
        if (src == "background.png") {
          return (
            <img
              {...sharedProps}
              className="pointer"
              title="Click to show alphabet"
              onClick={() => {
                setImageSrcs(["hiragana.png", "katakana.png"]);
              }}
            />
          );
        }
        return <img {...sharedProps} />;
      })}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
