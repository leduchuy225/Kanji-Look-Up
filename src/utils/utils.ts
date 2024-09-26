import { SeparatorElement } from "../config/config";
import { CanvasDrawLine } from "../models/interface";

export const isJapaneseCharacter = (data: string) => {
  const regex =
    /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
  return regex.test(data);
};

export const isAllElementNull = (data: any[]) => {
  return !data.some((item) => item != null && item != undefined);
};

export const handleJsonFile = (jsonData: string) => {
  const data = JSON.parse(jsonData);
  if (!Array.isArray(data)) {
    throw "Invalid json file";
  }
  if (!data[0]?.kanji) {
    throw "Invalid json file";
  }
  return data;
};

export const isRadicalInvalid = (data: string) => {
  return data.includes("wanikani");
};

export const getInkPositionFromCanvasLines = (lines: CanvasDrawLine[]) => {
  return lines.map((line) => {
    const x = [];
    const y = [];
    for (const point of line.points) {
      x.push(point.x);
      y.push(point.y);
    }
    return [x, y];
  });
};

export const handleStringContent = (data: any[]) => {
  return data.map((word) => `• ${word}`).join("\n");
};

export const convertObjectToString = <T extends object>(data: T[]) => {
  return data
    .map((item) => {
      if (typeof item == "string" || item instanceof String) {
        return item;
      }
      return Object.keys(item)
        .map((key) => `${key}: ${JSON.stringify((item as any)[key])}`)
        .join(",");
    })
    .join(` ${SeparatorElement} `);
};

export const isKanji = (character: string) => {
  const code = character.charCodeAt(0);
  // Kanji Unicode range: U+4E00 to U+9FBF
  return code >= 0x4e00 && code <= 0x9fbf;
};

export const showMeanings = (
  tempData?: string,
  data?: string[] | null
): string => {
  if (!data) {
    return tempData ?? "";
  }
  return handleStringContent(data);
};

export const showKunReadings = (data?: string[] | null): string => {
  if (!data) {
    return "";
  }
  return handleStringContent(data);
};

export const showOnReadings = (data?: string[] | null): string => {
  if (!data) {
    return "";
  }
  return handleStringContent(data);
};

export const handleFurigana = (data: string, haveSpace: boolean) => {
  return data
    .replace(/\[/g, " [ ")
    .replace(/\]/g, " ] ")
    .replace(/\|/g, haveSpace ? ` ${SeparatorElement} ` : `${SeparatorElement}`)
    .trim();
};
