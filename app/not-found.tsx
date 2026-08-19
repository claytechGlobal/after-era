import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center px-5">
      <h1 className="font-head font-extrabold text-3xl mb-4">Page not found</h1>
      <Link href="/" className="btn btn-primary">Back home</Link>
    </div>
  );
}
