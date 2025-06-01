import { api } from "@/lib/apiClient";
import type { Bookmark, Comment, Label, Like, Post, PostView, Reaction } from "@prisma/client";
import { API_URL } from "@/constants/url";

export const getPosts = (): Promise<Post[]> => api.get(API_URL.POSTS.ROOT);

export const deletePost = (id: string): Promise<void> => api.delete(API_URL.POSTS.BY_ID(id));

export const createPost = (
  data: Pick<Post, "title" | "slug" | "content" | "excerpt" | "published">
): Promise<Post> => api.post(API_URL.POSTS.ROOT, data);

export const getPostById = async (id: string) => {
  try {
    const res = await api.get(API_URL.POSTS.BY_ID(id));
    return res as Post & {
      labels: Label[];
      comments: Comment[];
      Like: Like[];
      PostView: PostView[];
      Bookmark: Bookmark[];
      Reaction: Reaction[];
    };
  } catch (error) {
    console.error("Gagal mengambil detail post:", error);
    throw error;
  }
};


export const updatePost = (
  id: string,
  data: Partial<Pick<Post, "title" | "slug" | "content" | "excerpt" | "published" | "coverImage">>
): Promise<Post> => {
  return api.put(API_URL.POSTS.BY_ID(id), data);
};


export const patchPost = (
  id: string,
  data: Partial<Pick<Post, "title" | "slug" | "content" | "excerpt" | "published" | "coverImage">> // atau field lain
): Promise<Post> => {
  return api.patch(API_URL.POSTS.BY_ID(id), data);
};

export const assignLabelsToPost = (postId: string, labelIds: string[]) => {
  return api.post(`${API_URL.POSTS.BY_ID(postId)}/labels`, { labelIds });
};
