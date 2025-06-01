"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import DataViewSwitcher from "@/components/ui/listgrid/dataview-switcher";
import EntityDialog, { FieldConfig } from "@/components/common/EntityDialog";
import { getAllLabels } from "@/services/labels.service";
import { Label } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { updateLabel } from "@/services/labels.service";
import { toast } from "sonner"; // jika pakai toast

export default function LabelsPage() {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"detail" | "edit">("detail");
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  const labelFields: FieldConfig[] = [
    { name: "name", label: "Nama" },
    { name: "description", label: "Deskripsi", type: "textarea" },
  ];

  const fetchLabels = async () => {
    try {
      const data = await getAllLabels();
      setLabels(data);
    } catch (error) {
      console.error("Gagal ambil label:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabels();
  }, []);

  const openDialog = (mode: "detail" | "edit", label: Label) => {
    setDialogMode(mode);
    setSelectedLabel(label);
    setDialogOpen(true);
  };

  const handleSave = async (updated: Label) => {
    try {
      const result = await updateLabel(updated.id, {
        name: updated.name,
        description: updated.description ?? undefined,
      });
      setLabels((prev) => prev.map((l) => (l.id === result.id ? result : l)));
      toast.success("Label berhasil diperbarui");
    } catch (error) {
      console.error("Gagal update label:", error);
      toast.error("Gagal memperbarui label");
    }
  };

  const labelsColumns = [
    { label: "Name", accessor: "name" },
    { label: "Description", accessor: "description", center: false },
  ];

  return (
    <Container>
      <PageHeader
        title="Labels"
        description="Kelola dan tampilkan daftar label kamu."
        breadcrumbs={[{ label: "Dashboard", href: "/" }, { label: "Labels" }]}
        actions={
          <Button asChild>
            <Link
              href={"/sys/labels/create"}
              className="flex items-center gap-2"
            >
              Tambah Label
            </Link>
          </Button>
        }
      />

      <DataViewSwitcher
        columns={labelsColumns}
        data={labels}
        skeletonRows={5}
        isLoading={loading}
        pageSize={10}
        actionsConfig={{
          onView: (label: Label) => openDialog("detail", label),
          onEdit: (label: Label) => openDialog("edit", label),
        }}
        enableInlineEdit
        onInlineEdit={async (updated: Label) => {
          try {
            const result = await updateLabel(updated.id, {
              name: updated.name,
              description: updated.description ?? undefined,
            });
            setLabels((prev) =>
              prev.map((l) => (l.id === result.id ? result : l))
            );
            toast.success("Label berhasil diperbarui (inline)");
          } catch (error) {
            console.error("Gagal update label (inline):", error);
            toast.error("Gagal memperbarui label secara inline");
          }
        }}
      />

      <EntityDialog
        open={dialogOpen}
        mode={dialogMode}
        title="Label"
        fields={labelFields}
        data={selectedLabel}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </Container>
  );
}
