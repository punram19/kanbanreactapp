import { DndContext } from "@dnd-kit/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Column } from "./Column";
import { initialBoard } from "@/lib/dummy-data";

function renderColumn(overrides: Partial<Parameters<typeof Column>[0]> = {}) {
  const column = initialBoard.columns[0];
  const props = {
    column,
    cards: initialBoard.cards,
    onRename: vi.fn(),
    onAddCard: vi.fn(),
    onDeleteCard: vi.fn(),
    ...overrides,
  };

  render(
    <DndContext>
      <Column {...props} />
    </DndContext>
  );

  return props;
}

describe("Column", () => {
  it("renders column title and cards", () => {
    renderColumn();

    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByText("Research competitors")).toBeInTheDocument();
  });

  it("enters edit mode when title is clicked", async () => {
    const user = userEvent.setup();
    renderColumn();

    await user.click(screen.getByTestId("column-title-col-backlog"));

    expect(
      screen.getByTestId("column-title-input-col-backlog")
    ).toBeInTheDocument();
  });

  it("calls onRename when title is saved", async () => {
    const user = userEvent.setup();
    const props = renderColumn();

    await user.click(screen.getByTestId("column-title-col-backlog"));
    const input = screen.getByTestId("column-title-input-col-backlog");
    await user.clear(input);
    await user.type(input, "Ideas");
    await user.keyboard("{Enter}");

    expect(props.onRename).toHaveBeenCalledWith("col-backlog", "Ideas");
  });

  it("shows add card form and submits", async () => {
    const user = userEvent.setup();
    const props = renderColumn();

    await user.click(screen.getByTestId("add-card-button-col-backlog"));
    await user.type(screen.getByPlaceholderText("Title"), "New card");
    await user.type(
      screen.getByPlaceholderText("Details (optional)"),
      "Some details"
    );
    await user.click(screen.getByRole("button", { name: "Add card" }));

    expect(props.onAddCard).toHaveBeenCalledWith(
      "col-backlog",
      "New card",
      "Some details"
    );
  });
});
