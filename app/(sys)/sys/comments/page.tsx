"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Container } from "@/components/ui/container";
import DataViewSwitcher from "@/components/ui/listgrid/dataview-switcher";
import { getAllComments } from "@/services/comment.service";
import { Comment } from "@prisma/client";
import { useEffect, useState } from "react";

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
 
  const fetchComments = async () => {
    try {
      const data = await getAllComments();
      setComments(data);
    } catch (error) {
      console.error("Gagal ambil label:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const commentColumns = [
    { label: "Content", accessor: "content" },
    { label: "Author", accessor: "author" },
    { label: "Post ID", accessor: "postId" },
    {
      label: "Created At",
      accessor: (comment: Comment) => new Date(comment.createdAt).toLocaleString(),
      center: false,
    },
  ];


  return (
    <Container>
      <PageHeader
        title="Comments"
        description="Kelola komentar yang masuk pada konten kamu."
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Comments" }]}
      />

      <DataViewSwitcher
        data={comments}
        isLoading={loading}
        skeletonRows={5}
        columns={commentColumns}
      />
    </Container>
  );
}
