import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/lib/auth";
import { ExamStoreProvider } from "@/lib/exam-store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExamCraft - Create and Manage Exams",
  description: "Professional exam creation and management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          // defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <ExamStoreProvider>{children}</ExamStoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
