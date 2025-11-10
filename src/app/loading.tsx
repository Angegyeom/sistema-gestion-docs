import { Skeleton } from "@/components/ui/skeleton";
import {
  GaugeCircle,
  LayoutDashboard,
  Lightbulb,
  TrendingUp,
  SlidersHorizontal,
  Code2,
  Bell,
} from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="hidden h-screen w-64 flex-col border-r bg-sidebar p-4 text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2">
          <GaugeCircle className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold">OptimoSystem</h1>
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
          <Skeleton className="h-9 w-full rounded-md" />
        </nav>
        <div className="mt-auto">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </div>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 md:hidden" />
            <Skeleton className="h-6 w-48 rounded-md" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl md:col-span-2" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </main>
      </div>
    </div>
  );
}
