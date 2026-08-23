"use client";

import { SECTION_TYPES, itemsHint } from "@/lib/section-items";
import { useState } from "react";

type Props = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    id?: string;
    type: string;
    title: string;
    subtitle: string;
    body: string;
    itemsText: string;
    visible: boolean;
  };
  submitLabel: string;
};

export function SectionForm({ action, defaultValues, submitLabel }: Props) {
  const [type, setType] = useState(defaultValues?.type ?? "custom");

  return (
    <form action={action} className="max-w-2xl space-y-5">
      {defaultValues?.id ? (
        <input type="hidden" name="id" value={defaultValues.id} />
      ) : null}

      <label className="block space-y-2 text-sm">
        <span className="text-zinc-400">Type</span>
        <select
          name="type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100"
        >
          {SECTION_TYPES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2 text-sm">
        <span className="text-zinc-400">Title</span>
        <input
          name="title"
          required
          defaultValue={defaultValues?.title ?? ""}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="text-zinc-400">Subtitle</span>
        <input
          name="subtitle"
          defaultValue={defaultValues?.subtitle ?? ""}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="text-zinc-400">Body</span>
        <textarea
          name="body"
          rows={6}
          defaultValue={defaultValues?.body ?? ""}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-zinc-100"
        />
      </label>

      <label className="block space-y-2 text-sm">
        <span className="text-zinc-400">Items</span>
        <textarea
          name="items"
          rows={6}
          defaultValue={defaultValues?.itemsText ?? ""}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100"
        />
        <span className="text-xs text-zinc-500">{itemsHint(type)}</span>
      </label>

      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={defaultValues?.visible ?? true}
        />
        Visible on the public site
      </label>

      <button
        type="submit"
        className="rounded-lg bg-emerald-400 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-300"
      >
        {submitLabel}
      </button>
    </form>
  );
}
