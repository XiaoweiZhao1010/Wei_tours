import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { cookies } from "next/headers";
import { AuthProvider } from "@/components/AuthContextProvider/contextProvider";
import { ThemeProvider } from "@/components/TheContextProvider/ThemeProvider";
import { ToastProvider } from "@/components/TheContextProvider/ToastProvider";

export const metadata: Metadata = {
  title: "Wei_tours",
  description: "Never stop exploring",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("jwt")?.value;
  let user = null;
  if (cookie) {
    const apiOrigin = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    try {
      const res = await fetch(`${apiOrigin}/api/v1/users/me`, {
        headers: { Cookie: `jwt=${cookie}` },
      });
      if (res.ok) {
        const data = await res.json();
        user = data.data?.user ?? null;
      }
    } catch {
      user = null;
    }
  }
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="min-h-screen bg-linear-to-br from-emerald-50 via-green-50/50 to-natours/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('wei_tours_theme');
                  var dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.toggle('dark', dark);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-transparent text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider user={user}>
              <div className="grid min-h-dvh w-full grid-rows-[auto_1fr_auto]">
                <Header />
                <main className="min-h-0 dark:bg-gray-400">{children}</main>
                <Footer />
              </div>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
