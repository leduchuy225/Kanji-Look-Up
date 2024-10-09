import React, { useRef, useState } from "react";
import CanvasDraw from "react-canvas-draw";
import { CanvasHeight, CanvasWidth } from "../config/config";
import { lookUpByDrawInput } from "../data/external_api";

export const CanvasInput = () => {
  const canvasRef = useRef<any>(null);
  // const { onSearchKanji } = useContext(AppContext);

  const [recommendedWords, setRecommendedWords] = useState<string[]>([]);

  return (
    <>
      <CanvasDraw
        brushRadius={4}
        ref={canvasRef}
        canvasWidth={CanvasWidth}
        canvasHeight={CanvasHeight}
        onChange={async (data: any) => {
          const lines = data?.lines ?? [];
          const response = await lookUpByDrawInput(lines);

          Array.isArray(response) && setRecommendedWords(response);
        }}
      />
      <div
        className="row"
        style={{
          alignItems: "center",
          whiteSpace: "nowrap",
          justifyContent: "space-around",
        }}
      >
        <p
          className="pointer highlight text"
          onClick={() => {
            canvasRef.current?.eraseAll();
          }}
        >
          Erase
        </p>
        <p
          className="pointer highlight text"
          onClick={() => {
            canvasRef.current?.undo();
          }}
        >
          Undo
        </p>
      </div>
      <div
        className="row"
        style={{
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {recommendedWords.map((word) => (
          <div
            className="pointer box"
            onClick={async () => {
              await navigator.clipboard.writeText(word.trim());
              window.scrollTo(0, 0);
            }}
          >
            <span className="no-padding highlight text">{word}</span>
          </div>
        ))}
      </div>
    </>
  );
};
