"use client";

import { useState } from "react";

export function ContactForm() {
  const [ok, setOk] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form).entries());
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    setOk(true);
    form.reset();
  }
  return (
    <form onSubmit={onSubmit} className="border-t border-line pt-8 flex flex-col gap-3 max-w-md">
      <input required name="name" placeholder="Name" className="border border-line px-4 py-3 text-sm" />
      <input required type="email" name="email" placeholder="Email" className="border border-line px-4 py-3 text-sm" />
      <textarea required name="message" placeholder="Message" rows={4} className="border border-line px-4 py-3 text-sm" />
      <button className="btn btn-primary self-start">Send message</button>
      {ok ? <p className="text-sm text-gold-deep">Message received. We&apos;ll reply within 1–2 business days.</p> : null}
    </form>
  );
}
