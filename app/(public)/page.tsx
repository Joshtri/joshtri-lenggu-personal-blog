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
import { ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const rawPosts = await getAllPosts();

        const postsWithDefaults = rawPosts.map((post, index) => ({
          ...post,
          readTime: calculateReadTime(post.content),
          category: ["Technology", "Programming", "Design", "AI"][
            Math.floor(Math.random() * 4)
          ],
        }));

        setPosts(postsWithDefaults);
      } catch (err) {
        setError("Gagal mengambil konten.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const blogPosts = posts.filter((post) => post.published);

  return (
    <Container className="max-w-7xl mx-auto px-4 py-12">
      {/* // <main className="container mx-auto px-4 py-12"> */}
      <MotionWrapper className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Joshtri Lenggu
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Catatan pribadi, refleksi, dan cerita perjalanan hidup dan pemikiran
          saya seputar teknologi, kehidupan, dan pembelajaran.
        </p>
      </MotionWrapper>

      {/* ================== BLOG SECTION ================== */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Blog Publik
          </h2>
          <Button asChild className="dark:text-gray-100" variant="outline">
            <Link href="/blog">
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
                  <Card className="overflow-hidden h-full flex flex-col group dark:bg-gray-800 dark:border-gray-700">
                    <div className="relative h-48 w-full overflow-hidden">
                      {post.coverImage && (
                        <div className="relative w-full h-48 overflow-hidden rounded-t-md">
                          <Image
                            src={post.coverImage} // Remove decodeURIComponent
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority={index < 3} // Add priority for first few images to improve LCP
                            loading={index < 3 ? "eager" : "lazy"}
                          />
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3 z-10">
                        {post.category}
                      </Badge>
                    </div>

                    <CardHeader className="pb-2">
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

      {/* ================== FEATURED SECTION ================== */}

      <MotionWrapper as={"section"} className="mb-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2 gap-6 p-8 md:p-12 items-center">
            <div className="text-white dark:text-gray-100">
              <Badge variant="secondary" className="mb-4">
                Tentang Saya
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Halo, Saya Joshtri</h2>
              <p className="mb-6 opacity-90">
                Selamat datang di blog pribadi saya. Di sini saya menuliskan
                pemikiran, pengalaman, dan berbagai hal yang saya pelajari.
                Semoga bermanfaat atau setidaknya menyenangkan untuk dibaca.
              </p>
              <Button asChild size="lg" variant="secondary">
                <Link href="/">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Jelajahi Tulisan Saya
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </MotionWrapper>

      {/* ================== CATEGORIES SECTION ================== */}
      <MotionWrapper
        as="section"
        className="mb-16"
        variants={fadeInUp}
        initialY={20}
        duration={0.6}
        delay={0.2}
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
          Topik Tulisan
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Pemikiran", "Kehidupan", "Teknologi", "Catatan"].map(
            (category, index) => (
              <motion.div
                key={category}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Link href={`/blog?category=${category.toLowerCase()}`}>
                  <Card className="text-center p-6 hover:shadow-md transition-all duration-300 hover:border-blue-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-600">
                    <h3 className="font-medium mb-2 text-gray-800 dark:text-gray-200">
                      {category}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {
                        [
                          "Gagasan dan renungan pribadi",
                          "Cerita dari kehidupan sehari-hari",
                          "Sudut pandang tentang teknologi",
                          "Kumpulan catatan random",
                        ][index]
                      }
                    </p>
                  </Card>
                </Link>
              </motion.div>
            )
          )}
        </div>
      </MotionWrapper>
    </Container>
  );
}
