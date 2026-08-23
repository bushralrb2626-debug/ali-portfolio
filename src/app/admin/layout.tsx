import { AdminChrome } from "@/components/admin/AdminChrome";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return <AdminChrome signedIn={Boolean(session?.user)}>{children}</AdminChrome>;
}
