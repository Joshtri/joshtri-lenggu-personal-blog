import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

export interface UploadResult {
    url: string
    name: string
    type: string
    size: number
}

// /**
//  * Mengunggah file gambar ke Firebase Storage
//  * @param file File yang akan diunggah (harus bertipe image)
//  * @param folder Nama folder di Firebase Storage (default: 'images')
//  * @returns Object berisi URL download dan metadata file
//  */
// export async function uploadImageToFirebase(
//     file: File,
//     folder = "images"
// ): Promise<UploadResult> {
//     if (!file) throw new Error("File tidak ditemukan")

//     // Validasi hanya gambar
//     if (!file.type.startsWith("image/")) {
//         throw new Error("Hanya file gambar yang diperbolehkan")
//     }

//     try {
//         const fileName = `${Date.now()}-${file.name}`
//         const storageRef = ref(storage, `${folder}/${fileName}`)

//         // Upload file langsung tanpa arrayBuffer (File sudah kompatibel)
//         const snapshot = await uploadBytes(storageRef, file)

//         const downloadURL = await getDownloadURL(snapshot.ref)

//         return {
//             url: downloadURL,
//             name: fileName,
//             type: file.type,
//             size: file.size,
//         }
//     } catch (error) {
//         console.error("Gagal mengunggah gambar:", error)
//         throw new Error("Gagal mengunggah gambar ke Firebase Storage")
//     }
// }


// import { ref, uploadBytes } from "firebase/storage";
// import { storage } from "./firebase";

// import { ref, uploadBytes } from "firebase/storage";
// import { storage } from "./firebase";

export interface UploadResult {
  url: string;
  name: string;
  type: string;
  size: number;
}

export async function uploadImageToFirebase(
  file: File,
  folder = "images"
): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Hanya file gambar yang diperbolehkan");
  }

  const fileName = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  const snapshot = await uploadBytes(storageRef, file);

  const encodedPath = encodeURIComponent(snapshot.ref.fullPath);

  // 💡 Gunakan manual hardcoded project ID untuk URL
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID; // <- ganti jika berubah
  const url = `https://firebasestorage.googleapis.com/v0/b/${projectId}.appspot.com/o/${encodedPath}?alt=media`;

  return {
    url,
    name: fileName,
    type: file.type,
    size: file.size,
  };
}
