import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TweetSkeleton() {
    return (
        <Card className="border-neutral-200/70 bg-white/95 px-4 py-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-24 rounded" />
                    <Skeleton className="h-3 w-32 rounded" />
                </div>
            </div>
            <div className="space-y-2">
                <Skeleton className="h-3 w-full rounded" />
                <Skeleton className="h-3 w-5/6 rounded" />
            </div>
            <div className="mt-3 flex gap-2">
                <Skeleton className="h-6 w-10 rounded-full" />
            </div>
        </Card>
    );
}
