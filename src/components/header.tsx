"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-blue-200/90 dark:border-blue-900/80 bg-gradient-to-r from-blue-100/80 via-sky-50/90 to-blue-100/70 dark:from-slate-900 dark:via-blue-950/60 dark:to-slate-900 backdrop-blur-md shadow-md shadow-blue-500/10">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 group-hover:bg-blue-700 transition-all">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-blue-950 dark:text-blue-50 font-black text-xl tracking-tight group-hover:text-blue-600 transition-colors">
            ReadLog
          </span>
        </Link>

        <nav className="flex items-center gap-2.5 sm:gap-3">
          {user ? (
            <>
              <Link
                href="/reading-logs"
                data-testid="link-reading-logs"
                className="text-sm font-bold text-blue-700 hover:text-white bg-blue-600/10 hover:bg-blue-600 border border-blue-200/80 hover:border-blue-600 dark:text-blue-300 dark:hover:text-white dark:bg-blue-950/60 dark:border-blue-800 transition-all px-3.5 py-1.5 rounded-xl shadow-xs"
              >
                Reading Logs
              </Link>
              <span
                data-testid="user-email"
                className="text-xs sm:text-sm text-blue-950 dark:text-blue-200 font-mono bg-white/90 dark:bg-slate-900/90 border border-blue-200 dark:border-blue-800/80 px-3 py-1.5 rounded-xl font-semibold shadow-xs"
              >
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                data-testid="btn-logout"
                onClick={logout}
                className="rounded-xl border-blue-200 bg-white/90 hover:bg-red-50 hover:text-red-600 hover:border-red-300 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-red-950/50 dark:hover:text-red-400 dark:text-slate-200 font-bold transition-all shadow-xs"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid="btn-login"
                  className="rounded-xl font-bold text-blue-900 hover:text-blue-600 hover:bg-white/80 dark:text-slate-200"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  data-testid="btn-register"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/30 font-bold transition-all px-4"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
