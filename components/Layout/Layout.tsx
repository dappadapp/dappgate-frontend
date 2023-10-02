import React, { PropsWithChildren } from "react";

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  return <main className="flex flex-col relative flex-1 max-w-[1280px]">{children}</main>;
};

export default Layout;
