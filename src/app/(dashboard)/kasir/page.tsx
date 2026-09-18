import React from "react";
import { getCurrentUser } from "@/lib/auth";
import KasirClient from "./KasirClient";

export default async function KasirDashboardPage() {
  const user = await getCurrentUser();
  const cabang = user?.cabangKode && user.cabangKode !== "HQ" ? user.cabangKode : "PWT";

  return <KasirClient initialCabang={cabang} />;
}
