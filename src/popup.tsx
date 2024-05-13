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
  CanvasWidth,
  CanvasHeight,
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
import { sendMessageToDB } from "./popup_fn";
import CanvasDraw from "react-canvas-draw";
import { lookUpByDrawInput } from "./data/external_api";

const Popup = () => {
  const inputRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [kajis, setKajis] = useState<Kanji[]>([]);
  const [imageSrcs, setImageSrcs] = useState(["background.png"]);
  const [lastWord, setLastWord] = useState<string | null>(getLastWord());
  const [meaning, setMeaning] = useState<JotobaRoot | undefined>(undefined);
  const [isDataImported, setIsDataImported] = useState(getIsDataImported());

  const [isShowCanvas, setIsShowCanvas] = useState(false);
  const [recommendedWords, setRecommendedWords] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await sendMessageToDB(
        { message: Message.CheckDbReady },
        (request: MessagePayload) => {
          request.message == Message.DbReady && setIsReady(true);
        }
      );
    };

    fetchData();
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

  const onSearchKanji = async (textSearch?: string) => {
    if (textSearch) {
      setText(textSearch);
    }
    const textTrim = (textSearch ?? text).trim();
    if (!textTrim) {
      showStatus("Please enter your Kanji");
      return;
    }

    setKajis([]);
    setMeaning(undefined);
    updateLastWord(textTrim);

    const kanjiSearch = textTrim.split("");

    await seachManyFromKanji({
      data: kanjiSearch,
      callback: (request) => {
        if (request.payload) {
          setDataImportedStatus();
          setKajis([...request.payload.data]);
          return;
        }
        showStatus("Not found Kanji");
      },
    });

    if (kanjiSearch.length > 1) {
      await searchWordMeaning(textTrim, (response) => {
        response && setMeaning(response);
      });
    }
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
            reader.onload = async (e) => {
              const text = e.target?.result;
              if (text && typeof text === "string") {
                try {
                  const jsonData = handleJsonFile(text);
                  await importDataToLocalDB({
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
          onKeyDown={async (event) => {
            event.key === "Enter" && (await onSearchKanji());
          }}
          onFocus={async () => {
            await navigator.clipboard.readText().then(async (clipboardText) => {
              if (!clipboardText) {
                return;
              }
              if (clipboardText == lastWord) {
                await navigator.clipboard.writeText("");
                return;
              }
              if (isJapaneseCharacter(clipboardText)) {
                await onSearchKanji(clipboardText);
              }
            });
          }}
        />
        <img
          width={40}
          height={40}
          src="button.jpeg"
          title="Draw input"
          className="pointer"
          style={{ marginLeft: 10 }}
          onClick={() => {
            setIsShowCanvas(!isShowCanvas);
          }}
        />
      </div>

      {lastWord && lastWord != text ? (
        <p
          className="pointer no-padding"
          onClick={async () => {
            await onSearchKanji(lastWord);
            inputRef.current?.focus();
          }}
        >
          Last word: <span className="highlight text">{lastWord}</span>
        </p>
      ) : null}

      {status ? <p className="status">{status}</p> : null}

      {meaning?.words.length ? <div className="space" /> : null}
      {meaning?.words.map((word) =>
        word ? <WordMeaning word={word} /> : null
      )}

      {kajis.length ? <div className="space" /> : null}
      {kajis.map((kanji) => (kanji ? <TextView kanji={kanji} /> : null))}

      {isShowCanvas ? (
        <div style={{ marginTop: 10 }}>
          <CanvasDraw
            brushRadius={4}
            ref={canvasRef}
            canvasWidth={CanvasWidth}
            canvasHeight={CanvasHeight}
            onChange={async (data: any) => {
              const lines = data?.lines ?? [];
              const response = await lookUpByDrawInput(lines);

              Array.isArray(response) && setRecommendedWords(response);
            }}
          />
          <div
            className="row"
            style={{
              alignItems: "center",
              whiteSpace: "nowrap",
              justifyContent: "space-around",
            }}
          >
            <p
              className="pointer highlight text"
              onClick={() => {
                canvasRef.current?.eraseAll();
              }}
            >
              Erase
            </p>
            <p
              className="pointer highlight text"
              onClick={() => {
                canvasRef.current?.undo();
              }}
            >
              Undo
            </p>
          </div>
          <div
            className="row"
            style={{
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {recommendedWords.map((word) => (
              <div
                className="pointer box"
                onClick={async () => {
                  await onSearchKanji(word);
                  window.scrollTo(0, 0);
                }}
              >
                <span className="no-padding highlight text">{word}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {imageSrcs.map((src) => {
        const sharedProps = { src: src, width: 350, style: { marginTop: 8 } };
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
