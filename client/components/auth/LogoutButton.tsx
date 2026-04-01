"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import { useToast } from "@/components/TheContextProvider/ToastProvider";
import { logout } from "@/lib/auth";
import {
  ConfirmModal,
  type ConfirmModalHandle,
} from "@/components/ui/ConfirmModal";

type Props = {
  variant?: "solid" | "link";
  /** Open the dialog on mount (e.g. visiting /logout) */
  autoOpen?: boolean;
  /** When autoOpen, only the dialog is used (no visible Log out button) */
  hideTrigger?: boolean;
};

export default function LogoutButton({
  variant = "solid",
  autoOpen = false,
  hideTrigger = false,
}: Props) {
  const modalRef = useRef<ConfirmModalHandle>(null);
  const router = useRouter();
  const { setUser } = useAuth();
  const { showToast } = useToast();

  const autoOpened = useRef(false);
  useEffect(() => {
    if (autoOpen && !autoOpened.current) {
      autoOpened.current = true;
      modalRef.current?.open();
    }
  }, [autoOpen]);

  async function handleConfirm() {
    setUser(null);
    router.push("/");
    router.refresh();
    try {
      await logout();
    } catch {
      showToast(
        "Could not reach the server to log out. You were signed out in the app.",
        5000,
      );
    }
  }

  return (
    <>
      {!hideTrigger && (
        <button
          type="button"
          onClick={() => modalRef.current?.open()}
          className={
            variant === "link"
              ? "text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              : "rounded-lg bg-natours px-4 py-2 font-semibold text-white transition-colors hover:bg-natours-dark"
          }
        >
          Log out
        </button>
      )}
      <ConfirmModal
        ref={modalRef}
        title="Log out?"
        description="You will need to sign in again to book tours or view your account."
        confirmLabel="Log out"
        pendingConfirmLabel="Logging out…"
        confirmVariant="danger"
        onConfirm={handleConfirm}
        onDismiss={autoOpen ? () => router.push("/") : undefined}
      />
    </>
  );
}
