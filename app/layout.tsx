import Providers from "./Providers";
import "./globals.scss";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./provider"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DappGate",
  description: "NFT mint & bridge with LayerZero",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async={true}
          src="https://www.bugherd.com/sidebarv2.js?apikey=nxxbdfcqnjekctcasqbxqg"
        />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
        <Providers>{children}</Providers>
        </NextAuthProvider>
      </body>
    </html>
  );
}
