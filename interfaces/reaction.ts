import { ReactionType } from "@/enums/enums";
import { Post } from "./post";
import { User } from "./user";

export interface Reaction {
    id: string;
    type: ReactionType;
    postId: string;
    userId: string | null;
    createdAt: Date;

    // Relations
    post?: Post;
    user?: User | null;
}