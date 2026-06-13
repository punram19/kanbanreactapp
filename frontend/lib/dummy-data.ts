import type { Board } from "./types";

export const initialBoard: Board = {
  columns: [
    { id: "col-backlog", title: "Backlog", cardIds: ["card-1", "card-2", "card-3"] },
    { id: "col-ready", title: "Ready", cardIds: ["card-4", "card-5"] },
    { id: "col-in-progress", title: "In Progress", cardIds: ["card-6", "card-7"] },
    { id: "col-review", title: "Review", cardIds: ["card-8"] },
    { id: "col-done", title: "Done", cardIds: ["card-9", "card-10"] },
  ],
  cards: {
    "card-1": {
      id: "card-1",
      title: "Research competitors",
      details: "Review top 5 Kanban tools and note standout UX patterns.",
    },
    "card-2": {
      id: "card-2",
      title: "Define color palette",
      details: "Finalize accent, primary, and secondary colors for the board.",
    },
    "card-3": {
      id: "card-3",
      title: "Draft user stories",
      details: "Write stories for add card, delete card, and drag-and-drop.",
    },
    "card-4": {
      id: "card-4",
      title: "Set up project scaffold",
      details: "Initialize Next.js app with Tailwind and testing tools.",
    },
    "card-5": {
      id: "card-5",
      title: "Design column layout",
      details: "Horizontal scroll board with fixed-width columns.",
    },
    "card-6": {
      id: "card-6",
      title: "Build card component",
      details: "Title, details, delete button with hover states.",
    },
    "card-7": {
      id: "card-7",
      title: "Implement drag and drop",
      details: "Use dnd-kit for within-column and cross-column moves.",
    },
    "card-8": {
      id: "card-8",
      title: "Write unit tests",
      details: "Cover board actions and key component interactions.",
    },
    "card-9": {
      id: "card-9",
      title: "Add dummy data",
      details: "Populate board with realistic sample cards on load.",
    },
    "card-10": {
      id: "card-10",
      title: "Polish UI",
      details: "Refine spacing, typography, and focus states.",
    },
  },
};
