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
        titleStyle={{ backgroundColor: "#29494c" }}
      />
      <TextViewInformation
        title="Meaning"
        data={showWordMeanings(word.senses)}
        titleStyle={{ backgroundColor: "#29494c" }}
      />
      <audio className="audioPlayer" controls>
        <source src={`${JotobaBaseURL}${word.audio}`} />
      </audio>
      <hr className="divider" />
    </>
  );
};
