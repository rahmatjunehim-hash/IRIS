export interface FonnteSendResult {
  status: boolean;
  message: string;
  responseId?: string;
}

export interface WhatsAppOrderDetails {
  customerName: string;
  cabangNama?: string;
  frameModel?: string | null;
  frameColor?: string | null;
  jenisLensa?: string | null;
  eyeExam?: {
    sphR?: string | null;
    cylR?: string | null;
    axisR?: string | null;
    addR?: string | null;
    sphL?: string | null;
    cylL?: string | null;
    axisL?: string | null;
    addL?: string | null;
    pdTotal?: string | null;
  } | null;
}

export function buildOrderPickupMessage(details: WhatsAppOrderDetails): string {
  const name = details.customerName;
  const branch = details.cabangNama ? ` di *Optik I See You Cabang ${details.cabangNama}*` : "";
  const frame = details.frameModel || "Frame Pilihan";
  const frameColor = details.frameColor ? ` (${details.frameColor})` : "";
  const lens = details.jenisLensa || "Lensa Kacamata";

  let examText = "";
  if (details.eyeExam) {
    const exam = details.eyeExam;
    const rParts = [
      exam.sphR ? `SPH ${exam.sphR}` : null,
      exam.cylR && exam.cylR !== "0.00" && exam.cylR !== "0" ? `CYL ${exam.cylR}` : null,
      exam.axisR && exam.axisR !== "0" ? `AXIS ${exam.axisR}°` : null,
      exam.addR ? `ADD ${exam.addR}` : null,
    ].filter(Boolean);

    const lParts = [
      exam.sphL ? `SPH ${exam.sphL}` : null,
      exam.cylL && exam.cylL !== "0.00" && exam.cylL !== "0" ? `CYL ${exam.cylL}` : null,
      exam.axisL && exam.axisL !== "0" ? `AXIS ${exam.axisL}°` : null,
      exam.addL ? `ADD ${exam.addL}` : null,
    ].filter(Boolean);

    const rSpecs = rParts.length > 0 ? rParts.join(" | ") : "Normal";
    const lSpecs = lParts.length > 0 ? lParts.join(" | ") : "Normal";

    examText = `\n\n🔍 *Ukuran Resep:*
• *R (Kanan):* ${rSpecs}
• *L (Kiri):* ${lSpecs}${exam.pdTotal ? `\n• *PD:* ${exam.pdTotal} mm` : ""}`;
  }

  return `Halo ka *${name}*, orderan kacamata kaka sudah selesai difaset dan sudah siap diambil${branch}! ✨👓

📋 *Detail Kacamata Kaka:*
• *Frame:* ${frame}${frameColor}
• *Lensa:* ${lens}${examText}

Silakan datang ke toko untuk fitting kacamata dan pengambilan ya ka. Terima kasih! 🙏

_for every you • Optik I See You_`;
}

export async function sendWhatsAppMessage(
  targetPhone: string,
  customerName: string,
  customMessage?: string
): Promise<FonnteSendResult> {
  const token = process.env.FONNTE_TOKEN;
  const message = customMessage || `Halo ka ${customerName}, orderan kaka sudah bisa diambil, I See You`;

  // Normalisasi nomor telepon ke format Indonesia (misal: 08123... -> 628123...)
  let formattedPhone = targetPhone.replace(/\D/g, "");
  if (formattedPhone.startsWith("0")) {
    formattedPhone = "62" + formattedPhone.slice(1);
  }

  // Jika token belum diset di .env, kita log simulasi (berguna untuk testing lokal)
  if (!token || token === "your_fonnte_token_here") {
    console.log("📱 [SIMULASI FONNTE WA] Dikirim ke:", formattedPhone);
    console.log("💬 Pesan:", message);
    return {
      status: true,
      message: `[Simulasi Sukses] Pesan terkirim ke ${formattedPhone}: "${message}"`,
      responseId: "sim_fonnte_" + Date.now(),
    };
  }

  try {
    const formData = new FormData();
    formData.append("target", formattedPhone);
    formData.append("message", message);
    formData.append("countryCode", "62");

    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: formData,
    });

    const data = await response.json();

    if (data.status === true || data.status === "true") {
      return {
        status: true,
        message: "Notifikasi WhatsApp berhasil terkirim.",
        responseId: data.id || data.process || "fonnte_" + Date.now(),
      };
    } else {
      return {
        status: false,
        message: data.reason || data.message || "Gagal mengirim pesan melalui Fonnte.",
      };
    }
  } catch (err: unknown) {
    console.error("Error sending Fonnte WhatsApp message:", err);
    return {
      status: false,
      message: err instanceof Error ? err.message : "Gagal terhubung ke gateway Fonnte.",
    };
  }
}
