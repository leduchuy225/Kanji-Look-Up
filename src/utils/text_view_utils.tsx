import "../styles/text_view.css";
import React, { ReactNode } from "react";
import { KanjiComponent } from "../models/interface";
import { JotobaSense } from "../models/jotoba_dictionary";
import { handleStringContent, isRadicalInvalid } from "./utils";

export const showMeanings = (
  tempData: string,
  data?: string[] | null
): string => {
  if (!data) {
    return tempData;
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

export const showWordMeanings = (data: JotobaSense[]): string => {
  return handleStringContent(data.map((item) => item.glosses.join(" - ")));
};

export const showComponents = (data: KanjiComponent[]): ReactNode => {
  return (
    <span className="text-view-content">
      {data.map((item) => {
        return (
          <p className="text no-padding">
            {isRadicalInvalid(item.radical) ? (
              <a className="highlight" href={item.radical} target="_blank">
                ( {item.radical_name} )
              </a>
            ) : (
              <span>
                {item.radical} ( {item.radical_name} )
              </span>
            )}
          </p>
        );
      })}
    </span>
  );
};
