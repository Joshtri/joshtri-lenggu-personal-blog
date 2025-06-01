import { Bookmark } from "./bookmark";
import { Comment } from "./comment";
import { Like } from "./like";
import { PostLabel } from "./postLabel";
import { PostView } from "./postView";
import { Reaction } from "./reaction";

// Main Models
export interface Post {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;

    // Relations
    labels?: PostLabel[];
    comments?: Comment[];
    likes?: Like[];
    views?: PostView[];
    bookmarks?: Bookmark[];
    reactions?: Reaction[];
}