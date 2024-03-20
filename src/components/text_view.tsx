import React, { ReactNode, useEffect, useState } from "react";
import { Kanji, KanjiResponse } from "../models/interface";
import {
  showMeanings,
  showOnReadings,
  showKunReadings,
  showComponents,
} from "../utils/text_view_utils";

import "../styles/text_view.css";
import { seachOneFromKanjiApi } from "../data/data_service";

const convertKanjiToKanjiResponse = (data: Kanji): KanjiResponse & Kanji => {
  return { ...data };
};

export const TextView = ({ kanji }: { kanji: Kanji }) => {
  const [data, setData] = useState<KanjiResponse & Kanji>(
    convertKanjiToKanjiResponse(kanji)
  );

  useEffect(() => {
    seachOneFromKanjiApi(kanji.kanji).then((response) => {
      setData({ ...response, ...kanji });
    });
  }, [kanji]);

  return (
    <>
      <TextViewInformation title="Kanji" data={data.kanji} />
      <TextViewInformation
        title="Components"
        data={showComponents(data.components)}
      />
      <TextViewInformation
        title="Meaning"
        data={showMeanings(data.meaning, data?.meanings)}
      />
      <TextViewInformation
        title="On Reading"
        data={showOnReadings(data?.on_readings)}
      />
      <TextViewInformation
        title="Kun Reading"
        data={showKunReadings(data?.kun_readings)}
      />
      <TextViewInformation
        title="Stroke"
        isVisible={!!data.unicode}
        child={
          <img
            className="text-view-content"
            src={`https://data.mazii.net/kanji/0${data.unicode?.toLowerCase()}.svg`}
          />
        }
      />
      <hr className="divider" />
    </>
  );
};

const TextViewInformation = ({
  data,
  title,
  child,
  isVisible = true,
}: {
  title: string;
  isVisible?: boolean;
  data?: string | null;
  child?: ReactNode | null;
}) => {
  if (!isVisible || (!data && !child)) {
    return null;
  }

  return (
    <div className="text-view-container">
      <div className="text-view-title">{title}</div>
      {data ? <span className="text-view-content text">{data}</span> : child}
    </div>
  );
};