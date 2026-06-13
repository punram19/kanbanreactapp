"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { AddCardForm } from "@/components/AddCardForm";
import { CardItem } from "@/components/CardItem";
import type { Board, Column as ColumnType } from "@/lib/types";

type ColumnProps = {
  column: ColumnType;
  cards: Board["cards"];
  onRename: (columnId: string, title: string) => void;
  onAddCard: (columnId: string, title: string, details: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
};

export function Column({
  column,
  cards,
  onRename,
  onAddCard,
  onDeleteCard,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showAddForm, setShowAddForm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column" },
  });

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  function saveTitle() {
    const trimmed = editTitle.trim();
    if (trimmed) {
      onRename(column.id, trimmed);
    } else {
      setEditTitle(column.title);
    }
    setIsEditing(false);
  }

  function handleTitleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      saveTitle();
    } else if (event.key === "Escape") {
      setEditTitle(column.title);
      setIsEditing(false);
    }
  }

  function handleAddCard(title: string, details: string) {
    onAddCard(column.id, title, details);
    setShowAddForm(false);
  }

  const columnCards = column.cardIds
    .map((id) => cards[id])
    .filter(Boolean);

  return (
    <section
      className="flex w-[min(100%,280px)] shrink-0 flex-col"
      data-testid={`column-${column.id}`}
    >
      <header className="mb-3 border-b-2 border-[var(--accent-yellow)] pb-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
            onBlur={saveTitle}
            onKeyDown={handleTitleKeyDown}
            className="w-full rounded border border-slate-200 px-2 py-1 text-sm font-semibold text-[var(--dark-navy)] outline-none focus:border-[var(--blue-primary)] focus:ring-2 focus:ring-[var(--blue-primary)]/20"
            data-testid={`column-title-input-${column.id}`}
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditTitle(column.title);
              setIsEditing(true);
            }}
            className="w-full text-left text-sm font-semibold text-[var(--dark-navy)] transition hover:text-[var(--blue-primary)]"
            data-testid={`column-title-${column.id}`}
          >
            {column.title}
            <span className="ml-2 text-xs font-normal text-[var(--gray-text)]">
              {columnCards.length}
            </span>
          </button>
        )}
      </header>

      <div
        ref={setNodeRef}
        className={`flex min-h-[120px] flex-1 flex-col gap-3 rounded-lg p-1 transition-colors ${
          isOver ? "bg-[var(--blue-primary)]/5" : "bg-transparent"
        }`}
      >
        <SortableContext
          items={column.cardIds}
          strategy={verticalListSortingStrategy}
        >
          {columnCards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              columnId={column.id}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>

        {columnCards.length === 0 && !showAddForm ? (
          <p className="py-4 text-center text-xs text-[var(--gray-text)]">
            No cards yet
          </p>
        ) : null}

        {showAddForm ? (
          <AddCardForm
            onSubmit={handleAddCard}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="rounded-lg border border-dashed border-slate-300 px-3 py-2 text-sm text-[var(--blue-primary)] transition hover:border-[var(--blue-primary)] hover:bg-slate-50"
            data-testid={`add-card-button-${column.id}`}
          >
            + Add card
          </button>
        )}
      </div>
    </section>
  );
}
