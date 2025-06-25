"use client";

import MotionWrapper from "@/components/animations/MotionWrapper";
import Comment from "@/components/comments/Comment";
import EmptyState from "@/components/custom/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ContentSkeleton } from "@/components/ui/loading/ContentSkeleton";
import { fadeIn } from "@/lib/animations";
import { getPostBySlug } from "@/services/public/post.service";
import { PublicPost } from "@/types/public";
import { calculateReadTime, formatIndonesianDate } from "@/utils/common";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [post, setPost] = useState<PublicPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getPostBySlug(slug || "");
        if (!fetchedPost) {
          setError("Post tidak ditemukan.");
          return;
        }

        const postWithDefaults: PublicPost = {
          ...fetchedPost,
          readTime:
            fetchedPost.readTime || calculateReadTime(fetchedPost.content),
        };

        setPost(postWithDefaults);
      } catch (err) {
        setError("Gagal mengambil post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return (
    <Container className="max-w-5xl mx-auto px-4 py-8">
      <MotionWrapper className="mb-8">
        <Button asChild variant="outline" className="mb-4 dark:text-gray-100">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Blog
          </Link>
        </Button>
      </MotionWrapper>

      {loading ? (
        <ContentSkeleton withImage lines={5} />
      ) : error || !post ? (
        <EmptyState
          title="Post Tidak Ditemukan"
          description={error || "Post yang Anda cari tidak ada."}
          icon={<ArrowLeft className="h-6 w-6" />}
        />
      ) : (
        <MotionWrapper variants={fadeIn}>
          <Card className="overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            {post.coverImage && (
              <div className="relative w-full h-64 md:h-96 overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 75vw"
                  priority
                />
                {/* Display labels dynamically */}
                <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-2">
                  {post.labels && post.labels.length > 0 ? (
                    post.labels.map((label, index) => (
                      <Badge
                        key={index}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {label.label.name}
                      </Badge>
                    ))
                  ) : (
                    <Badge>Uncategorized</Badge>
                  )}
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {post.title}
              </CardTitle>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatIndonesianDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>
          <Comment />
        </MotionWrapper>
      )}
    </Container>
  );
}
