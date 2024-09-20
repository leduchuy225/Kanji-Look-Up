import "./styles/style.css";
import "./styles/text_view.css";

import { Kanji, MessagePayload } from "./models/interface";
import { createRoot } from "react-dom/client";
import React, { createContext, useEffect, useRef, useState } from "react";
import { TextView } from "./components/text_view";
import { isJapaneseCharacter } from "./utils/utils";
import { Message, LocalStorage } from "./config/config";
import {
  addLastWordToStorage,
  getIsDataImported,
  getLastWordsFromStorage,
  seachManyFromKanji,
  searchWordMeaning,
} from "./data/data_service";
import { JotobaRoot, LocalJotobaWord } from "./models/jotoba_dictionary";
import { WordMeaning } from "./components/word_meaning";
import { sendMessageToDB } from "./popup_fn";
import { CanvasInput } from "./components/canvas_input";
import { BackgroundImage } from "./components/background_image";
import { ImportDataBox } from "./components/import_data_box";

export const AppContext = createContext({
  setDataImportedStatus: () => {},
  onSearchKanji: async (textSearch?: string) => {},
});

const Popup = () => {
  const inputRef = useRef<any>(null);

  const [text, setText] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [kajis, setKajis] = useState<Kanji[]>([]);
  const [lastWords, setLastWords] = useState<LocalJotobaWord[]>(
    getLastWordsFromStorage()
  );
  const [meaning, setMeaning] = useState<JotobaRoot | undefined>(undefined);
  const [isDataImported, setIsDataImported] = useState(getIsDataImported());

  const [isShowCanvas, setIsShowCanvas] = useState(false);

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
      return;
    }

    const wordSaved: LocalJotobaWord = { word: textTrim, meaning: undefined };

    setKajis([]);
    setMeaning(undefined);

    const kanjiSearch = textTrim.split("");

    await seachManyFromKanji({
      data: kanjiSearch,
      callback: (request) => {
        if (request.payload) {
          setDataImportedStatus();
          setKajis([...request.payload.data]);
          return;
        }
      },
    });

    if (kanjiSearch.length > 1) {
      const wordInHistory = lastWords.find((word) => word.word == textTrim);
      if (wordInHistory != null && wordInHistory.meaning != null) {
        wordSaved.meaning = wordInHistory.meaning;
        setMeaning(wordInHistory.meaning);
      } else {
        await searchWordMeaning(textTrim, (response) => {
          if (response) {
            wordSaved.meaning = response;
            setMeaning(response);
          }
        });
      }
    }

    updateLastWord(wordSaved);
  };

  const updateLastWord = (lastWord: LocalJotobaWord) => {
    addLastWordToStorage(lastWord);
    setLastWords(getLastWordsFromStorage());
  };

  if (!isReady) {
    return <></>;
  }

  return (
    <AppContext.Provider
      value={{
        onSearchKanji: onSearchKanji,
        setDataImportedStatus: setDataImportedStatus,
      }}
    >
      <div className="form">
        {!isDataImported ? <ImportDataBox /> : null}
        <div
          className="row"
          style={{ alignItems: "center", whiteSpace: "nowrap" }}
        >
          <input
            autoFocus
            type="text"
            value={text}
            ref={inputRef}
            placeholder="Your Kanji characters..."
            onChange={(event) => {
              setText(event.target.value);
            }}
            onKeyDown={async (event) => {
              event.key === "Enter" && (await onSearchKanji());
            }}
            onFocus={async () => {
              await navigator.clipboard
                .readText()
                .then(async (clipboardText) => {
                  if (!clipboardText) {
                    return;
                  }
                  if (clipboardText == lastWords[0]?.word) {
                    await navigator.clipboard.writeText("");
                    return;
                  }
                  if (
                    isJapaneseCharacter(clipboardText) &&
                    !clipboardText.includes(" ")
                  ) {
                    await navigator.clipboard.writeText("");
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

        {lastWords.length ? (
          <div>
            Last words{" "}
            {lastWords.map((word) => (
              <span
                className="pointer highlight text"
                onClick={async () => {
                  await onSearchKanji(word.word);
                  inputRef.current?.focus();
                }}
              >
                {word.word}
                {"  |  "}
              </span>
            ))}
          </div>
        ) : null}

        {meaning?.words.length ? <div className="space" /> : null}
        {meaning?.words.map((word) =>
          word ? <WordMeaning word={word} /> : null
        )}

        {kajis.length ? <div className="space" /> : null}
        {kajis.map((kanji) => (kanji ? <TextView kanji={kanji} /> : null))}

        {isShowCanvas ? (
          <div style={{ marginTop: 10 }}>
            <CanvasInput />
          </div>
        ) : null}

        <BackgroundImage />
      </div>
    </AppContext.Provider>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
