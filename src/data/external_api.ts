import { KanjiResponse } from "../models/interface";

const BASE_URL = "https://kanjiapi.dev/v1";

export const getKanjiCharacter = async (kanji: string) => {
  return fetch(`${BASE_URL}/kanji/${kanji}`, {
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
