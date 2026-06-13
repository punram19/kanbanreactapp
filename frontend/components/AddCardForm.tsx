"use client";

import { FormEvent, useState } from "react";

type AddCardFormProps = {
  onSubmit: (title: string, details: string) => void;
  onCancel: () => void;
};

export function AddCardForm({ onSubmit, onCancel }: AddCardFormProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    onSubmit(trimmedTitle, details.trim());
    setTitle("");
    setDetails("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
      data-testid="add-card-form"
    >
      <label className="sr-only" htmlFor="card-title">
        Card title
      </label>
      <input
        id="card-title"
        type="text"
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="mb-2 w-full rounded border border-slate-200 px-3 py-2 text-sm text-[var(--dark-navy)] outline-none focus:border-[var(--blue-primary)] focus:ring-2 focus:ring-[var(--blue-primary)]/20"
        autoFocus
      />
      <label className="sr-only" htmlFor="card-details">
        Card details
      </label>
      <textarea
        id="card-details"
        placeholder="Details (optional)"
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        rows={3}
        className="mb-3 w-full resize-none rounded border border-slate-200 px-3 py-2 text-sm text-[var(--gray-text)] outline-none focus:border-[var(--blue-primary)] focus:ring-2 focus:ring-[var(--blue-primary)]/20"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded bg-[var(--purple-secondary)] px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          Add card
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded px-3 py-1.5 text-sm font-medium text-[var(--blue-primary)] transition hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
