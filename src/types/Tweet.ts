import type { User } from "./User";

export type Tweet = {
    id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user: User;
    likes_count: number;
    liked: boolean;
    retweets_count: number;
    retweeted: boolean;
};
