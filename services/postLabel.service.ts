import { api } from "@/lib/apiClient";


export const assignLabelToPost = (postId: string, labelId: string) =>
  api.post("/post-labels", { postId, labelId });

export const assignMultipleLabels = (postId: string, labelIds: string[]) =>
  api.patch("/post-labels", { postId, labelIds });