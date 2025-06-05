"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { StatusTooltipWrapper } from "@/components/common/StatusIconTooltip";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import DataViewSwitcher from "@/components/ui/listgrid/dataview-switcher";
import {
  deletePost,
  getPosts,
  patchPost,
  updatePost,
} from "@/services/post.service";
import type { Label, Post } from "@prisma/client";
import { CheckCircle, Tags, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ManagePostLabelsDialog } from "@/components/labels/ManagePostLabelsDialog";

type PostWithLabels = Post & {
  labels: Label[];
};

export default function PostsPage() {
  const [posts, setPosts] = useState<PostWithLabels[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<
    Post | PostWithLabels | null
  >(null);
  const [labelModalOpen, setLabelModalOpen] = useState(false);

  const router = useRouter();

  const fetchPosts = async () => {
    try {
      const data = await getPosts();

      const mapped = data.map((post: Post) => ({
        ...post,
        labels: post.labels.map((pl: any) => pl.label), // ambil hanya info label
      }));

      setPosts(mapped);
    } catch (error) {
      console.error("Gagal ambil post:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const postColumns = [
    { label: "Title", accessor: "title" },
    { label: "Slug", accessor: "slug" },
    {
      label: "Published",
      accessor: (post: Post) => (
        <StatusTooltipWrapper
          status={post.published}
          trueText="Telah dipublikasikan"
          falseText="Belum dipublikasikan"
        />
      ),
      center: false,
    },

    {
      label: "Labels",
      accessor: (post: PostWithLabels) => (
        <div className="flex flex-wrap gap-1">
          {post.labels.length > 0 ? (
            post.labels.map((label) => (
              <span
                key={label.id}
                className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground border"
              >
                {label.name}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground italic text-xs">-</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Container>
      <PageHeader
        title="Posts"
        description="Kelola dan tampilkan daftar post blog kamu."
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Posts" }]}
        actions={
          <Button asChild>
            <Link
              href={"/sys/posts/create"}
              className="flex items-center gap-2"
            >
              Tambah Post
            </Link>
          </Button>
        }
      />

      <DataViewSwitcher
        columns={postColumns}
        data={posts}
        isLoading={loading}
        view="table"
        pageSize={10}
        enableInlineEdit
        onInlineEdit={async (updated: Post) => {
          try {
            const result = await updatePost(updated.id, {
              title: updated.title,
              slug: updated.slug,
              published: updated.published, // jika diperlukan
            });
            setPosts((prev) =>
              prev.map((p) =>
                p.id === result.id ? { ...result, labels: p.labels } : p
              )
            );
          } catch (err) {
            console.error("Gagal update post:", err);
          }
        }}
        actionsConfig={{
          onView: (post: Post) => {
            router.push(`/sys/posts/${post.id}/preview`);
          },
          onEdit: (post: Post) => {
            router.push(`/sys/posts/${post.id}/edit`);
          },
          onDelete: (post: Post) => ({
            message: `Yakin ingin menghapus "${post.title}"?`,
            onConfirm: async () => {
              await deletePost(post.id);
              setPosts((prev) => prev.filter((p) => p.id !== post.id));
            },
          }),

          customActions: (post: Post) => [
            {
              label: post.published ? "Tandai sebagai Draft" : "Publikasikan",
              icon: post.published ? (
                <XCircle className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ),
              onClick: async () => {
                try {
                  const updated = await patchPost(post.id, {
                    published: !post.published,
                  });

                  setPosts((prev) =>
                    prev.map((p) =>
                      p.id === updated.id ? { ...updated, labels: p.labels } : p
                    )
                  );
                  toast.success(
                    post.published
                      ? "Post berhasil ditandai sebagai draft."
                      : "Post berhasil dipublikasikan."
                  );

                  fetchPosts(); // refresh data
                } catch (err) {
                  console.error("Gagal toggle publish:", err);
                  alert("Gagal mengubah status publikasi.");
                }
              },
            },

            {
              label: "Kelola Label",
              icon: <Tags className="w-4 h-4" />,
              onClick: () => {
                setSelectedPost(post);
                setLabelModalOpen(true);
              },
            },
          ],
        }}
        skeletonRows={5}
      />

      <ManagePostLabelsDialog
        open={labelModalOpen}
        onClose={() => setLabelModalOpen(false)}
        post={selectedPost}
        onSuccess={() => {
          // toast.success("Label berhasil diperbarui");
          fetchPosts(); // panggil ulang data post
        }}
      />
    </Container>
  );
}
