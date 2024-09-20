import { handleStringContent } from "./utils";

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
