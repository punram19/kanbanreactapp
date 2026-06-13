"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import { CardBody } from "@/components/CardItem";
import { Column } from "@/components/Column";
import type { Board, Card } from "@/lib/types";

type BoardProps = {
  board: Board;
  onRenameColumn: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
  onMoveCard: (
    cardId: string,
    sourceColumnId: string,
    destColumnId: string,
    destIndex: number
  ) => void;
};

export function Board({
  board,
  onRenameColumn,
  onAddCard,
  onDeleteCard,
  onMoveCard,
}: BoardProps) {
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  function findColumnByCardId(cardId: string) {
    return board.columns.find((column) => column.cardIds.includes(cardId));
  }

  function handleDragStart(event: DragStartEvent) {
    const card = board.cards[String(event.active.id)];
    if (card) {
      setActiveCard(card);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);

    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) {
      return;
    }

    const sourceColumn = findColumnByCardId(activeId);
    if (!sourceColumn) {
      return;
    }

    let destColumnId: string;
    let destIndex: number;

    const overColumn = board.columns.find((column) => column.id === overId);
    if (overColumn) {
      destColumnId = overColumn.id;
      destIndex = overColumn.cardIds.length;
    } else {
      const destColumn = findColumnByCardId(overId);
      if (!destColumn) {
        return;
      }
      destColumnId = destColumn.id;
      destIndex = destColumn.cardIds.indexOf(overId);
    }

    onMoveCard(activeId, sourceColumn.id, destColumnId, destIndex);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="mb-6 shrink-0">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--dark-navy)]">
            Project Board
          </h1>
          <p className="mt-1 text-sm text-[var(--gray-text)]">
            Drag cards between columns. Click a column name to rename it.
          </p>
        </header>

        <div
          className="flex min-h-0 flex-1 gap-4 overflow-x-auto pb-4"
          data-testid="kanban-board"
        >
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={board.cards}
              onRename={onRenameColumn}
              onAddCard={onAddCard}
              onDeleteCard={onDeleteCard}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeCard ? (
          <article className="w-[280px] rounded-lg border border-slate-200 bg-white p-4 shadow-lg">
            <CardBody
              card={activeCard}
              columnId=""
              onDelete={() => {}}
            />
          </article>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
