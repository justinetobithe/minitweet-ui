import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Heart,
    MoreHorizontal,
    Repeat2,
    Trash2,
    PencilLine,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/hooks/useToast";
import {
    useToggleLike,
    useToggleRetweet,
    useUpdateTweet,
    useDeleteTweet,
} from "@/hooks/useTweets";
import type { Tweet } from "@/types/Tweet";

type Props = {
    tweet: Tweet;
    currentUserId: number | null;
};

type EditForm = { body: string };

export default function TweetCard({ tweet, currentUserId }: Props) {
    const { toast } = useToast();
    const toggleLike = useToggleLike();
    const toggleRetweet = useToggleRetweet();
    const updateTweet = useUpdateTweet();
    const deleteTweet = useDeleteTweet();

    const isOwner = currentUserId === tweet.user.id;

    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { isSubmitting },
        reset,
    } = useForm<EditForm>({
        defaultValues: { body: tweet.body },
    });

    const editedLength = watch("body")?.length ?? 0;
    const editedRemaining = 280 - editedLength;

    const tweetInitials = tweet.user.name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase();

    const onEditSubmit = (values: EditForm) => {
        const body = values.body.trim();
        if (!body) return;

        updateTweet.mutate(
            { id: tweet.id, body },
            {
                onSuccess: () => {
                    toast({
                        title: "Tweet updated",
                        description: "Your changes have been saved.",
                    });
                    setEditOpen(false);
                },
                onError: (err: any) => {
                    toast({
                        variant: "destructive",
                        title: "Failed to update tweet",
                        description: err?.message ?? "Please try again.",
                    });
                },
            },
        );
    };

    const onDeleteConfirm = () => {
        deleteTweet.mutate(tweet.id, {
            onSuccess: () => {
                toast({
                    title: "Tweet deleted",
                    description: "Your tweet has been removed.",
                });
                setDeleteOpen(false);
            },
            onError: (err: any) => {
                toast({
                    variant: "destructive",
                    title: "Failed to delete tweet",
                    description: err?.message ?? "Please try again.",
                });
            },
        });
    };

    return (
        <>
            <Card className="border-neutral-200/70 bg-white/95 px-4 py-3 text-sm shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-neutral-200 text-xs text-neutral-700">
                                {tweetInitials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm font-semibold text-neutral-900">
                                {tweet.user.name}
                            </div>
                            <div className="text-xs text-neutral-500">
                                {new Date(tweet.created_at).toLocaleString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    month: "short",
                                    day: "2-digit",
                                })}
                            </div>
                        </div>
                    </div>

                    {isOwner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full text-neutral-500 hover:bg-neutral-100"
                                    onClick={() => {
                                        reset({ body: tweet.body });
                                    }}
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 text-xs">
                                <DropdownMenuItem
                                    onClick={() => {
                                        reset({ body: tweet.body });
                                        setEditOpen(true);
                                    }}
                                    className="flex cursor-pointer items-center gap-2"
                                >
                                    <PencilLine className="h-3.5 w-3.5" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteOpen(true)}
                                    className="flex cursor-pointer items-center gap-2 text-red-500 focus:text-red-600"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                <p className="mb-2 break-words text-base leading-relaxed text-neutral-900">
                    {tweet.body}
                </p>

                <div className="mt-1 flex items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex h-7 items-center gap-1 rounded-full px-2 text-xs text-neutral-500 hover:bg-red-50 hover:text-red-500"
                        onClick={() => toggleLike.mutate(tweet.id)}
                    >
                        <Heart
                            className="h-3.5 w-3.5"
                            fill={tweet.liked ? "#ef4444" : "transparent"}
                            strokeWidth={tweet.liked ? 0 : 2}
                        />
                        <span>{tweet.likes_count}</span>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="flex h-7 items-center gap-1 rounded-full px-2 text-xs text-neutral-500 hover:bg-emerald-50 hover:text-emerald-600"
                        onClick={() => toggleRetweet.mutate(tweet.id)}
                    >
                        <Repeat2
                            className="h-3.5 w-3.5"
                            strokeWidth={tweet.retweeted ? 3 : 2}
                        />
                        <span>{tweet.retweets_count}</span>
                    </Button>
                </div>
            </Card>

            <Dialog open={isEditOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit tweet</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-3">
                        <Textarea
                            {...register("body")}
                            maxLength={280}
                            className="min-h-[100px] text-sm"
                        />
                        <div className="flex items-center justify-between text-xs text-neutral-400">
                            <span>{editedRemaining} characters remaining</span>
                        </div>
                        <DialogFooter className="mt-2 flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isSubmitting || updateTweet.isPending}
                            >
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete tweet</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-neutral-600">
                        Are you sure you want to delete this tweet? This action cannot be
                        undone.
                    </p>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={onDeleteConfirm}
                            disabled={deleteTweet.isPending}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
