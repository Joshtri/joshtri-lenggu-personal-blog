import { api } from "@/lib/apiClient";
import type { Like } from "@prisma/client";
import { API_URL } from "@/constants/url";

// Ambil semua like (optional)
export const getAllLikes = (): Promise<Like[]> => {
    return api.get(API_URL.LIKES.ROOT);
};

// Ambil like berdasarkan postId
export const getLikesByPost = (postId: string): Promise<Like[]> => {
    return api.get(API_URL.LIKES.BY_POST_ID(postId));
};

// Tambah like
export const createLike = (data: Partial<Like>): Promise<Like> => {
    return api.post(API_URL.LIKES.ROOT, data);
};

// Hapus like berdasarkan ID
export const deleteLike = (id: string): Promise<{ message: string }> => {
    return api.delete(API_URL.LIKES.BY_ID(id));
};
