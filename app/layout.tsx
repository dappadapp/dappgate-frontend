import "./globals.scss";
import { Outfit } from "next/font/google";
import Layout from "@/components/Layout/Layout";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Providers from "./Providers";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "@/components/Footer/Footer";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "DappGate - SuperApp",
  description: "DappGate is the ultimate super app for blockchain enthusiasts and newcomers alike. Explore a world of possibilities with features like our Leaderboard, where you can compete and earn rewards by minting tokens and bridging assets. Connect with a vibrant blockchain community in our Social Hub, and complete Unchain Tasks to earn XP. Whether you're a crypto pro or just starting your journey, DappGate is your gateway to the decentralized future.",
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
          <div className="flex flex-col p-3 lg:p-8 w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  );
}
