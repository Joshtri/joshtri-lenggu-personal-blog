import { Label } from "./label";
import { Post } from "./post";

export interface PostLabel {
    postId: string;
    labelId: string;

    // Relations
    post?: Post;
    label?: Label;
}