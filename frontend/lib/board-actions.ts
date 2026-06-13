import type { Board } from "./types";

export function renameColumn(
  board: Board,
  columnId: string,
  title: string
): Board {
  return {
    ...board,
    columns: board.columns.map((column) =>
      column.id === columnId ? { ...column, title } : column
    ),
  };
}

export function addCard(
  board: Board,
  columnId: string,
  title: string,
  details: string,
  id: string = crypto.randomUUID()
): Board {
  const card = { id, title, details };

  return {
    ...board,
    cards: { ...board.cards, [id]: card },
    columns: board.columns.map((column) =>
      column.id === columnId
        ? { ...column, cardIds: [...column.cardIds, id] }
        : column
    ),
  };
}

export function deleteCard(
  board: Board,
  columnId: string,
  cardId: string
): Board {
  const remainingCards = { ...board.cards };
  delete remainingCards[cardId];

  return {
    ...board,
    cards: remainingCards,
    columns: board.columns.map((column) =>
      column.id === columnId
        ? {
            ...column,
            cardIds: column.cardIds.filter((id) => id !== cardId),
          }
        : column
    ),
  };
}

export function moveCard(
  board: Board,
  cardId: string,
  sourceColumnId: string,
  destColumnId: string,
  destIndex: number
): Board {
  const columns = board.columns.map((column) => ({
    ...column,
    cardIds: [...column.cardIds],
  }));

  const sourceColumn = columns.find((column) => column.id === sourceColumnId);
  const destColumn = columns.find((column) => column.id === destColumnId);

  if (!sourceColumn || !destColumn) {
    return board;
  }

  const sourceIndex = sourceColumn.cardIds.indexOf(cardId);
  if (sourceIndex === -1) {
    return board;
  }

  sourceColumn.cardIds.splice(sourceIndex, 1);

  let insertIndex = destIndex;
  if (sourceColumnId === destColumnId && sourceIndex < destIndex) {
    insertIndex = destIndex - 1;
  }

  destColumn.cardIds.splice(insertIndex, 0, cardId);

  return { ...board, columns };
}
