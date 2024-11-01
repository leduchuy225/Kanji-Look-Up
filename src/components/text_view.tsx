import React, { useEffect, useState } from "react";
import { Kanji, KanjiResponse } from "../models/interface";

import "../styles/text_view.css";
import { seachOneFromKanjiApi } from "../data/data_service";
import { TextViewInformation } from "./text_view_information";
import { KanjiComponentWrapper } from "./kanji_component_wrapper";
import { showKunReadings, showMeanings, showOnReadings } from "../utils/utils";

export const TextView = ({ kanji }: { kanji: Kanji }) => {
  const [data, setData] = useState<(KanjiResponse & Kanji) | undefined>(
    undefined
  );

  useEffect(() => {
    setData({ ...kanji });

    const fetchData = async () => {
      await seachOneFromKanjiApi(kanji.kanji, (response) => {
        setData({ ...response, ...kanji });
      });
    };

    fetchData();
  }, [kanji.kanji]);

  if (!data) {
    return <></>;
  }

  return (
    <>
      <TextViewInformation title="Kanji" data={data.kanji} />
      {data.components ? (
        <TextViewInformation
          title="Components"
          child={<KanjiComponentWrapper data={data.components} />}
        />
      ) : null}
      {data.meaning || data?.meanings ? (
        <TextViewInformation
          title="Meaning"
          data={showMeanings(data.meaning, data?.meanings)}
        />
      ) : null}
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
