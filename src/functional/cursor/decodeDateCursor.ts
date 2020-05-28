
export function decodeDateCursor(cursor: string): Date {
  const time = parseInt(cursor);
  if (isNaN(time)) throw new Error(`Cursor is not date cursor`);
  return new Date(time);
}

export function encodeDateCursor(date: Date) {
  return `${date.getTime()}`;
}