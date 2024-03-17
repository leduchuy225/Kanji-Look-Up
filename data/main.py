import json


kanjiToRadical = json.loads(open("kanji_to_radical.json", "r").read())
radicalToKanji = json.loads(open("radical_to_kanji.json", "r").read())

kanjiToRadicalProcess = json.loads(
    open("kanji_to_radical.process.json", "r").read())
radicalToKanjiProcess = json.loads(
    open("radical_to_kanji.process.json", "r").read())


def findRadical(yourRadical: str):
  for radical in radicalToKanjiProcess:
    if text(yourRadical) == text(radical['radical_name']):
      return radical
  return None


def text(yourText: str):
  return yourText.strip().lower()


def processRadicalToKanji():
  newJson = []

  for radical in radicalToKanji:
    radical['kanji_words'] = []

    for word in radical['kanji'].split('),'):
      newWord: str = text(word)
      radical['kanji_words'].append(newWord.replace('(', '').replace(')', ''))

    newJson.append(radical)

  with open("radical_to_kanji.process.json", "w") as f:
    json.dump(newJson, f, ensure_ascii=False)


def processKanjiToRadical():
  newJson = []

  for kanji in kanjiToRadical:
    kanji['components'] = []
    radicals: str = kanji['radicals']

    for radical in radicals.split('+'):
      radicalFound = findRadical(radical)
      if radicalFound is not None:
        kanji['components'].append(radicalFound)

    newJson.append(kanji)

  with open("kanji_to_radical.process.json", "w") as f:
    json.dump(newJson, f, ensure_ascii=False)


# processRadicalToKanji()
processKanjiToRadical()
