import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyBarberOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/shop/appointments/${id}`);
}
