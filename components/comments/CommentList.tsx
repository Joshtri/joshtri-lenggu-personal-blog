"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Reply, User, Heart, MoreHorizontal } from "lucide-react";
import CommentReply from "./CommentReply";

interface CommentListProps {
  comments: {
    id: string;
    content: string;
    author: string;
    createdAt: string;
    replies?: any[];
  }[];
  onCommentAdded: (
    newComment: { content: string; author: string },
    parentId?: string
  ) => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function CommentList({
  comments,
  onCommentAdded,
}: CommentListProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handleReplyAdded = (
    newComment: { content: string; author: string },
    parentId: string
  ) => {
    onCommentAdded(newComment, parentId);
    setReplyingTo(null);
  };

  const toggleLike = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {comments.map((comment, index) => (
        <motion.div
          key={comment.id}
          variants={fadeInUp}
          className="group relative"
        >
          {/* Comment Card */}
          <div className="relative p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90 dark:hover:bg-gray-800/90">
            {/* Author Info */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {comment.author}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            {/* Comment Content */}
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {comment.content}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleLike(comment.id)}
                className={`flex items-center gap-2 rounded-lg transition-all duration-200 ${
                  likedComments.has(comment.id)
                    ? "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20"
                    : "text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                }`}
              >
                <Heart
                  className={`h-4 w-4 transition-all duration-200 ${
                    likedComments.has(comment.id)
                      ? "fill-current scale-110"
                      : ""
                  }`}
                />
                <span className="text-sm font-medium">
                  {likedComments.has(comment.id) ? "Disukai" : "Suka"}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-all duration-200"
              >
                <Reply className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {replyingTo === comment.id ? "Batal" : "Balas"}
                </span>
              </Button>
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <CommentReply
                  onCommentAdded={(newComment) =>
                    handleReplyAdded(newComment, comment.id)
                  }
                  onCancel={() => setReplyingTo(null)}
                />
              </motion.div>
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 mt-4 relative">
              {/* Connection Line */}
              <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-purple-200 to-transparent dark:from-blue-800 dark:via-purple-800" />
              <div className="absolute -left-6 top-6 w-4 h-px bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800" />

              <CommentList
                comments={comment.replies}
                onCommentAdded={onCommentAdded}
              />
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
