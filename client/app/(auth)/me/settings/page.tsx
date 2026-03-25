import PasswordSection from "./PasswordSection";
import ProfileSection from "@/app/(auth)/me/settings/ProfileSection";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-10 px-4 py-0 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-3xl">
        Account settings
      </h1>
      <ProfileSection />
      <PasswordSection />
    </div>
  );
}
