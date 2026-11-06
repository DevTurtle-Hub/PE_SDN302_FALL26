import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-5xl py-16 px-4 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1
          data-testid="home-title"
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
        >
          SDN302 Practical Exam
        </h1>
        <p className="text-lg text-muted-foreground">
          Fullstack Web Application powered by Next.js 16 App Router, TypeScript, Tailwind CSS, ShadCN UI, Prisma ORM, and Supabase PostgreSQL.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/register">
            <Button size="lg" data-testid="btn-hero-register">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" data-testid="btn-hero-login">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Card className="p-6">
          <CardHeader className="p-0 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              1
            </div>
            <CardTitle className="text-xl">Authentication</CardTitle>
            <CardDescription className="text-sm">
              Secure authentication with bcrypt password hashing and HTTP-only JWT session cookies.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              2
            </div>
            <CardTitle className="text-xl">Clean Architecture</CardTitle>
            <CardDescription className="text-sm">
              Standard RESTful API endpoints, strict HTTP status codes, and modular service layers.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              3
            </div>
            <CardTitle className="text-xl">Cloud Database</CardTitle>
            <CardDescription className="text-sm">
              Powered by Supabase PostgreSQL and Prisma ORM with automated migrations.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
