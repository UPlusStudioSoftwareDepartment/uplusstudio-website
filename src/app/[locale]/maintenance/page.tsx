import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MaintenancePage from "@/components/MaintenancePage";
import { isInMaintenance } from "@/lib/app-config";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Maintenance() {
  if (!isInMaintenance) notFound();
  return <MaintenancePage />;
}
