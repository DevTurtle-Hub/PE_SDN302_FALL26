"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded text-sm">PE</span>
          <span>SDN302 Exam</span>
        </Link>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span data-testid="user-email" className="text-sm text-muted-foreground font-mono">
                {user.email}
              </span>
              <Button
                variant="outline"
                size="sm"
                data-testid="btn-logout"
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" data-testid="btn-login">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" data-testid="btn-register">
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
