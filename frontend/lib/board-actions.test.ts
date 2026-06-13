import { describe, expect, it } from "vitest";
import {
  addCard,
  deleteCard,
  moveCard,
  renameColumn,
} from "./board-actions";
import { initialBoard } from "./dummy-data";

describe("renameColumn", () => {
  it("renames a column by id", () => {
    const result = renameColumn(initialBoard, "col-backlog", "Ideas");

    expect(result.columns.find((c) => c.id === "col-backlog")?.title).toBe(
      "Ideas"
    );
  });

  it("leaves other columns unchanged", () => {
    const result = renameColumn(initialBoard, "col-backlog", "Ideas");

    expect(result.columns.find((c) => c.id === "col-ready")?.title).toBe(
      "Ready"
    );
  });
});

describe("addCard", () => {
  it("adds a card to the specified column", () => {
    const result = addCard(
      initialBoard,
      "col-backlog",
      "New task",
      "Some details",
      "card-new"
    );

    expect(result.cards["card-new"]).toEqual({
      id: "card-new",
      title: "New task",
      details: "Some details",
    });
    expect(
      result.columns.find((c) => c.id === "col-backlog")?.cardIds
    ).toContain("card-new");
  });
});

describe("deleteCard", () => {
  it("removes the card from the board and column", () => {
    const result = deleteCard(initialBoard, "col-backlog", "card-1");

    expect(result.cards["card-1"]).toBeUndefined();
    expect(
      result.columns.find((c) => c.id === "col-backlog")?.cardIds
    ).not.toContain("card-1");
  });

  it("handles deleting the last card in a column", () => {
    const result = deleteCard(initialBoard, "col-review", "card-8");

    expect(
      result.columns.find((c) => c.id === "col-review")?.cardIds
    ).toHaveLength(0);
  });
});

describe("moveCard", () => {
  it("moves a card to another column at the end", () => {
    const result = moveCard(
      initialBoard,
      "card-1",
      "col-backlog",
      "col-ready",
      2
    );

    const backlog = result.columns.find((c) => c.id === "col-backlog");
    const ready = result.columns.find((c) => c.id === "col-ready");

    expect(backlog?.cardIds).not.toContain("card-1");
    expect(ready?.cardIds).toContain("card-1");
    expect(ready?.cardIds.indexOf("card-1")).toBe(2);
  });

  it("moves a card to an empty column", () => {
    const emptied = deleteCard(initialBoard, "col-review", "card-8");
    const result = moveCard(emptied, "card-1", "col-backlog", "col-review", 0);

    expect(
      result.columns.find((c) => c.id === "col-review")?.cardIds
    ).toEqual(["card-1"]);
  });

  it("reorders a card within the same column", () => {
    const result = moveCard(
      initialBoard,
      "card-1",
      "col-backlog",
      "col-backlog",
      2
    );

    const backlog = result.columns.find((c) => c.id === "col-backlog");
    expect(backlog?.cardIds).toEqual(["card-2", "card-1", "card-3"]);
  });
});
