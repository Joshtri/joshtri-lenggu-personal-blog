"use client";

import FormField from "@/components/common/FormField";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { createLabel } from "@/services/labels.service";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LabelFormValues {
  name: string;
  description?: string;
}

export default function LabelsCreatePage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LabelFormValues>();

  const router = useRouter();

  const onSubmit = async (values: LabelFormValues) => {
    try {
      await createLabel(values);
      toast.success("Label berhasil dibuat");
      router.push("/sys/labels");
    } catch (error) {
      toast.error("Gagal membuat label");
    }
  };

  return (
    <Container>
      <PageHeader
        title="Buat Label"
        description="Tambahkan label baru untuk mengelompokkan konten kamu."
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Labels", href: "/sys/labels" },
          { label: "Buat Label" },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          label="Nama Label"
          placeholder="Misalnya: Tips, Tutorial, Info"
          control={control}
          register={register}
          rules={{ required: "Nama label wajib diisi" }}
          error={errors.name?.message}
          required
          className="w-full"
        />

        <FormField
          name="description"
          label="Deskripsi"
          type="textarea"
          placeholder="Deskripsi singkat (opsional)"
          control={control}
          register={register}
          error={errors.description?.message}
          className="w-full"
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Label"}
        </Button>
      </form>
    </Container>
  );
}
