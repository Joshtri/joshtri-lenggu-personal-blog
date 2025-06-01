// services/public/post.service.ts
import { publicApi } from "@/lib/publicClient";
// import { Post } from "@prisma/client";
import { API_PUBLIC_URL } from "@/constants/url";
import type { PublicPost } from "@/types/public";

// export const getAllPosts = (): Promise<Post[]> => {
//   return publicApi.get(API_PUBLIC_URL.POSTS.ROOT);
// };
export const getAllPosts = async (): Promise<PublicPost[]> => {
  const res = await publicApi.get(API_PUBLIC_URL.POSTS.ROOT);

  console.log('getAllPosts response:', res.data);
  return res.data.data as PublicPost[];
};


export const getPostBySlug = async (slug: string): Promise<PublicPost> => {
  const res = await publicApi.get(API_PUBLIC_URL.POSTS.BY_SLUG(slug));
  return res.data.data as PublicPost;
};  