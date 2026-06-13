# Code Review

## Summary

The codebase is well-structured and appropriately scoped for an MVP. Architecture choices are sound: a normalized data model, pure board-action functions, a thin hook layer, and clean component decomposition. The test coverage is good at the unit level. A few correctness issues and a meaningful testing gap are worth addressing.

---

## Architecture

**Strengths**

- Normalized board state (`cards` as a flat `Record<string, Card>`, `columns` holding ordered `cardIds[]`) is the right model for a drag-and-drop board. It avoids duplication and makes moves O(n) on column length, not card count.
- Board-action functions (`lib/board-actions.ts`) are pure — they take a `Board` and return a new `Board`. This makes them trivially testable and keeps mutation entirely out of React state.
- `useBoard` does nothing but wire the pure functions to `useState`. Callbacks are memoized with empty deps, which is correct since `setBoard` is stable.
- `CardBody` extracted from `CardItem` is a practical solution for sharing card rendering between the real card and the `DragOverlay` ghost.

---

## Bugs

### 1. `deleteCard` does not verify card belongs to the given column

`board-actions.ts:36-56` — `deleteCard` takes a `columnId` and uses it to filter `cardIds`, but there is no check that the card actually exists in that column. If the caller passes a mismatched `columnId`, the card is deleted from `board.cards` but its reference is left dangling in the real column's `cardIds`.

The call site in `CardItem.tsx` always supplies the correct `columnId` (it is passed as a prop from `Column`), so this is not a practical bug today, but it is a silent failure mode if the API is ever called incorrectly.

**Fix:** either assert `sourceColumn.cardIds.includes(cardId)` before deleting, or look up the column by card ID instead of trusting the caller.

### 2. `SortableContext` items mismatch after card deletion

`Column.tsx:114` — `SortableContext` is given `column.cardIds` as its `items` prop. After a delete, `column.cardIds` is updated correctly via state, so this is fine. However, the `filter(Boolean)` on line 71 means the rendered items can diverge from the `items` prop if there is ever a card ID in `cardIds` with no matching entry in `board.cards`. `@dnd-kit/sortable` will warn and may misbehave if the rendered sortable IDs do not exactly match `items`. This is a latent issue.

### 3. Drop onto self is silently dropped but no reorder occurs

`Board.tsx:68-70` — when `activeId === overId` the handler returns early. This is correct for same-card no-ops, but also fires when a card is dragged and released over itself after hovering briefly over another card. The behavior is correct but worth noting: there is no visual feedback that the drop was a no-op.

---

## Code Quality

### `"use client"` on every component

All components and the hook carry `"use client"`. This works but is broader than necessary — only the root component that owns interactivity (`page.tsx`) strictly needs it. In Next.js, `"use client"` propagates down the tree, so marking every leaf individually adds noise without benefit. This is a minor style point; it does not affect correctness.

### `editTitle` initialization in `Column.tsx`

`Column.tsx:29` — `useState(column.title)` initializes edit state from the prop at mount. The state is refreshed on each edit-mode entry (`setEditTitle(column.title)` on line 93), so the input always reflects the current title. This is correct. However, if `column.title` were to change while the input is already open (edge case not reachable in current code), the in-progress edit would be silently overwritten. No action needed now.

### `CardBody` exported from `CardItem.tsx`

Exporting `CardBody` alongside `CardItem` from the same file is functional but unexpected. A reader opening `CardItem.tsx` for `CardBody` would not find it via the filename. This is a minor discoverability issue.

### Empty `onDelete` in `DragOverlay`

`Board.tsx:136` — the overlay renders `CardBody` with `onDelete={() => {}}`. The delete button is therefore rendered but does nothing during drag. This is intentional and harmless, but the button is still keyboard-focusable inside the overlay. Consider `aria-hidden="true"` on the overlay article to prevent screen readers from announcing a non-functional button.

---

## Testing

### Covered well

- All four board-action functions have unit tests covering the primary path and at least one edge case (`board-actions.test.ts`).
- `Column` tests cover rendering, rename interaction, and add-card flow.
- `CardItem` tests cover rendering and delete callback.
- `useBoard` hook tests cover all four operations end-to-end.

### Gaps

| Missing test | File | Risk |
|---|---|---|
| Empty-title rename reverts to original | `Column.test.tsx` | Column title silently cleared if user submits blank |
| Escape cancels rename without calling `onRename` | `Column.test.tsx` | UX regression if keyboard cancel breaks |
| `AddCardForm` in isolation | No test file | Form submit with empty title should be a no-op |
| `moveCard` — drop onto same card (no-op) | `board-actions.test.ts` | Edge case near identity reorder |
| `deleteCard` — card ID not in given column | `board-actions.test.ts` | Silent failure described in Bugs section |

### No integration tests

`CLAUDE.md` calls for Playwright integration testing. No `playwright.config.*` or `e2e/` directory exists. The drag-and-drop happy path is entirely untested at the integration level, which is the riskiest user flow in the app.

---

## Minor / Style

- `postcss.config.mjs` and `eslint.config.mjs` are boilerplate from `create-next-app` and appear uncustomized. No issue.
- `next.config.ts` is empty. Fine for an MVP.
- Color variables are defined correctly in `globals.css` and consumed via `var(--...)` throughout. Consistent.
- `geistMono` font is loaded in `layout.tsx` but only referenced in the `@theme` block in CSS; it is never used in the UI. Remove to avoid an unused network request.
- `public/` still contains the default Next.js SVG assets (`next.svg`, `vercel.svg`, `window.svg`, `globe.svg`, `file.svg`). These are dead assets and should be removed.
