import React from "react";
import "../styles/text_view.css";
import { TextViewInformation } from "./text_view_information";
import {
  JotobaPitch,
  JotobaSense,
  JotobaWord,
} from "../models/jotoba_dictionary";
import { JotobaBaseURL } from "../data/external_api";
import { convertObjectToString, handleFurigana } from "../utils/utils";
import { sendTelegramMessage } from "../utils/telegram_utils";

export const WordMeaning = ({ word }: { word: JotobaWord }) => {
  const commonStyle = { backgroundColor: "#29494c" };

  if (!word) {
    return <></>;
  }

  return (
    <>
      <TextViewInformation
        title="Kanji"
        titleStyle={commonStyle}
        onClickTitle={() => sendTelegramMessage(word)}
        tooltip="Click to send this kanji to Kanji-Look-Up group"
        child={
          <div className="text-view-content text">
            {word.reading.kanji}{" "}
            <span className="subtitle">{word.reading.kana}</span>
          </div>
        }
      />
      <TextViewInformation
        title="Furigana"
        titleStyle={commonStyle}
        data={handleFurigana(word.reading.furigana, true)}
      />
      {word.pitch ? (
        <TextViewInformation
          title="Pitch"
          titleStyle={commonStyle}
          child={<JotobaWordPitchWrapper data={word.pitch} />}
        />
      ) : null}
      <TextViewInformation
        title="Meaning"
        titleStyle={commonStyle}
        child={<JotobaWordMeaningWrapper data={word.senses} />}
      />
      {word.audio ? (
        <audio className="audioPlayer" controls>
          <source src={`${JotobaBaseURL}${word.audio}`} />
        </audio>
      ) : undefined}
      <hr className="divider" />
    </>
  );
};

export const JotobaWordMeaningWrapper = ({ data }: { data: JotobaSense[] }) => {
  return (
    <div className="text-view-content text">
      {data.map((item) => {
        const information = convertObjectToString(item.pos);
        return (
          <div>
            <span className="subtitle">{`• ${information}`}</span>
            <div>{item.glosses.join(" - ")}</div>
            <br />
          </div>
        );
      })}
    </div>
  );
};

export const JotobaWordPitchWrapper = ({ data }: { data: JotobaPitch[] }) => {
  return (
    <div className="text-view-content text">
      {data.map((item) => (
        <span {...(!item.high ? { className: "subtitle" } : {})}>
          {item.part}
        </span>
      ))}
    </div>
  );
};
