import { Post } from "./post";

export interface PostView {
    id: string;
    postId: string;
    ip: string | null;
    userAgent: string | null;
    viewedAt: Date;

    // Relations
    post?: Post;
}