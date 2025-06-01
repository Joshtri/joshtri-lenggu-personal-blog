import { publicApi } from "@/lib/publicClient";
import type { Comment } from "@prisma/client";

export const fetchPublicComments = (postId: string): Promise<Comment[]> =>
  publicApi.get(`/comments?postId=${postId}`);

export const submitPublicComment = (data: Partial<Comment>): Promise<Comment> =>
  publicApi.post("/comments", data);
