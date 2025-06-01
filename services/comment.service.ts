import { api } from "@/lib/apiClient";
import type { Comment } from "@prisma/client";
import { API_URL } from "@/constants/url";

export const getAllComments = (): Promise<Comment[]> => {
  return api.get(API_URL.COMMENTS.ROOT);
};

export const getComments = (postId: string): Promise<Comment[]> => {
  return api.get(API_URL.COMMENTS.BY_POST_ID(postId));
};

export const createComment = (data: Partial<Comment>): Promise<Comment> => {
  return api.post(API_URL.COMMENTS.ROOT, data);
};
