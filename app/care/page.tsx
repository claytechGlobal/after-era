import { ContactForm } from "@/components/ContactForm";
import Link from "next/link";

export default function CarePage() {
  return (
    <>
      <div className="bg-stone py-14 text-center">
        <h1 className="font-head font-extrabold text-3xl tracking-tr1 uppercase">Customer Care</h1>
        <p className="text-sm text-ink/55 mt-2">Terms, shipping, returns, and how to reach us.</p>
      </div>
      <div className="max-w-3xl mx-auto px-5 py-14">
        <h2 className="font-head font-bold text-xl tracking-tr1 uppercase mb-3">Shipping & returns</h2>
        <p className="text-ink/75 leading-relaxed mb-3">
          Each item is made to order — please allow 2–7 business days for production, then 3–8 business days for delivery. You&apos;ll receive tracking by email once your order ships.
        </p>
        <p className="text-ink/75 leading-relaxed mb-10">
          We accept returns or exchanges only for defective items, print errors, or an incorrect item received — contact us within 14 days of delivery with your order number and a photo.
        </p>
        <h2 className="font-head font-bold text-xl tracking-tr1 uppercase mb-3">Contact us</h2>
        <div className="text-ink/75 space-y-1 mb-10">
          <p>Email: support@after-era.com</p>
          <p>Response time: within 1–2 business days</p>
          <p>Hours: Monday–Friday, 9am–5pm</p>
        </div>
        <ContactForm />
        <p className="text-sm text-ink/50 mt-10">
          Looking for the full legal text? Read our{" "}
          <Link href="/legal" className="underline text-gold-deep">Terms & Policies</Link>.
        </p>
      </div>
    </>
  );
}
