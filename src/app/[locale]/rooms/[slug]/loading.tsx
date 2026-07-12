import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="container-page py-8 md:py-12">
      <Skeleton className="h-4 w-32" />
      <div className="mt-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-9 w-72 max-w-full" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      {/* Gallery */}
      <div className="mt-8 grid gap-2 sm:grid-cols-4">
        <Skeleton className="aspect-[16/9] sm:col-span-4" />
        <Skeleton className="aspect-[4/3]" />
        <Skeleton className="aspect-[4/3]" />
        <Skeleton className="aspect-[4/3]" />
        <Skeleton className="aspect-[4/3]" />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </div>
  );
}
