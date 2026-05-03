import { Skeleton, SkeletonText } from "@/components/ui";

export default function GrammarDetailLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Skeleton className="h-5 w-32" />
      <div className="p-6 lg:p-8 bg-white border border-line rounded-3xl space-y-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-3/4" />
        <SkeletonText lines={2} />
      </div>
      <div className="p-5 bg-white border border-line rounded-3xl">
        <SkeletonText lines={5} />
      </div>
      <div className="p-5 bg-white border border-line rounded-3xl">
        <SkeletonText lines={4} />
      </div>
    </div>
  );
}
