import { KanjiComponent } from "../models/interface";

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
    .map((item) => {
      return `${item.radical} ( ${item.radical_name} )`;
    })
    .join("\n");
};
