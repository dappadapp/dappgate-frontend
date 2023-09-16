import React, { useEffect, useMemo, useState } from "react";
import stargateLogo from "@/assets/images/stargate.svg";
import Image from "next/image";
function StargateWidget() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <>
      {loading && (
        <div className="py-6 px-10">
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-20 h-20 animate-spin"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[600px] mt-8 relative flex-col flex
    `}
      >
        <style jsx global>{`
          .MuiScopedCssBaseline-root {
            background-color: transparent !important;
          }
          ${loading
            ? ".MuiScopedCssBaseline-root{display:none;}"
            : ".MuiScopedCssBaseline-root{display:block;}"}
        `}</style>
        {/* @ts-ignore */}
        <script
          src="https://unpkg.com/@layerzerolabs/stargate-ui@latest/element.js"
          defer
          async
        ></script>
        {/* @ts-ignore */}
        <stargate-widget theme="dark" partnerId="0x0017" feeCollector="0x3772f434d796A1B974E9B2cD37055a075F3450be" tenthBps="100" />
        {loading ? null : (
          <div className="absolute bottom-32 self-center opacity-30 flex items-center gap-2">
            Powered by Stargate
            <Image
              src={stargateLogo}
              alt="stg-logo"
              width={40}
              height={40}
              className="w-6 h-6 "
            />
          </div>
        )}
      </div>
    </>
  );
}

export default StargateWidget;
