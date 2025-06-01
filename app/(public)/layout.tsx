import AppHeader from "@/components/partials/AppHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppHeader />
      <main className="pt-16">{children}</main>
    </>
  );
}
