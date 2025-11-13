import type { User } from './User';

export interface Like {
    id: number;
    user_id: number;
    tweet_id: number;
    user?: User;
}
