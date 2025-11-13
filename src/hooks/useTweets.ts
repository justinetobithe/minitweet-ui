import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Tweet } from "../types/Tweet";

export const useTweets = () =>
    useQuery({
        queryKey: ["tweets"],
        queryFn: async (): Promise<Tweet[]> => {
            const { data } = await api.get<Tweet[]>("/tweets");
            return data;
        },
    });

export const useCreateTweet = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { body: string }) => {
            const { data } = await api.post<Tweet>("/tweets", payload);
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["tweets"] });
        },
    });
};

export const useToggleLike = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (tweetId: number) => {
            const { data } = await api.post<{ liked: boolean; likesCount: number }>(
                `/tweets/${tweetId}/like`,
            );
            return { tweetId, ...data };
        },
        onSuccess: ({ tweetId, liked, likesCount }) => {
            qc.setQueryData<Tweet[]>(["tweets"], (prev) =>
                prev?.map((t) =>
                    t.id === tweetId ? { ...t, liked, likes_count: likesCount } : t,
                ) ?? prev,
            );
        },
    });
};

export const useToggleRetweet = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (tweetId: number) => {
            const { data } = await api.post<{ retweeted: boolean; retweetsCount: number }>(
                `/tweets/${tweetId}/retweet`,
            );
            return { tweetId, ...data };
        },
        onSuccess: ({ tweetId, retweeted, retweetsCount }) => {
            qc.setQueryData<Tweet[]>(["tweets"], (prev) =>
                prev?.map((t) =>
                    t.id === tweetId
                        ? { ...t, retweeted, retweets_count: retweetsCount }
                        : t,
                ) ?? prev,
            );
        },
    });
};

export const useUpdateTweet = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { id: number; body: string }) => {
            const { data } = await api.patch<Tweet>(`/tweets/${payload.id}`, {
                body: payload.body,
            });
            return data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["tweets"] });
        },
    });
};

export const useDeleteTweet = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/tweets/${id}`);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["tweets"] });
        },
    });
};
