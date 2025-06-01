"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label, Post } from "@prisma/client";
import { getAllLabels, assignLabelsToPost } from "@/services/labels.service";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  post: Post | null;
}

export function ManagePostLabelsDialog({ open, onClose, post }: Props) {
  const [labels, setLabels] = useState<Label[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!post || !open) return;

      try {
        const all = await getAllLabels();
        setLabels(all);

        // Jika kamu punya data post.labels (sudah include saat fetch post)
        // maka bisa otomatis ambil label yang sudah dipakai
        const assigned = (post as any).labels?.map((l: any) => l.labelId) || [];
        setSelected(assigned);
      } catch (err) {
        toast.error("Gagal memuat label");
      }
    };

    load();
  }, [post, open]);

  const handleSave = async () => {
    if (!post) return;
    try {
      await assignLabelsToPost(post.id, selected);
      toast.success("Label berhasil diperbarui");
      onClose();
    } catch (err) {
      toast.error("Gagal menyimpan label");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kelola Label Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {labels.map((label) => (
            <label key={label.id} className="flex items-center gap-2">
              <Checkbox
                checked={selected.includes(label.id)}
                onCheckedChange={(checked) => {
                  setSelected((prev) =>
                    checked
                      ? [...prev, label.id]
                      : prev.filter((id) => id !== label.id)
                  );
                }}
              />
              {label.name}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
