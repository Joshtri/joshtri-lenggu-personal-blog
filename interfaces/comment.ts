import { Post } from "./post";
import { User } from "./user";

export interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    postId: string;
    authorId: string | null;
    guestName: string | null;
    guestEmail: string | null;

    // Relations
    post?: Post;
    author?: User | null;
}