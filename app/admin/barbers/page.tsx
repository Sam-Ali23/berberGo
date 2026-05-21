import { redirect } from "next/navigation";

export default function LegacyAdminBarbersPage() {
  redirect("/admin/shops");
}
