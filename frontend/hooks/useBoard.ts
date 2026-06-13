"use client";

import { useCallback, useState } from "react";
import {
  addCard as addCardAction,
  deleteCard as deleteCardAction,
  moveCard as moveCardAction,
  renameColumn as renameColumnAction,
} from "@/lib/board-actions";
import { initialBoard } from "@/lib/dummy-data";
import type { Board } from "@/lib/types";

export function useBoard() {
  const [board, setBoard] = useState<Board>(initialBoard);

  const renameColumn = useCallback((columnId: string, title: string) => {
    setBoard((current) => renameColumnAction(current, columnId, title));
  }, []);

  const addCard = useCallback(
    (columnId: string, title: string, details: string) => {
      setBoard((current) => addCardAction(current, columnId, title, details));
    },
    []
  );

  const deleteCard = useCallback((columnId: string, cardId: string) => {
    setBoard((current) => deleteCardAction(current, columnId, cardId));
  }, []);

  const moveCard = useCallback(
    (
      cardId: string,
      sourceColumnId: string,
      destColumnId: string,
      destIndex: number
    ) => {
      setBoard((current) =>
        moveCardAction(current, cardId, sourceColumnId, destColumnId, destIndex)
      );
    },
    []
  );

  return {
    board,
    renameColumn,
    addCard,
    deleteCard,
    moveCard,
  };
}
