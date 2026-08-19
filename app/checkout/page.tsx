import { CheckoutForm } from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <h1 className="font-display font-semibold text-5xl mb-10">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
