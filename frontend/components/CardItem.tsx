"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Card } from "@/lib/types";

type CardItemProps = {
  card: Card;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
};

export function CardItem({ card, columnId, onDelete }: CardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "card", columnId } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        isDragging ? "opacity-40" : ""
      }`}
      data-testid={`card-${card.id}`}
    >
      <CardBody
        card={card}
        columnId={columnId}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </article>
  );
}

type CardBodyProps = {
  card: Card;
  columnId: string;
  onDelete: (columnId: string, cardId: string) => void;
  dragHandleProps?: Record<string, unknown>;
};

export function CardBody({
  card,
  columnId,
  onDelete,
  dragHandleProps,
}: CardBodyProps) {
  return (
    <>
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3
          className="cursor-grab text-sm font-semibold text-[var(--dark-navy)] active:cursor-grabbing"
          {...dragHandleProps}
        >
          {card.title}
        </h3>
        <button
          type="button"
          aria-label={`Delete ${card.title}`}
          onClick={() => onDelete(columnId, card.id)}
          className="shrink-0 rounded px-1.5 py-0.5 text-xs text-[var(--gray-text)] opacity-100 transition hover:bg-red-50 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100"
        >
          Delete
        </button>
      </div>
      {card.details ? (
        <p className="text-sm leading-relaxed text-[var(--gray-text)]">
          {card.details}
        </p>
      ) : null}
    </>
  );
}
