// services/public/label.service.ts
import { publicApi } from "@/lib/publicClient";
import { API_PUBLIC_URL } from "@/constants/url";


export const getAllLabels = async () => {
    const res = await publicApi.get(API_PUBLIC_URL.LABELS.ROOT);
    // console.log('getAllLabels response:', res.data);
    return res.data.data;
}
