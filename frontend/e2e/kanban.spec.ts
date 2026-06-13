import { expect, test } from "@playwright/test";

test("loads with dummy data showing 5 columns and cards", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Project Board" })).toBeVisible();
  await expect(page.getByTestId("kanban-board")).toBeVisible();
  await expect(page.getByTestId("column-col-backlog")).toBeVisible();
  await expect(page.getByTestId("column-col-ready")).toBeVisible();
  await expect(page.getByTestId("column-col-in-progress")).toBeVisible();
  await expect(page.getByTestId("column-col-review")).toBeVisible();
  await expect(page.getByTestId("column-col-done")).toBeVisible();
  await expect(page.getByText("Research competitors")).toBeVisible();
});

test("renames a column", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("column-title-col-backlog").click();
  const input = page.getByTestId("column-title-input-col-backlog");
  await input.fill("Ideas");
  await input.press("Enter");

  await expect(page.getByTestId("column-title-col-backlog")).toHaveText(/Ideas/);
});

test("adds a card to a column", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("add-card-button-col-review").click();
  await page.getByPlaceholder("Title").fill("E2E test card");
  await page.getByPlaceholder("Details (optional)").fill("Added by Playwright");
  await page
    .getByTestId("add-card-form")
    .getByRole("button", { name: "Add card" })
    .click();

  await expect(page.getByText("E2E test card")).toBeVisible();
  await expect(page.getByText("Added by Playwright")).toBeVisible();
});

test("deletes a card", async ({ page }) => {
  await page.goto("/");

  const card = page.getByTestId("card-card-1");
  await expect(card).toBeVisible();
  await card.getByRole("button", { name: "Delete Research competitors" }).click();

  await expect(page.getByText("Research competitors")).not.toBeVisible();
});

test("drags a card to another column", async ({ page }) => {
  await page.goto("/");

  const card = page.getByTestId("card-card-2");
  const destColumn = page.getByTestId("column-col-done");

  await expect(card).toBeVisible();

  const cardTitle = card.getByText("Define color palette");
  const cardBox = await cardTitle.boundingBox();
  const destBox = await destColumn.boundingBox();

  if (!cardBox || !destBox) {
    throw new Error("Could not resolve drag target bounding boxes");
  }

  const startX = cardBox.x + cardBox.width / 2;
  const startY = cardBox.y + cardBox.height / 2;
  const endX = destBox.x + destBox.width / 2;
  const endY = destBox.y + destBox.height / 2;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 10, startY + 10, { steps: 5 });
  await page.mouse.move(endX, endY, { steps: 20 });
  await page.mouse.up();

  await expect(destColumn.getByText("Define color palette")).toBeVisible();
});
