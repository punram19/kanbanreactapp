import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useBoard } from "./useBoard";

describe("useBoard", () => {
  it("initializes with dummy data", () => {
    const { result } = renderHook(() => useBoard());

    expect(result.current.board.columns).toHaveLength(5);
    expect(Object.keys(result.current.board.cards).length).toBeGreaterThan(0);
  });

  it("renames a column", () => {
    const { result } = renderHook(() => useBoard());

    act(() => {
      result.current.renameColumn("col-backlog", "Ideas");
    });

    expect(
      result.current.board.columns.find((c) => c.id === "col-backlog")?.title
    ).toBe("Ideas");
  });

  it("adds a card to a column", () => {
    const { result } = renderHook(() => useBoard());
    const initialCount = Object.keys(result.current.board.cards).length;

    act(() => {
      result.current.addCard("col-backlog", "Test card", "Test details");
    });

    expect(Object.keys(result.current.board.cards).length).toBe(
      initialCount + 1
    );
    const backlog = result.current.board.columns.find(
      (c) => c.id === "col-backlog"
    );
    const lastCardId = backlog?.cardIds[backlog.cardIds.length - 1];
    expect(result.current.board.cards[lastCardId!]?.title).toBe("Test card");
  });

  it("deletes a card", () => {
    const { result } = renderHook(() => useBoard());

    act(() => {
      result.current.deleteCard("col-backlog", "card-1");
    });

    expect(result.current.board.cards["card-1"]).toBeUndefined();
  });

  it("moves a card between columns", () => {
    const { result } = renderHook(() => useBoard());

    act(() => {
      result.current.moveCard("card-1", "col-backlog", "col-ready", 0);
    });

    const backlog = result.current.board.columns.find(
      (c) => c.id === "col-backlog"
    );
    const ready = result.current.board.columns.find((c) => c.id === "col-ready");

    expect(backlog?.cardIds).not.toContain("card-1");
    expect(ready?.cardIds[0]).toBe("card-1");
  });
});
