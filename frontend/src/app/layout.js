import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CleanSync - Cleaning Service Management",
  description: "Manage your cleaning services efficiently.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
