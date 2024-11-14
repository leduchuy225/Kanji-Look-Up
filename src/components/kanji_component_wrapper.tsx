import { ReactNode, useContext, useState } from "react";
import { KanjiComponent } from "../models/interface";
import React from "react";
import { isRadicalInvalid } from "../utils/utils";
import { AppContext } from "../popup";

export const KanjiComponentWrapper = ({
  data,
}: {
  data: KanjiComponent[];
}): ReactNode => {
  return (
    <span className="text-view-content">
      {data.map((item) => (
        <KanjiComponentShow item={item} />
      ))}
    </span>
  );
};

const KanjiComponentShow = ({ item }: { item: KanjiComponent }) => {
  const { onSearchKanji } = useContext(AppContext);
  const [isShowKanjiWords, setIsShowKanjiWord] = useState(false);

  return (
    <p className="text no-padding">
      {isRadicalInvalid(item.radical) ? (
        <a className="highlight" href={item.radical} target="_blank">
          ( {item.radical_name} )
        </a>
      ) : (
        <div>
          <span
            className="pointer"
            onClick={() => setIsShowKanjiWord(!isShowKanjiWords)}
          >
            {item.radical}{" "}
            <a
              target="_blank"
              className="highlight"
              href={`https://www.wanikani.com/radicals/${item.radical_name}`}
            >
              ( {item.radical_name} )
            </a>
          </span>

          {isShowKanjiWords ? (
            <div className="subtitle">
              {(item.kanji_words ?? []).map((word) => {
                const [wordSearch, ...rest] = word.split(" ");
                return (
                  <div>
                    <span
                      className="pointer"
                      onClick={() => {
                        wordSearch.trim() && onSearchKanji(wordSearch.trim());
                      }}
                    >
                      {`• ${wordSearch}`}{" "}
                    </span>
                    {rest.join(" ")}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </p>
  );
};
