import { Post } from "./post";
import { User } from "./user";

export interface Bookmark {
    id: string;
    userId: string;
    postId: string;
    createdAt: Date;

    // Relations
    user?: User;
    post?: Post;
}