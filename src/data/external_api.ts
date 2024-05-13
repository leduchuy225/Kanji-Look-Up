import { CanvasHeight, CanvasWidth } from "../config/config";
import { CanvasDrawLine, KanjiResponse } from "../models/interface";
import { JotobaRoot } from "../models/jotoba_dictionary";
import { getInkPositionFromCanvasLines } from "../utils/utils";

export const JotobaBaseURL = "https://jotoba.de";
export const KanjiapiBaseURL = "https://kanjiapi.dev/v1";
export const InputToolURL =
  "https://inputtools.google.com/request?itc=ja-t-i0-handwrit&app=translate";

export const getKanjiCharacter = async (kanji: string) => {
  return fetch(`${KanjiapiBaseURL}/kanji/${kanji}`, {
    method: "GET",
    headers: { "content-type": "application/json;charset=UTF-8" },
  })
    .then((data) => {
      if (data.ok) {
        return data.json() as Promise<KanjiResponse>;
      }
      throw new Error(data.statusText);
    })
    .catch(() => undefined);
};

export const lookUpByDrawInput = async (lines: CanvasDrawLine[]) => {
  if (lines.length < 1) {
    return [];
  }
  return fetch(InputToolURL, {
    method: "POST",
    headers: { "content-type": "application/json;charset=UTF-8" },
    body: JSON.stringify({
      app_version: 0.4,
      api_level: "537.36",
      itc: "ja-t-i0-handwrit",
      device:
        "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      input_type: "0",
      options: "enable_pre_space",
      requests: [
        {
          language: "ja",
          pre_context: "",
          max_completions: 0,
          max_num_results: 10,
          ink: getInkPositionFromCanvasLines(lines),
          writing_guide: {
            writing_area_width: CanvasWidth,
            writing_area_height: CanvasHeight,
          },
        },
      ],
    }),
  })
    .then((data) => {
      if (data.ok) {
        return data.json();
      }
      throw new Error(data.statusText);
    })
    .then((data) => {
      return data[1][0][1];
    })
    .catch(() => undefined);
};

export const lookUpDictionary = async (word: string) => {
  return fetch(`${JotobaBaseURL}/api/search/words`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query: word,
      no_english: false,
      language: "English",
    }),
  })
    .then((data) => {
      if (data.ok) {
        return data.json() as Promise<JotobaRoot>;
      }
      throw new Error(data.statusText);
    })
    .catch(() => undefined);
};
