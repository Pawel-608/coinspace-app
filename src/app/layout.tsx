import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const inter = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Coinspace Wallet",
  description: "Your mobile Solana wallet inside Telegram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-stone-100"}>
        <div className="flex flex-row	w-screen justify-center">
          <div className="flex flex-row	w-screen justify-center max-w-[768px]">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
