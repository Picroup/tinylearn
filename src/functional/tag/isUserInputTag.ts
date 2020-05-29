

export function isUserInputTag(word: string): boolean {
  return word.startsWith('#') 
    && !word.includes('@')
    && word.length < 31;
}