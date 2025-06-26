"use client";

import MotionWrapper from "@/components/animations/MotionWrapper";
import EmptyState from "@/components/custom/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ContentSkeleton } from "@/components/ui/loading/ContentSkeleton";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { getAllPosts } from "@/services/public/post.service";
import type { PublicPost } from "@/types/public";
import { calculateReadTime, formatIndonesianDate } from "@/utils/common";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllLabels } from "@/services/public/label.service";
import type { Label } from "@prisma/client"; // pastikan type sudah ada
import { useSearchParams } from "next/navigation";
import ImageWithSkeleton from "@/components/ui/loading/ImageWithSkeleton";

export default function Home() {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const searchParams = useSearchParams();
  const selectedLabel = searchParams.get("label");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawPosts = await getAllPosts();
        const rawLabels = await getAllLabels();

        setLabels(rawLabels);

        const postsWithDefaults = rawPosts.map((post) => ({
          ...post,
          readTime: calculateReadTime(post.content),
        }));

        setPosts(postsWithDefaults);
      } catch (err) {
        setError("Gagal mengambil konten.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const blogPosts = posts.filter((post) => {
    if (!post.published) return false;

    if (selectedLabel) {
      return post.labels?.some((labelItem) => {
        const labelName =
          typeof labelItem === "string"
            ? labelItem
            : labelItem.label?.name || labelItem.name;

        return labelName?.toLowerCase() === selectedLabel.toLowerCase();
      });
    }

    return true;
  });

  return (
    <Container className="max-w-7xl mx-auto px-4 py-12">
      {/* // <main className="container mx-auto px-4 py-12"> */}
      <MotionWrapper className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Personal Blog
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-gray-100 dark:via-blue-300 dark:to-gray-100 bg-clip-text text-transparent">
          Joshtri Lenggu
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto leading-relaxed">
          Berbagi pemikiran tentang{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            kerandoman
          </span>
          ,
          <span className="font-semibold text-green-600 dark:text-green-400">
            {" "}
            kehidupan
          </span>
          , dan
          <span className="font-semibold text-purple-600 dark:text-purple-400">
            {" "}
            pembelajaran
          </span>
        </p>

        <div className="flex justify-center gap-2 mt-6">
          <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
          <div className="w-1 h-1 bg-green-400 rounded-full"></div>
          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
        </div>
      </MotionWrapper>

      {/* ================== CATEGORIES SECTION ================== */}
      <MotionWrapper
        as="section"
        className="mb-8"
        variants={fadeInUp}
        initialY={20}
        duration={0.6}
        delay={0.2}
      >
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Filter berdasarkan Topik
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/">
              <Badge
                variant={!selectedLabel ? "default" : "secondary"}
                className={`cursor-pointer text-sm py-1.5 px-3 font-medium transition-all duration-200 ${
                  !selectedLabel
                    ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200 dark:ring-blue-400"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Semua
              </Badge>
            </Link>
            {labels.map((label) => {
              const isActive =
                selectedLabel?.toLowerCase() === label.name.toLowerCase();
              return (
                <Link
                  key={label.id}
                  href={`/?label=${encodeURIComponent(label.name)}`}
                >
                  <Badge
                    variant={isActive ? "default" : "secondary"}
                    className={`cursor-pointer text-sm py-1.5 px-3 font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200 dark:ring-blue-400"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {label.name}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      </MotionWrapper>

      {/* ================== BLOG SECTION ================== */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          {/* <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Blog Publik
          </h2> */}
          <Button asChild className="dark:text-gray-100" variant="outline">
            <Link href="/">
              Lihat Semua
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {loading ? (
          <ContentSkeleton variant="card" count={6} />
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : blogPosts.length === 0 ? (
          <EmptyState
            title="Belum ada konten blog"
            description="Saat ini belum tersedia artikel dari kategori Blog."
          />
        ) : (
          <MotionWrapper
            as="div"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initialY={20}
            duration={0.6}
            delay={0.1}
          >
            {blogPosts.slice(0, 6).map((post, index) => (
              <motion.div key={post.slug} variants={fadeInUp}>
                <Link href={`/${post.slug}`}>
                  <Card className="overflow-hidden h-full flex flex-col group dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                    <div className="relative h-48 w-full overflow-hidden">
                      {post.coverImage && (
                        <div className="relative w-full h-48 overflow-hidden rounded-t-md">
                          {/* <Image
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority={index < 3}
                            loading={index < 3 ? "eager" : "lazy"}
                          /> */}
                          <ImageWithSkeleton
                            src={post.coverImage || "/placeholder.svg"}
                            alt={post.title}
                            priority={index < 3}
                          />
                        </div>
                      )}
                    </div>

                    <CardHeader className="pb-3">
                      {/* Labels Section */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.labels?.slice(0, 3).map((labelItem) => {
                          const labelName =
                            typeof labelItem === "string"
                              ? labelItem
                              : labelItem.label.name;
                          const isActive =
                            selectedLabel?.toLowerCase() ===
                            labelName?.toLowerCase();

                          return (
                            <Badge
                              key={
                                typeof labelItem === "string"
                                  ? labelItem
                                  : labelItem.label.id
                              }
                              variant={isActive ? "default" : "secondary"}
                              className={`text-xs font-medium transition-all duration-200 ${
                                isActive
                                  ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-200 dark:ring-blue-400"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                              }`}
                            >
                              {labelName}
                            </Badge>
                          );
                        })}
                      </div>

                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-gray-800 dark:text-gray-200">
                        {post.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                        {post.excerpt || "Tidak ada deskripsi."}
                      </p>
                    </CardContent>

                    <CardFooter className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-0">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {formatIndonesianDate(post.createdAt || "")}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </MotionWrapper>
        )}
      </section>
    </Container>
  );
}
