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
