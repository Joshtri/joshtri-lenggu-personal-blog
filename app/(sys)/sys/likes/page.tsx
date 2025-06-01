'use client'

import { PageHeader } from "@/components/common/PageHeader";
import { Container } from "@/components/ui/container";
import DataViewSwitcher from "@/components/ui/listgrid/dataview-switcher";
import { getAllLikes } from "@/services/likes.service";
import { Like } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LikesPage() {
  const [likes, setLikes] = useState<Like[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchLikes = async () => {
    try {
      const data = await getAllLikes();
      setLikes(data);
    } catch (error) {
      console.error("Gagal ambil likes:", error);
    } finally {
      setLoading(false);
    }
  };

  const likeColumns = [
    { label: "User ID", accessor: "userId" },
    { label: "Post ID", accessor: "postId" },
    {
      label: "Created At",
      accessor: (like: Like) => new Date(like.createdAt).toLocaleString(),
      center: false,
    },
  ];

  useEffect(() => {
    fetchLikes();
  }, []);

  return (
    <Container>
      <PageHeader
        title="Likes"
        description="Kelola interaksi suka pada konten kamu."
        breadcrumbs={[
          { label: "Dashboard", href: "/sys/dashboard" },
          { label: "Likes" },
        ]}
      />

      <DataViewSwitcher
        columns={likeColumns}
        data={likes}
        isLoading={loading}
        skeletonRows={5}
        
      />
    </Container>
  );
}
