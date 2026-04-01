"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import { useToast } from "@/components/TheContextProvider/ToastProvider";
import { createBooking } from "@/lib/bookings";
import {
  ConfirmModal,
  type ConfirmModalHandle,
} from "@/components/ui/ConfirmModal";

type Props = {
  tourId: string;
  tourName: string;
  price: number;
  variant?: "hero" | "card";
};

export default function BookTourButton({
  tourId,
  tourName,
  price,
  variant = "hero",
}: Props) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const modalRef = useRef<ConfirmModalHandle>(null);

  function openConfirm() {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/tours/${encodeURIComponent(tourId)}`);
      return;
    }
    modalRef.current?.open();
  }

  async function handleConfirm() {
    try {
      await createBooking(tourId);
      showToast("Booking confirmed! See My bookings.", 4000);
      router.push("/me/mybookings");
      router.refresh();
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Could not complete booking",
        5000,
      );
      throw e;
    }
  }

  const triggerClass =
    variant === "card"
      ? "inline-flex min-h-11 flex-1 min-w-0 items-center justify-center rounded-lg py-3 text-center text-sm font-semibold shadow-sm"
      : "w-full rounded-xl py-3.5 text-center text-base shadow-md";

  return (
    <>
      <button
        type="button"
        onClick={openConfirm}
        className={`${triggerClass} bg-natours text-white transition-colors hover:bg-natours-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-natours focus-visible:ring-offset-2 disabled:opacity-70 dark:ring-offset-gray-800`}
      >
        Book now
      </button>

      <ConfirmModal
        ref={modalRef}
        title="Confirm your booking"
        description={
          <>
            You are about to reserve a spot on this tour. You can manage
            bookings under My account.
          </>
        }
        confirmLabel="Confirm booking"
        pendingConfirmLabel="Booking…"
        confirmVariant="primary"
        onConfirm={handleConfirm}
      >
        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3 dark:border-gray-700 dark:bg-gray-900/50">
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {tourName}
          </p>
          <p className="mt-1 text-sm tabular-nums text-gray-600 dark:text-gray-400">
            <span className="font-medium text-natours">${price}</span> per person
          </p>
        </div>
      </ConfirmModal>
    </>
  );
}
