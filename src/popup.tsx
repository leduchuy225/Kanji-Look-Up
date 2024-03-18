import React, { useEffect } from "react";
import "./styles/style.css";
import { createRoot } from "react-dom/client";
import { importDataToLocalDB } from "./utils/utils";

const Popup = () => {
  useEffect(() => {}, []);

  return (
    <div className="form">
      <input
        type="file"
        accept=".json"
        onChange={(event) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const text = e.target?.result;
            if (text && typeof text === "string") {
              await importDataToLocalDB(text);
            }
          };
          reader.readAsText(event.target.files![0]);
        }}
      />
      <input
        id="kanji"
        type="text"
        name="kanjiCharacter"
        placeholder="Your Kanji character..."
      />
      <input type="submit" value="Submit" onClick={(event) => {}} />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
