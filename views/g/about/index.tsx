"use client";

import MotionWrapper from "@/components/animations/MotionWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { fadeInUp } from "@/lib/animations";
import { ArrowLeft, BookOpen, Mail, MapPin, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <Container className="max-w-6xl mx-auto px-4 py-12">
      <MotionWrapper className="mb-8">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Link>
        </Button>
      </MotionWrapper>

      <MotionWrapper className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full mb-6">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            About Me
          </span>
        </div>

        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
          Seseorang yang senang berbagi cerita, pemikiran, dan refleksi tentang kehidupan sehari-hari. Melalui blog ini, saya menuangkan pengalaman, pembelajaran hidup, dan hal-hal yang menginspirasi saya.
        </p>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="mailto:stuffofyos1516@gmail.com">
              <Mail className="h-5 w-5 mr-2" />
              Hubungi Saya
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/">
              <BookOpen className="h-5 w-5 mr-2" />
              Baca Tulisan Saya
            </Link>
          </Button>
        </div>
      </MotionWrapper>

      <div className="grid lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2 space-y-8">
          <MotionWrapper variants={fadeInUp} delay={0.2}>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <Heart className="h-5 w-5 text-red-500" />
                  Tentang Saya
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Halo! Saya Joshtri, seseorang yang percaya bahwa setiap pengalaman hidup memiliki cerita dan pelajaran berharga...
                </p>
                <p>
                  Saya senang mengamati kehidupan sehari-hari, belajar dari pengalaman, dan menemukan makna dalam hal-hal sederhana...
                </p>
                <p>
                  Untuk topik teknologi, saya memiliki blog terpisah bernama “Tech Talks”...
                </p>
              </CardContent>
            </Card>
          </MotionWrapper>
        </div>

        <div className="space-y-6">
          <MotionWrapper variants={fadeInUp} delay={0.4}>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <MapPin className="h-5 w-5 text-green-500" />
                  Info Singkat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Lokasi</span>
                  <span className="text-gray-800 dark:text-gray-200">Indonesia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Fokus</span>
                  <span className="text-gray-800 dark:text-gray-200">Personal Blog</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Topik</span>
                  <span className="text-gray-800 dark:text-gray-200">Life & Stories</span>
                </div>
              </CardContent>
            </Card>
          </MotionWrapper>

          <MotionWrapper variants={fadeInUp} delay={0.5}>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-gray-200">Topik Favorit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["Kehidupan", "Refleksi", "Pengalaman", "Inspirasi", "Cerita", "Pembelajaran", "Perjalanan", "Makna"].map((topic) => (
                    <Badge key={topic} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </MotionWrapper>
        </div>
      </div>

      <MotionWrapper variants={fadeInUp} delay={0.8}>
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white border-0">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Mari Berbagi Cerita!</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Punya cerita menarik atau ingin berbagi pengalaman? Saya selalu senang mendengar dan belajar dari cerita orang lain.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link href="mailto:joshtri.lenggu@example.com">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Saya
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="text-gray-950 dark:text-white border-white hover:text-blue-600"
              >
                <Link href="/">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Kembali ke Blog
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </MotionWrapper>
    </Container>
  );
}
