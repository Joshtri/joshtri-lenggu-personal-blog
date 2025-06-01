import { Post } from "./post";
import { User } from "./user";

export interface Like {
    id: string;
    postId: string;
    userId: string | null;
    createdAt: Date;

    // Relations
    post?: Post;
    user?: User | null;
}