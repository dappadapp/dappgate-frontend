import Providers from "./Providers";
import "./globals.scss";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./provider";
import Script from "next/script";
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
        <Script
         id="google-analytics"
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=G-7KXLVFJGFD`}
        />
        <Script strategy="lazyOnload"  id="google-analytics">
          {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-7KXLVFJGFD', {
                    page_path: window.location.pathname,
                    });
        `}
        </Script>
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <Providers>{children}</Providers>
        </NextAuthProvider>
      </body>
    </html>
  );
}
