"use client";

import {
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ConfirmModalHandle = {
  open: () => void;
  close: () => void;
};

export type ConfirmModalProps = {
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Shown on the confirm button while `onConfirm` is running */
  pendingConfirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  onConfirm: () => void | Promise<void>;
  /** Invoked when the dialog closes without a successful confirm (cancel, escape, backdrop) */
  onDismiss?: () => void;
};

export const ConfirmModal = forwardRef<ConfirmModalHandle, ConfirmModalProps>(
  function ConfirmModal(
    {
      title,
      description,
      children,
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      pendingConfirmLabel = "Working…",
      confirmVariant = "primary",
      onConfirm,
      onDismiss,
    },
    ref,
  ) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const closedAfterConfirmRef = useRef(false);
    const [pending, setPending] = useState(false);
    const titleId = useId();

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: safeClose,
    }));

    function safeClose() {
      dialogRef.current?.close();
    }

    function handleBackdropOrDismissClose() {
      if (!pending) safeClose();
    }

    async function handleConfirm() {
      setPending(true);
      try {
        await onConfirm();
        closedAfterConfirmRef.current = true;
        safeClose();
      } finally {
        setPending(false);
      }
    }

    function handleDialogClose() {
      if (closedAfterConfirmRef.current) {
        closedAfterConfirmRef.current = false;
        return;
      }
      onDismiss?.();
    }

    const confirmBtnClass =
      confirmVariant === "danger"
        ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
        : "bg-natours hover:bg-natours-dark focus-visible:ring-natours";

    return (
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="fixed left-1/2 top-1/2 z-200 max-h-[90vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-0 text-gray-900 shadow-xl open:m-0 backdrop:bg-black/80 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        onClick={(e) => {
          if (e.target === dialogRef.current) handleBackdropOrDismissClose();
        }}
        onClose={handleDialogClose}
      >
        <div className="p-6 sm:p-8">
          <h2
            id={titleId}
            className="text-xl font-bold text-gray-900 dark:text-gray-100"
          >
            {title}
          </h2>
          {description ? (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </div>
          ) : null}
          {children}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={pending}
              onClick={handleBackdropOrDismissClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-white/5"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => void handleConfirm()}
              className={`rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-70 dark:ring-offset-gray-800 ${confirmBtnClass}`}
            >
              {pending ? pendingConfirmLabel : confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    );
  },
);
