import { KanjiComponent } from "../models/interface";
import { JotobaSense } from "../models/jotoba_dictionary";

export const showMeanings = (
  tempData: string,
  data?: string[] | null
): string => {
  if (!data) {
    return tempData;
  }
  return data.join("\n");
};

export const showKunReadings = (data?: string[] | null): string => {
  if (!data) {
    return "";
  }
  return data.join("\n");
};

export const showOnReadings = (data?: string[] | null): string => {
  if (!data) {
    return "";
  }
  return data.join("\n");
};

export const showComponents = (data: KanjiComponent[]): string => {
  return data
    .map((item) => `${item.radical} ( ${item.radical_name} )`)
    .join("\n");
};

export const showWordMeanings = (data: JotobaSense[]): string => {
  return data.map((item) => item.glosses.join(" - ")).join("\n");
};
