"use client";

import {
  getMe,
  getUserImageUrl,
  updateMe,
  updateProfilePicture,
} from "@/lib/auth";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContextProvider/contextProvider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProfileSection() {
  const { user, setUser } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setPhotoFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setError("");
    const form = e.currentTarget;
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const name = nameInput?.value?.trim() ?? "";

    if (!photoFile && name === user.name) {
      setError("Change your name or choose a new photo before saving.");
      return;
    }

    setIsLoading(true);
    try {
      if (name && name !== user.name) {
        await updateMe({ name });
      }
      if (photoFile) {
        await updateProfilePicture(photoFile);
      }
      const { user: fresh } = await getMe();
      if (fresh) setUser(fresh);
      setPhotoFile(null);
      setPreview(null);
      const fileInput = form.elements.namedItem(
        "profile-photo",
      ) as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sign in to edit your profile.
        </p>
      </section>
    );
  }

  const avatarSrc = preview ?? getUserImageUrl(user.photo);
  const avatarAlt = preview ? "New photo preview" : user.name;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-8">
      <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Your profile
      </h2>
      <form
        key={`${user._id}-${user.name}-${user.photo ?? ""}`}
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex shrink-0 flex-col items-center gap-3 sm:items-start">
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-2 ring-gray-200 dark:ring-gray-600">
              <Image
                src={avatarSrc}
                alt={avatarAlt}
                fill
                className="object-cover"
                sizes="96px"
                unoptimized={!!preview}
              />
            </div>
            <div>
              <label
                htmlFor="profile-photo"
                className="cursor-pointer text-sm font-medium text-natours underline-offset-2 hover:underline"
              >
                Choose new photo
              </label>
              <input
                id="profile-photo"
                name="profile-photo"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Signed in as{" "}
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {user.email}
              </span>
            </p>
            <div>
              <label
                htmlFor="settings-name"
                className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Name
              </label>
              <input
                id="settings-name"
                type="text"
                name="name"
                defaultValue={user.name}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-natours focus:outline-none focus:ring-1 focus:ring-natours dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 rounded-lg bg-natours px-6 py-2.5 font-semibold text-white transition-colors hover:bg-natours-dark disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" variant="light" />
              Saving…
            </>
          ) : (
            "Save settings"
          )}
        </button>
      </form>
    </section>
  );
}
