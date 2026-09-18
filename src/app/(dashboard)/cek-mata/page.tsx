import React from "react";
import { getCurrentUser } from "@/lib/auth";
import CekMataClient from "./CekMataClient";

export default async function CekMataDashboardPage() {
  const user = await getCurrentUser();
  const cabang = user?.cabangKode && user.cabangKode !== "HQ" ? user.cabangKode : "PWT";

  return <CekMataClient initialCabang={cabang} />;
}
