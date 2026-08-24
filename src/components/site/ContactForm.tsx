"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(data.get("name") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
      }),
    });
    if (!response.ok) {
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("sent");
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-4">
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-cyan-500/80">
          Name
        </span>
        <input
          name="name"
          required
          maxLength={120}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-50 outline-none focus:border-cyan-300/50"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-cyan-500/80">
          Email
        </span>
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-50 outline-none focus:border-cyan-300/50"
        />
      </label>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.16em] text-cyan-500/80">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={4000}
          className="mt-1 w-full rounded-xl border border-cyan-400/20 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-50 outline-none focus:border-cyan-300/50"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="gradient-cta inline-flex rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "sent" ? (
        <p className="text-sm text-cyan-200/70">Sent. Ali can read it in admin.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-300/80">Could not send. Try again.</p>
      ) : null}
    </form>
  );
}
