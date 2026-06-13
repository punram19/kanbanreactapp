import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CardItem } from "./CardItem";
import { initialBoard } from "@/lib/dummy-data";

describe("CardItem", () => {
  it("renders card title and details", () => {
    const card = initialBoard.cards["card-1"];

    render(
      <DndContext>
        <SortableContext
          items={[card.id]}
          strategy={verticalListSortingStrategy}
        >
          <CardItem
            card={card}
            columnId="col-backlog"
            onDelete={vi.fn()}
          />
        </SortableContext>
      </DndContext>
    );

    expect(screen.getByText(card.title)).toBeInTheDocument();
    expect(screen.getByText(card.details)).toBeInTheDocument();
  });

  it("calls onDelete when delete is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const card = initialBoard.cards["card-1"];

    render(
      <DndContext>
        <SortableContext
          items={[card.id]}
          strategy={verticalListSortingStrategy}
        >
          <CardItem
            card={card}
            columnId="col-backlog"
            onDelete={onDelete}
          />
        </SortableContext>
      </DndContext>
    );

    await user.click(screen.getByRole("button", { name: `Delete ${card.title}` }));

    expect(onDelete).toHaveBeenCalledWith("col-backlog", card.id);
  });
});
