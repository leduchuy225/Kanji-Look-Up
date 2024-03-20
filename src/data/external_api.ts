import { KanjiResponse } from "../models/interface";
import { JotobaRoot } from "../models/jotoba_dictionary";

export const JotobaBaseURL = "https://jotoba.de";
export const KanjiapiBaseURL = "https://kanjiapi.dev/v1";

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
