import { Bookmark } from "./bookmark";
import { Like } from "./like";
import { Reaction } from "./reaction";

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: Date;

    // Relations
    comments?: Comment[];
    likes?: Like[];
    bookmarks?: Bookmark[];
    reactions?: Reaction[];
}