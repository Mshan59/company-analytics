"use client";

import React from "react";

const Loader: React.FC<{ fullscreen?: boolean }>= ({ fullscreen = true }) => {
  return (
    <div className={fullscreen ? "fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-sm" : "flex items-center justify-center p-4"}>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
    </div>
  );
};

export default Loader;
