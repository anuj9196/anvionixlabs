import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap py-28 md:py-40">
      <p className="label">Result · 404</p>
      <h1 className="serif mt-4 text-6xl md:text-8xl">
        No such page <em>in this notebook.</em>
      </h1>
      <p className="mt-6">
        <Link href="/" className="underline hover:text-accent">
          Back to the contents →
        </Link>
      </p>
    </section>
  );
}
