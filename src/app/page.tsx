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
          ExpenseTrail
        </h1>
        <p className="text-lg text-muted-foreground">
          Track your personal expenses, organize spending by categories, highlight important items with stars, and view real-time breakdown summaries.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link href="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Feature cards (At least 3 required) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <Card className="p-6">
          <CardHeader className="p-0 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              1
            </div>
            <CardTitle className="text-xl">Track spending</CardTitle>
            <CardDescription className="text-sm">
              Record daily expenses with dates, notes, and amounts accurately formatted to two decimal places.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              2
            </div>
            <CardTitle className="text-xl">Sort into categories</CardTitle>
            <CardDescription className="text-sm">
              Organize into Food, Transport, Bills, Shopping, and Other to keep your budget clean and searchable.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 space-y-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
              3
            </div>
            <CardTitle className="text-xl">See where it goes</CardTitle>
            <CardDescription className="text-sm">
              Instant summary counts, starred expenses, total expenditures, and dynamic category breakdowns.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
