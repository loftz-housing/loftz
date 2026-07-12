import { Skeleton, CardGridSkeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div>
      <div className="border-b border-line bg-surface">
        <div className="container-page py-12">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-3 h-9 w-80 max-w-full" />
          <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        </div>
      </div>
      <div className="container-page py-10">
        <Skeleton className="aspect-[16/7] w-full rounded-2xl" />
        <div className="mt-10">
          <Skeleton className="h-6 w-56" />
          <div className="mt-5">
            <CardGridSkeleton count={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
