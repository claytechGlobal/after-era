export default function LegalPage() {
  return (
    <>
      <div className="bg-stone py-14 text-center">
        <h1 className="font-head font-extrabold text-3xl tracking-tr1 uppercase">Terms & Policies</h1>
      </div>
      <div className="max-w-3xl mx-auto px-5 py-14 space-y-12">
        <section id="tos">
          <h2 className="font-head font-extrabold text-2xl mb-4">Terms of Service</h2>
          <p className="text-ink/75 leading-relaxed mb-3">
            A.F.T.E.R. ERA operates at after-era.com and sells made-to-order clothing and accessories, produced through a print-on-demand partner. Placing an order is an offer to purchase which we may accept or decline.
          </p>
          <p className="text-ink/75 leading-relaxed">
            All prices are listed in USD. Future payments will be processed securely by Stripe. Card details are never stored on A.F.T.E.R. ERA servers.
          </p>
        </section>
        <section id="privacy">
          <h2 className="font-head font-extrabold text-2xl mb-4">Privacy Policy</h2>
          <p className="text-ink/75 leading-relaxed">
            We collect order and contact information to fulfill purchases, provide support, and send transactional emails. Payment data is handled by Stripe. We never sell your personal information.
          </p>
        </section>
        <section id="refunds">
          <h2 className="font-head font-extrabold text-2xl mb-4">Refund & Return Policy</h2>
          <p className="text-ink/75 leading-relaxed mb-3">
            Eligible: damaged, defective, wrong item, or print error. Contact support@after-era.com within 14 days of delivery with your order number and a photo.
          </p>
          <p className="text-ink/75 leading-relaxed">
            Not eligible: buyer&apos;s remorse or incorrect size selection, because items are made to order.
          </p>
        </section>
        <section id="shipping">
          <h2 className="font-head font-extrabold text-2xl mb-4">Shipping Policy</h2>
          <p className="text-ink/75 leading-relaxed">
            Production: 2–7 business days. Standard shipping: 3–8 business days after production. Free shipping on U.S. orders over $75; otherwise a flat $6.95. We currently ship within the United States and Canada.
          </p>
        </section>
        <section id="payments">
          <h2 className="font-head font-extrabold text-2xl mb-4">Payment Security</h2>
          <p className="text-ink/75 leading-relaxed">
            Payments will be processed by Stripe (PCI-DSS Level 1). Card details are entered directly into Stripe and are never stored on our servers.
          </p>
        </section>
        <section>
          <h2 className="font-head font-extrabold text-2xl mb-4">Contact</h2>
          <p className="text-ink/75">A.F.T.E.R. ERA · support@after-era.com · Monday–Friday, 9am–5pm</p>
        </section>
      </div>
    </>
  );
}
