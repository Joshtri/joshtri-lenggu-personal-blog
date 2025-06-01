"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getAllLabels, assignLabelsToPost } from "@/services/labels.service";
import { MultiSelect } from "@/components/ui/multiselect"; // kamu bisa buat sendiri atau pakai react-select

interface Props {
  postId: string;
  open: boolean;
  onClose: () => void;
}

export default function LabelEditorDialog({ postId, open, onClose }: Props) {
  const [allLabels, setAllLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLabels = async () => {
      const data = await getAllLabels();
      setAllLabels(data);
    };

    if (open) fetchLabels();
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    await assignLabelsToPost(postId, selectedLabels);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kelola Label Post</DialogTitle>
        </DialogHeader>
        <MultiSelect
          options={allLabels.map(l => ({ label: l.name, value: l.id }))}
          value={selectedLabels}
          onChange={setSelectedLabels}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            Simpan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
