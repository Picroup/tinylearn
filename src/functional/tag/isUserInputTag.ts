

export function isUserInputTag(word: string): boolean {
  return word.startsWith('#') && !word.startsWith('#@') && word.length < 31;
}