import { Skeleton, SkeletonText } from "@/components/ui";

export default function WordDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-5 w-32" />
      <div className="p-6 lg:p-8 bg-white border border-line rounded-3xl space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-14" />
        </div>
        <Skeleton className="h-12 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="p-5 bg-white border border-line rounded-3xl">
          <SkeletonText lines={3} />
        </div>
        <div className="p-5 bg-white border border-line rounded-3xl">
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  );
}
