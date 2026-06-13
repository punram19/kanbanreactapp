"use client";

import { Board } from "@/components/Board";
import { useBoard } from "@/hooks/useBoard";

export default function Home() {
  const { board, renameColumn, addCard, deleteCard, moveCard } = useBoard();

  return (
    <main className="flex min-h-0 flex-1 flex-col bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <Board
        board={board}
        onRenameColumn={renameColumn}
        onAddCard={addCard}
        onDeleteCard={deleteCard}
        onMoveCard={moveCard}
      />
    </main>
  );
}
