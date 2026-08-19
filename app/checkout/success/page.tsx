import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="max-w-xl mx-auto px-5 py-24 text-center">
      <p className="text-[11px] tracking-tr2 uppercase text-gold-deep font-head font-semibold mb-4">Order received</p>
      <h1 className="font-head font-extrabold text-3xl mb-4">Thank you</h1>
      <p className="text-ink/70 mb-8">
        Payment confirmation is verified on the server. When Stripe is connected, this page will only mean a real paid order.
      </p>
      <Link href="/shop" className="btn btn-primary">Continue shopping</Link>
    </div>
  );
}
