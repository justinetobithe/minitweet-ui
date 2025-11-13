import { useForm } from "react-hook-form";
import { useCreateTweet, useTweets } from "@/hooks/useTweets";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import TweetCard from "@/components/TweetCard";
import TweetSkeleton from "@/components/TweetSkeleton";

type TweetForm = { body: string };

export default function FeedPage() {
    const user = useAuthStore((s) => s.user);
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting },
    } = useForm<TweetForm>();

    const createTweet = useCreateTweet();
    const tweetsQuery = useTweets();

    const onSubmit = (values: TweetForm) => {
        if (!values.body.trim()) return;

        createTweet.mutate(
            { body: values.body.trim() },
            {
                onSuccess: () => {
                    reset();
                    toast({
                        title: "Tweet posted",
                        description: "Your tweet is now live in the feed.",
                    });
                },
                onError: (err: any) => {
                    toast({
                        variant: "destructive",
                        title: "Failed to post tweet",
                        description: err?.message ?? "Please try again.",
                    });
                },
            },
        );
    };

    const length = watch("body")?.length ?? 0;
    const remaining = 280 - length;

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((p) => p[0])
            .join("")
            .toUpperCase()
        : "MT";

    const isLoadingTweets = tweetsQuery.isLoading && !tweetsQuery.data;

    return (
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-8">
            <Card className="border-neutral-200/60 bg-white/95 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div className="text-base font-semibold text-neutral-900">
                        What&apos;s happening?
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <span className="hidden sm:inline">Logged in as</span>
                        <span className="font-medium text-neutral-800">
                            {user?.name ?? "Guest"}
                        </span>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="flex gap-3 pb-2">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-neutral-200 text-xs text-neutral-700">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <Textarea
                            {...register("body")}
                            placeholder="Share something in 280 characters or less..."
                            className="min-h-[80px] resize-none border-0 bg-transparent px-0 text-base focus-visible:ring-0"
                            maxLength={280}
                        />
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t border-neutral-100 pt-2">
                        <span
                            className={`text-xs ${remaining < 40 ? "text-amber-500" : "text-neutral-400"
                                }`}
                        >
                            {remaining} characters remaining
                        </span>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={createTweet.isPending || isSubmitting || !length}
                            className="rounded-full bg-neutral-900 px-5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
                        >
                            {createTweet.isPending || isSubmitting ? "Posting..." : "Tweet"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="space-y-3">
                {isLoadingTweets &&
                    Array.from({ length: 3 }).map((_, i) => <TweetSkeleton key={i} />)}

                {!isLoadingTweets &&
                    tweetsQuery.data?.map((tweet) => (
                        <TweetCard
                            key={tweet.id}
                            tweet={tweet}
                            currentUserId={user?.id ?? null}
                        />
                    ))}

                {!isLoadingTweets && tweetsQuery.data?.length === 0 && (
                    <p className="mt-4 text-center text-sm text-neutral-400">
                        No tweets yet. Be the first to post!
                    </p>
                )}
            </div>
        </div>
    );
}
