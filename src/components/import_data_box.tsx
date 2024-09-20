import React, { useContext } from "react";
import { handleJsonFile } from "../utils/utils";
import { importDataToLocalDB } from "../data/data_service";
import { KanjiTable, Message } from "../config/config";
import { AppContext } from "../popup";

export const ImportDataBox = () => {
  const { setDataImportedStatus } = useContext(AppContext);

  return (
    <input
      type="file"
      accept=".json"
      title="Import local database"
      onChange={(event) => {
        event.preventDefault();

        const reader = new FileReader();
        reader.readAsText(event.target.files![0]);
        reader.onload = async (e) => {
          const text = e.target?.result;
          if (text && typeof text === "string") {
            try {
              const jsonData = handleJsonFile(text);
              await importDataToLocalDB({
                data: jsonData,
                table: KanjiTable.name,
                message: "ClearAndInsert",
                callback: (request) => {
                  if (request.message == Message.InsertSuccessful) {
                    setDataImportedStatus();
                    alert(request.payload?.data);
                    return;
                  }
                  alert("Insert fail");
                },
              });
            } catch (error) {
              alert(error);
            }
          }
        };
      }}
    />
  );
};
