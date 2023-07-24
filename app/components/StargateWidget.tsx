import React, { useMemo } from "react";

function StargateWidget() {
  return (
    <div className="max-w-[400px]">
      <style jsx global>{`
        .MuiScopedCssBaseline-root {
          background-color: transparent !important;
        }
      `}</style>
      {/* @ts-ignore */}
      <script
        src="https://unpkg.com/@layerzerolabs/stargate-ui@latest/element.js"
        defer
        async
      ></script>
      {/* @ts-ignore */}
      <stargate-widget theme="dark" partnerId="0x0017" />
    </div>
  );
}

export default StargateWidget;
