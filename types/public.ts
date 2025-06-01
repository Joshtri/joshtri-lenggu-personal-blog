import { Bookmark, Comment, Like, PostView, Reaction } from "@prisma/client";

// types/public.ts
export interface PublicPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  coverImage?: string;
  excerpt?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  labels: {
    label: {
      id: string;
      name: string;
    };
  }[];
  comments: Comment[];
  Like: Like[];
  Bookmark: Bookmark[];
  Reaction: Reaction[];
  PostView: PostView[];

  // tambahan di sisi klien (bukan dari database)
  readTime?: string;
  category?: string;
}
