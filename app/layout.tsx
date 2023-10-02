import "./globals.scss";
import { Outfit } from "next/font/google";
import Layout from "@/components/Layout/Layout";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Providers from "./Providers";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "DropBase",
  description: "Airdrop App",
};

export default function RootLayout({
  cookies,
  children,
}: {
  cookies: RequestCookie[];
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col md:flex-row items-start bg-[#0C0C0C] relative ${outfit.className}`}
      >
        <Providers>
          <Sidebar />
          <div className="flex flex-col p-8 w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
