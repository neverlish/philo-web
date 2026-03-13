// app/prescription/[id]/page.tsx
import { PrescriptionDetail } from "@/components/prescription/prescription-detail";
import { prescriptions } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function PrescriptionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const prescription = prescriptions.find((p) => p.id === id);

  if (!prescription) {
    notFound();
  }

  return <PrescriptionDetail prescription={prescription} />;
}

// Generate static params for all prescriptions
export async function generateStaticParams() {
  return prescriptions.map((prescription) => ({
    id: prescription.id,
  }));
}
