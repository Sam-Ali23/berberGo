import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function LegacyCustomerOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/customer/appointments/${id}`);
}
