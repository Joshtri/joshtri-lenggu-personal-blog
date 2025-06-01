"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";

interface CommentReplyProps {
  onCommentAdded: (newComment: { content: string; author: string }) => void;
  onCancel: () => void;
}

export default function CommentReply({
  onCommentAdded,
  onCancel,
}: CommentReplyProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    onCommentAdded({ content, author: "Anonymous" });
    setContent("");
    setTimeout(() => {
      setIsSubmitting(false);
      onCancel();
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-gray-50/80 dark:bg-gray-700/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-600/50"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis balasan Anda..."
            className="w-full min-h-[100px] rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 resize-none text-gray-800 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            rows={3}
            autoFocus
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
            {content.length}/300
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Membalas sebagai{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Anonymous
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
            >
              <X className="h-4 w-4 mr-1 group-hover:rotate-90 transition-transform duration-200" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengirim...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  Kirim
                </div>
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
