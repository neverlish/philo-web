// app/prescription/[id]/page.tsx
import { PrescriptionDetail } from "@/components/prescription/prescription-detail";
import { prescriptions } from "@/lib/data";
import { notFound } from "next/navigation";

export default function PrescriptionPage({ params }: { params: { id: string } }) {
  const prescription = prescriptions.find((p) => p.id === params.id);

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
