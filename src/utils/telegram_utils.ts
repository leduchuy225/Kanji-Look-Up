import { JotobaWord } from "../models/jotoba_dictionary";
import { convertObjectToString, handleFurigana } from "./utils";

const BOT_TOKEN = [
  54, 56, 57, 53, 55, 56, 50, 55, 49, 52, 58, 65, 65, 72, 104, 112, 80, 120,
  117, 111, 95, 120, 53, 57, 119, 85, 113, 73, 95, 48, 69, 89, 117, 101, 115,
  95, 102, 113, 65, 120, 115, 98, 51, 111, 85, 48,
];

const CHAT_ID = [45, 49, 48, 48, 50, 51, 50, 48, 50, 56, 50, 55, 49, 57];

export const sendTelegramMessage = (word: JotobaWord) => {
  const token = String.fromCharCode(...BOT_TOKEN);

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const dictionaryURL = `https://www.japandict.com/${word.reading.kanji}`;

  const formattedMessage = `
🌸 <code>${word.reading.kanji}</code>

<strong>Hiragana</strong>
🏮 ${word.reading.kana}

<strong>Furigana</strong>  
🏮 ${handleFurigana(word.reading.furigana, false)}

<strong>Meaning</strong>
${word.senses
  .map((sense) => {
    const subtitle = `🎌 <i>${convertObjectToString(sense.pos)}</i>`;
    return `${subtitle}\n🏮 ${sense.glosses.join(" - ")}`;
  })
  .join("\n\n")}
  
<strong>URL</strong>
🏮 <a href="${dictionaryURL}">${dictionaryURL}</a>`;

  const data = {
    parse_mode: "HTML",
    text: formattedMessage,
    chat_id: String.fromCharCode(...CHAT_ID),
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Message sent successfully:", data);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      alert(JSON.stringify(error));
    });
};
