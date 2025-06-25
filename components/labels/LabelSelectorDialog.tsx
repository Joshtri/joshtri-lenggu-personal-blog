import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { assignLabelsToPost } from "@/services/post.service";
import { Post } from "@prisma/client";
import { Button } from "../ui/button";

export function LabelSelectorDialog({ open, onClose, post, allLabels, onAssigned }: {
  open: boolean;
  onClose: () => void;
  post: Post;
  allLabels: { id: string; name: string }[];
  onAssigned?: (labelIds: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (post?.labels) {
      setSelected(post.labels.map((l: any) => l.id));
    }
  }, [post]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    await assignLabelsToPost(post.id, selected);
    onAssigned?.(selected);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>Kelola Label</DialogHeader>
        <div className="space-y-2">
          {allLabels.map((label) => (
            <label key={label.id} className="flex items-center gap-2">
              <Checkbox
                checked={selected.includes(label.id)}
                onCheckedChange={() => toggle(label.id)}
              />
              {label.name}
            </label>
          ))}
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave}>Simpan</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
