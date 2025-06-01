import { PostLabel } from "./postLabel";

export interface Label {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    posts?: PostLabel[];
}