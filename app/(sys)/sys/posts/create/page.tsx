"use client";

import FormField from "@/components/common/FormField";
import { PageHeader } from "@/components/common/PageHeader";
import RichTextEditor, {
  type RichTextEditorHandle,
} from "@/components/RichTextEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlignLeft,
  Calendar,
  Clock,
  Eye,
  FileText,
  Save,
  Settings,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormData = {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
};

export default function PostsCreatePage() {
  const router = useRouter();
  const editorRef = useRef<RichTextEditorHandle>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      published: false,
      content: "",
    },
  });

  // Watch title and content for updates
  const watchedTitle = watch("title");
  const watchedContent = watch("content");

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchedTitle, setValue]);

  // Count words, characters, and estimate reading time
  useEffect(() => {
    if (watchedContent) {
      const text = watchedContent.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((word) => word.length > 0);
      const wordCount = words.length;
      const charCount = text.length;
      const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute

      setWordCount(wordCount);
      setCharCount(charCount);
      setReadingTime(readingTime);
    }
  }, [watchedContent]);

  // Register content field for validation
  useEffect(() => {
    register("content", {
      required: "Konten wajib diisi",
      validate: (value) =>
        value.replace(/<[^>]*>/g, "").trim().length > 0 ||
        "Konten tidak boleh kosong",
    });
  }, [register]);

  const onSubmit = async (data: FormData) => {
    try {
      // Fetch the latest content directly from the Quill editor
      const latestContent = editorRef.current?.getContent() || data.content;
      if (
        !latestContent ||
        latestContent.replace(/<[^>]*>/g, "").trim().length === 0
      ) {
        toast.error("Konten tidak boleh kosong");
        return;
      }

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("content", latestContent); // Use the latest content
      formData.append("excerpt", data.excerpt || "");
      formData.append("published", String(data.published));

      if (thumbnailFile) {
        formData.append("image", thumbnailFile);
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Gagal membuat post");
      }

      toast.success("Post berhasil dibuat");
      router.push("/sys/posts");
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal membuat post"
      );
    }
  };

  const handleContentChange = (content: string) => {
    setValue("content", content, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Header */}

      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Posts", href: "/sys/posts" },
          { label: "Create Post" },
        ]}
        title="Buat Post Baru"
        description="Mulai menulis konten yang menginspirasi dan bagikan dengan dunia."
        actions={
          <>
            {isDirty && (
              <Badge
                variant="secondary"
                className="text-xs bg-orange-100 text-orange-700 border-orange-200"
              >
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-1 animate-pulse" />
                Belum disimpan
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => router.push("/sys/posts")}
              className="border-slate-200 hover:bg-slate-50"
            >
              Batal
            </Button>
            <Button
              size="sm"
              disabled={isSubmitting}
              onClick={handleSubmit(onSubmit)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </>
        }
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor Column - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* Editor Card */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mr-3">
                      <AlignLeft className="h-4 w-4 text-white" />
                    </div>
                    Editor Konten
                    <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    className={cn(
                      "border-0 rounded-lg overflow-hidden",
                      errors.content && "ring-2 ring-red-500 ring-opacity-50"
                    )}
                  >
                    <RichTextEditor
                      ref={editorRef}
                      onChange={handleContentChange}
                      placeholder="Mulai menulis konten yang menginspirasi..."
                      className="w-full"
                      defaultValue={watchedContent} // Ensure editor reflects form state
                    />
                  </div>
                  {errors.content && (
                    <div className="px-6 pb-4">
                      <p className="text-sm text-red-500 flex items-center mt-2">
                        <X className="h-4 w-4 mr-1" />
                        {errors.content.message}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Enhanced Stats Card */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <Type className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Kata
                        </p>
                        <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                          {wordCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="p-2 bg-green-500 rounded-lg">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300">
                          Karakter
                        </p>
                        <p className="text-lg font-bold text-green-900 dark:text-green-100">
                          {charCount}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="p-2 bg-purple-500 rounded-lg">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                          Baca
                        </p>
                        <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                          {readingTime} min
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                          Tanggal
                        </p>
                        <p className="text-sm font-bold text-orange-900 dark:text-orange-100">
                          {new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Form Fields Column - Right Side */}
            <div className="space-y-6">
              {/* Post Information */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mr-3">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                    Informasi Post
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <FormField
                    name="title"
                    label="Judul"
                    placeholder="Masukkan judul post yang menarik"
                    control={control}
                    register={register}
                    rules={{ required: "Judul wajib diisi" }}
                    error={errors.title?.message}
                    required
                    className="w-full"
                  />

                  <FormField
                    name="slug"
                    label="Slug"
                    placeholder="url-post-anda"
                    control={control}
                    register={register}
                    rules={{
                      required: "Slug wajib diisi",
                      pattern: {
                        value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        message: "Slug harus berformat kebab-case",
                      },
                    }}
                    error={errors.slug?.message}
                    required
                    className="w-full"
                  />

                  <FormField
                    name="excerpt"
                    label="Ringkasan"
                    type="textarea"
                    placeholder="Ringkasan singkat untuk preview dan SEO..."
                    control={control}
                    register={register}
                    error={errors.excerpt?.message}
                    className="w-full"
                  />

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                      Gambar Thumbnail
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setThumbnailFile(file);
                      }}
                      className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Publishing Options */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg mr-3">
                      <Eye className="h-4 w-4 text-white" />
                    </div>
                    Pengaturan Publikasi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <FormField
                    name="published"
                    label="Terbitkan sekarang"
                    type="checkbox"
                    placeholder="Ya, langsung terbitkan post ini"
                    control={control} // ✅ cukup ini saja
                    className="flex items-center space-x-2"
                  />

                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      💡 <strong>Tips:</strong> Jika tidak dicentang, post akan
                      disimpan sebagai draft dan bisa diterbitkan nanti.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
