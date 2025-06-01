"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import CommentList from "./CommentList";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Comment() {
  const [comments, setComments] = useState<
    {
      id: string;
      content: string;
      author: string;
      createdAt: string;
      replies?: any[];
    }[]
  >([]);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentAdded = (
    newComment: { content: string; author: string },
    parentId?: string
  ) => {
    const comment = {
      id: Math.random().toString(36).substr(2, 9),
      content: newComment.content,
      author: newComment.author,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    if (!parentId) {
      setComments((prev) => [...prev, comment]);
    } else {
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId
            ? { ...c, replies: [...(c.replies || []), comment] }
            : c
        )
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    handleCommentAdded({ content, author: "Anonymous" });
    setContent("");
    setTimeout(() => setIsSubmitting(false), 500);
  };

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mt-16 relative"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20 rounded-3xl -z-10" />

      <motion.div variants={fadeIn} className="relative">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
              Diskusi & Komentar
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Bagikan pemikiran Anda tentang artikel ini
            </p>
          </div>
        </div>

        <motion.div
          variants={fadeIn}
          className="mb-10 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Tulis komentar yang membangun dan bermakna..."
                className="w-full min-h-[120px] rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 resize-none text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                rows={4}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                {content.length}/500
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Komentar sebagai{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  Anonymous
                </span>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mengirim...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    Kirim Komentar
                  </div>
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        <motion.div variants={fadeIn}>
          {comments.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Belum ada komentar
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Jadilah yang pertama memberikan komentar dan memulai diskusi
                yang menarik!
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-1" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                  {comments.length} Komentar
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent flex-1" />
              </div>
              <CommentList
                comments={comments}
                onCommentAdded={handleCommentAdded}
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
