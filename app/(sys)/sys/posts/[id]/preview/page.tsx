"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { getPostById } from "@/services/post.service";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import type {
  Post,
  Label,
  Comment,
  Like,
  PostView,
  Bookmark,
  Reaction,
} from "@prisma/client";
import { ContentSkeleton } from "@/components/ui/loading/ContentSkeleton";
import Image from "next/image";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type FullPost = Post & {
  labels: Label[];
  comments: Comment[];
  Like: Like[];
  PostView: PostView[];
  Bookmark: Bookmark[];
  Reaction: Reaction[];
};

export default function PostPreviewPage() {
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [post, setPost] = useState<FullPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      try {
        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        console.error("Gagal mengambil post:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <ContentSkeleton withImage lines={4} />;
  }

  if (!post) return notFound();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Posts", href: "/sys/posts" },
          { label: post.title, href: `/sys/posts/${postId}` },
        ]}
        actions={
          <Button asChild>
            <Link
              href={`/sys/posts/${postId}/edit`}
              className="flex items-center gap-2"
            >
              Edit Post
            </Link>
          </Button>
        }
        title={post.title}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
          <CardDescription>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.createdAt), "dd MMM yyyy")}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime || "—"} min read
              </div>
              {!post.published && <Badge variant="outline">Draft</Badge>}
            </div>
          </CardDescription>
        </CardHeader>

        {post.coverImage && (
          <div className="relative w-full h-[400px] rounded-b-md overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <CardContent className="pt-6 prose dark:prose-invert max-w-none">
          <article dangerouslySetInnerHTML={{ __html: post.content }} />
        </CardContent>
      </Card>
    </div>
  );
}
