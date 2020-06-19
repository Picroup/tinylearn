
export async function cursorItems<CursorData, Item>(
  { take, cursor, getData, decodeCursor, encodeCursor }:
    { take: number; cursor: string | undefined; getData: (take: number, cursorData: CursorData | null) => Promise<[Item[], number]>; decodeCursor: (cursor: string) => CursorData; encodeCursor: (item: Item) => string; },
) {
  const cursorData = cursor != null ? decodeCursor(cursor) : null;

  const [items, count] = await getData(take, cursorData);

  const newCursor = (() => {
    if (take >= count) return null;
    return encodeCursor(items[take - 1]);
  })();

  return {
    cursor: newCursor,
    items
  };
}