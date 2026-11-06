"use client";

import React from "react";

export function AppSoftBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Base soothing clean background */}
      <div className="absolute inset-0 bg-[#f8fafc] dark:bg-slate-950" />

      {/* Soft ambient lighting orbs - subtle, gentle, no harsh lines or busy waves */}
      <div
        className="absolute -top-32 -left-32 w-96 sm:w-[36rem] h-96 sm:h-[36rem] rounded-full bg-blue-400/8 dark:bg-blue-600/10 blur-3xl"
      />
      <div
        className="absolute top-1/3 -right-32 w-96 sm:w-[40rem] h-96 sm:h-[40rem] rounded-full bg-indigo-400/6 dark:bg-indigo-600/10 blur-3xl"
      />
      <div
        className="absolute -bottom-32 left-1/4 w-96 sm:w-[32rem] h-96 sm:h-[32rem] rounded-full bg-sky-300/8 dark:bg-sky-500/10 blur-3xl"
      />

      {/* Subtle top subtle edge gradient */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-50/40 via-transparent to-transparent dark:from-blue-950/20" />
    </div>
  );
}

