"use client";
import Link from "next/link";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";

type Props = {
  duration: number;
};

export default function CTASection({ duration }: Props) {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {!isAuthenticated && (
        <section className="bg-natours px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center text-white">
            <h2 className="text-3xl font-bold sm:text-4xl">
              What are you waiting for?
            </h2>
            <p className="text-lg opacity-95">
              {duration} days. 1 adventure. Infinite memories. Make it yours
              today!
            </p>
            <Link
              href="/login"
              className="rounded-lg bg-white px-8 py-3 font-semibold text-natours transition-colors hover:bg-gray-100"
            >
              Log in to book tour
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
