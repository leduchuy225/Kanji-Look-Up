import React from "react";
import "../styles/text_view.css";
import { TextViewInformation } from "./text_view_information";
import { JotobaWord } from "../models/jotoba_dictionary";
import { JotobaBaseURL } from "../data/external_api";
import { showWordMeanings } from "../utils/text_view_utils";

export const WordMeaning = ({ word }: { word: JotobaWord }) => {
  if (!word) {
    return <></>;
  }
  return (
    <>
      <TextViewInformation
        title="Word"
        data={word.reading.furigana}
        titleStyle={{ backgroundColor: "#2c205f" }}
      />
      <TextViewInformation
        title="Meaning"
        data={showWordMeanings(word.senses)}
        titleStyle={{ backgroundColor: "#2c205f" }}
      />
      <audio className="audioPlayer" controls>
        <source src={`${JotobaBaseURL}${word.audio}`} />
      </audio>
      <hr className="divider" />
    </>
  );
};
