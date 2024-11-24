import { MyKanjiWord } from "../models/interface";
import { JotobaWord } from "../models/jotoba_dictionary";
import {
  convertObjectToString,
  handleFurigana,
  isRadicalInvalid,
  showKunReadings,
  showMeanings,
  showOnReadings,
} from "./utils";

const BOT_TOKEN = [
  54, 56, 57, 53, 55, 56, 50, 55, 49, 52, 58, 65, 65, 72, 104, 112, 80, 120,
  117, 111, 95, 120, 53, 57, 119, 85, 113, 73, 95, 48, 69, 89, 117, 101, 115,
  95, 102, 113, 65, 120, 115, 98, 51, 111, 85, 48,
];

const CHAT_ID = [45, 49, 48, 48, 50, 51, 50, 48, 50, 56, 50, 55, 49, 57];

export const handleJotobaWordToText = (word: JotobaWord): string => {
  const dictionaryURL = `https://www.japandict.com/${word.reading.kanji}`;

  const formattedMessage = `
🌸 <code>${word.reading.kanji ?? word.reading.kana}</code>

<strong>Hiragana</strong>
🏮 ${word.reading.kana}

<strong>Furigana</strong>  
🏮 ${handleFurigana(word.reading.furigana) ?? word.reading.kana}

<strong>Meaning</strong>
${word.senses
  .map((sense) => {
    const subtitle = `🎌 <i>${convertObjectToString(sense.pos)}</i>`;
    return `${subtitle}\n🏮 ${sense.glosses.join(" - ")}`;
  })
  .join("\n\n")}
  
<strong>URL</strong>
🏮 <a href="${dictionaryURL}">${dictionaryURL}</a>`;

  return formattedMessage;
};

export const handleKanjiToText = (data: MyKanjiWord): string => {
  const kanjiURL = `https://jisho.org/search/${data?.kanji}%20%23kanji`;

  const formattedMessage = `
🌸 <code>${data?.kanji}</code>
${
  data?.components
    ? `
<strong>Components</strong>
${data?.components
  ?.map((item) =>
    isRadicalInvalid(item.radical)
      ? `• ${item.radical_name}`
      : `• ${item.radical} ${item.radical_name}`
  )
  .join("\n")}
  `
    : ""
} 
<strong>Meaning</strong>  
${showMeanings(data?.meaning, data?.meanings)}

<strong>On Reading</strong>  
${showOnReadings(data?.on_readings)}

<strong>Kun Reading</strong>  
${showKunReadings(data?.kun_readings)}

<strong>URL</strong>
🏮 <a href="${kanjiURL}">${kanjiURL}</a>`;

  return formattedMessage;
};

export const sendTelegramMessage = ({
  word,
  kanji,
}: {
  word?: JotobaWord;
  kanji?: MyKanjiWord;
}) => {
  const token = String.fromCharCode(...BOT_TOKEN);

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  let formattedMessage = "";

  if (word) {
    formattedMessage = handleJotobaWordToText(word);
  } else if (kanji) {
    formattedMessage = handleKanjiToText(kanji);
  }

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
