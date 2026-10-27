const badwords = [
  "kerfuffle",
  "sharbert",
  "fornax",
]

export function replace_profanity(sentence: string): string {
  const words = sentence.split(" ");

  for (let wi in words) {
    if (badwords.includes(words[wi].toLowerCase())) {
      words[wi] = "****";
    }
  }

  return words.join(" ");
}