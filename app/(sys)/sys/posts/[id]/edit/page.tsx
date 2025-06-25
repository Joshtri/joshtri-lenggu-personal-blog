"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { getPostById, updatePost } from "@/services/post.service";
import { PageHeader } from "@/components/common/PageHeader";
import { ContentSkeleton } from "@/components/ui/loading/ContentSkeleton";
import { Button } from "@/components/ui/button";
import FormField from "@/components/common/FormField";
import RichTextEditor, {
  type RichTextEditorHandle,
} from "@/components/RichTextEditor";
import { toast } from "sonner";
import { X } from "lucide-react";

type PostFormValues = {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  published: boolean;
};

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const postId = Array.isArray(id) ? id[0] : id;

  const editorRef = useRef<RichTextEditorHandle>(null);
  const [initialContent, setInitialContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      published: false,
    },
  });

  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      try {
        const post = await getPostById(postId);
        reset({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          content: post.content,
          published: post.published,
        });
        setInitialContent(post.content || "");
      } catch (err) {
        toast.error("Gagal memuat data post.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [postId, reset]);

  useEffect(() => {
    register("content", {
      required: "Konten wajib diisi",
      validate: (value) =>
        value.replace(/<[^>]*>/g, "").trim().length > 0 ||
        "Konten tidak boleh kosong",
    });
  }, [register]);

  const handleContentChange = (content: string) => {
    setValue("content", content, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = async (data: PostFormValues) => {
    const latestContent = editorRef.current?.getContent() || "";
    const isEmpty = latestContent.replace(/<[^>]*>/g, "").trim().length === 0;

    if (isEmpty) {
      toast.error("Konten tidak boleh kosong");
      return;
    }

    try {
      await updatePost(postId, { ...data, content: latestContent });
      toast.success("Post berhasil diperbarui!");
      router.push(`/sys/posts/${postId}/preview`);
    } catch (err) {
      toast.error("Gagal menyimpan perubahan.");
    }
  };

  if (loading) return <ContentSkeleton withImage lines={6} />;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Posts", href: "/sys/posts" },
          { label: "Edit Post", href: `/sys/posts/${postId}/edit` },
        ]}
        title="Edit Post"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="title"
          label="Judul"
          placeholder="Masukkan judul post"
          control={control}
          rules={{ required: "Judul wajib diisi" }}
          error={errors.title?.message}
          required
        />

        <FormField
          name="slug"
          label="Slug"
          placeholder="url-post-anda"
          control={control}
          rules={{
            required: "Slug wajib diisi",
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: "Slug harus berformat kebab-case",
            },
          }}
          error={errors.slug?.message}
          required
        />

        <FormField
          name="excerpt"
          label="Ringkasan"
          type="textarea"
          placeholder="Ringkasan singkat untuk preview dan SEO..."
          control={control}
          error={errors.excerpt?.message}
        />

        {/* Gantikan textarea konten dengan RichTextEditor */}
        <div>
          <label className="text-sm font-medium mb-1 block">Konten</label>
          <RichTextEditor
            ref={editorRef}
            defaultValue={initialContent}
            onChange={handleContentChange}
            placeholder="Tulis konten post di sini..."
          />
          {errors.content && (
            <p className="text-sm text-red-500 mt-2 flex items-center">
              <X className="w-4 h-4 mr-1" />
              {errors.content.message}
            </p>
          )}
        </div>

        <FormField
          name="published"
          label="Publikasikan?"
          type="checkbox"
          control={control}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/sys/posts/${postId}`)}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Simpan Perubahan
          </Button>
        </div>
      </form>
    </div>
  );
}
