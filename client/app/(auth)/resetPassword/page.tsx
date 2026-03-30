import Link from "next/link";

export default function ResetPasswordLandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-12rem)]">
      <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Reset password
          </h1>
          <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            Open the link from your password reset email. It looks like:{" "}
            <span className="font-mono text-xs text-gray-500 dark:text-gray-500">
              /resetPassword/your-token
            </span>
          </p>
          <Link
            href="/forgotPassword"
            className="inline-flex w-full items-center justify-center rounded-lg bg-natours py-3 font-semibold text-white transition-colors hover:bg-natours-dark"
          >
            Request a new email
          </Link>
          <p className="mt-4 text-center">
            <Link
              href="/login"
              className="text-sm text-gray-500 hover:text-natours dark:text-gray-400 dark:hover:text-natours"
            >
              ← Back to log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
