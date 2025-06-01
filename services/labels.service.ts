import { api } from "@/lib/apiClient";
import { Label } from "@prisma/client";
import { API_URL } from "@/constants/url";

// Payload untuk create/update
export interface LabelPayload {
  name: string;
  description?: string;
}

// Ambil semua label
export const getAllLabels = (): Promise<Label[]> => api.get(API_URL.LABELS.ROOT);

// Ambil satu label berdasarkan ID
export const getLabelById = (id: string): Promise<Label> =>
  api.get(API_URL.LABELS.BY_ID(id));

// Buat label baru
export const createLabel = (data: LabelPayload): Promise<Label> =>
  api.post(API_URL.LABELS.ROOT, data);

// Update label berdasarkan ID
export const updateLabel = (id: string, data: LabelPayload): Promise<Label> =>
  api.patch(API_URL.LABELS.BY_ID(id), data);

// Hapus label berdasarkan ID
export const deleteLabel = (id: string): Promise<{ message: string }> =>
  api.delete(API_URL.LABELS.BY_ID(id));



// ✅ Assign label ke post
export const assignLabelsToPost = async (postId: string, labelIds: string[]): Promise<void> => {
  await api.post(`/api/posts/${postId}/labels`, { labelIds });
};