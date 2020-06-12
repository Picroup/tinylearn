
export function decodeIntCursor(cursor: string): number {
  const value = parseInt(cursor);
  if (isNaN(value)) throw new Error(`Cursor is not int cursor`);
  return value;
}

export function encodeIntCursor(value: number) {
  return `${value}`;
}