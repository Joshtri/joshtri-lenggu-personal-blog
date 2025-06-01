"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

export type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea";
  readOnly?: boolean;
};

interface EntityDialogProps<T> {
  open: boolean;
  mode: "detail" | "edit";
  title?: string;
  fields: FieldConfig[];
  data: T | null;
  onClose: () => void;
  onSave?: (updated: T) => void;
}

export default function EntityDialog<T extends Record<string, any>>({
  open,
  mode,
  title,
  fields,
  data,
  onClose,
  onSave,
}: EntityDialogProps<T>) {
  const [formData, setFormData] = useState<T | null>(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const isEdit = mode === "edit";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (formData && onSave) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title || (isEdit ? "Edit Data" : "Detail Data")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {fields.map((field) =>
            field.type === "textarea" ? (
              <Textarea
                key={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                readOnly={!isEdit || field.readOnly}
                placeholder={field.label}
              />
            ) : (
              <Input
                key={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                readOnly={!isEdit || field.readOnly}
                placeholder={field.label}
              />
            )
          )}
        </div>

        {isEdit && (
          <div className="pt-4 text-right">
            <Button onClick={handleSave}>Simpan</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
