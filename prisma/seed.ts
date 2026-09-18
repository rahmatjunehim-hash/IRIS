import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Mulai seeding data IRIS Optik I See You...");

  // 1. Seed 4 Cabang
  const cabangData = [
    {
      kode: "PWT",
      nama: "Purwokerto",
      alamat: "Jl. Jend. Soedirman, Purwokerto",
      telepon: "081234567890",
    },
    {
      kode: "CLP",
      nama: "Cilacap",
      alamat: "Jl. Gatot Subroto, Cilacap",
      telepon: "081234567891",
    },
    {
      kode: "WSB",
      nama: "Wonosobo",
      alamat: "Jl. Ahmad Yani, Wonosobo",
      telepon: "081234567892",
    },
    {
      kode: "PBG",
      nama: "Purbalingga",
      alamat: "Jl. MT Haryono, Purbalingga",
      telepon: "081234567893",
    },
  ];

  const cabangs: Record<string, string> = {};
  for (const c of cabangData) {
    const record = await prisma.cabang.upsert({
      where: { kode: c.kode },
      update: { nama: c.nama, alamat: c.alamat, telepon: c.telepon },
      create: c,
    });
    cabangs[c.kode] = record.id;
    console.log(`✅ Cabang tersimpan: ${c.nama} (${c.kode})`);
  }

  // Password hash default: "password123"
  const passwordHash = await bcrypt.hash("password123", 10);

  // 2. Seed Akun Super Admin
  const superAdmins = [
    {
      name: "Super Admin IRIS",
      username: "superadmin",
      email: "superadmin@optikiseeyou.com",
      role: Role.SUPER_ADMIN,
    },
    {
      name: "Super Admin 1",
      username: "admin1",
      email: "admin1@optikiseeyou.com",
      role: Role.SUPER_ADMIN,
    },
    {
      name: "Super Admin 2",
      username: "admin2",
      email: "admin2@optikiseeyou.com",
      role: Role.SUPER_ADMIN,
    },
  ];

  for (const admin of superAdmins) {
    await prisma.user.upsert({
      where: { username: admin.username },
      update: { name: admin.name, email: admin.email, role: admin.role, passwordHash },
      create: {
        ...admin,
        passwordHash,
      },
    });
    console.log(`✅ Super Admin tersimpan: ${admin.username}`);
  }

  // 3. Seed User Operasional
  const operationalUsers = [
    // Purwokerto
    {
      name: "Kasir Purwokerto",
      username: "kasir_pwt",
      email: "kasir.pwt@optikiseeyou.com",
      role: Role.KASIR,
      cabangId: cabangs["PWT"],
    },
    {
      name: "Optometris Purwokerto",
      username: "cekmata_pwt",
      email: "cekmata.pwt@optikiseeyou.com",
      role: Role.CEK_MATA,
      cabangId: cabangs["PWT"],
    },
    // Cilacap
    {
      name: "Kasir Cilacap",
      username: "kasir_clp",
      email: "kasir.clp@optikiseeyou.com",
      role: Role.KASIR,
      cabangId: cabangs["CLP"],
    },
    {
      name: "Optometris Cilacap",
      username: "cekmata_clp",
      email: "cekmata.clp@optikiseeyou.com",
      role: Role.CEK_MATA,
      cabangId: cabangs["CLP"],
    },
    // Wonosobo
    {
      name: "Kasir Wonosobo",
      username: "kasir_wsb",
      email: "kasir.wsb@optikiseeyou.com",
      role: Role.KASIR,
      cabangId: cabangs["WSB"],
    },
    {
      name: "Optometris Wonosobo",
      username: "cekmata_wsb",
      email: "cekmata.wsb@optikiseeyou.com",
      role: Role.CEK_MATA,
      cabangId: cabangs["WSB"],
    },
    // Purbalingga
    {
      name: "Kasir Purbalingga",
      username: "kasir_pbg",
      email: "kasir.pbg@optikiseeyou.com",
      role: Role.KASIR,
      cabangId: cabangs["PBG"],
    },
    {
      name: "Optometris Purbalingga",
      username: "cekmata_pbg",
      email: "cekmata.pbg@optikiseeyou.com",
      role: Role.CEK_MATA,
      cabangId: cabangs["PBG"],
    },
    // Pusat (Faset lantai 2, CS, After Sales, Gudang)
    {
      name: "Teknisi Faset Pusat",
      username: "faset_pusat",
      email: "faset@optikiseeyou.com",
      role: Role.FASET,
      cabangId: null, // Pusat
    },
    {
      name: "Customer Service Pusat",
      username: "cs_pusat",
      email: "cs@optikiseeyou.com",
      role: Role.CS,
      cabangId: null,
    },
    {
      name: "Staff After Sales",
      username: "aftersales_pusat",
      email: "aftersales@optikiseeyou.com",
      role: Role.AFTER_SALES,
      cabangId: null,
    },
    {
      name: "Staff Gudang Lensa",
      username: "gudang_pusat",
      email: "gudang@optikiseeyou.com",
      role: Role.GUDANG,
      cabangId: null,
    },
  ];

  for (const u of operationalUsers) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {
        name: u.name,
        email: u.email,
        role: u.role,
        cabangId: u.cabangId,
        passwordHash,
      },
      create: {
        ...u,
        passwordHash,
      },
    });
    console.log(`✅ User tersimpan: ${u.username} (${u.role})`);
  }

  // 4. Sample Stok Lensa Awal per Cabang
  const sampleLensTypes = [
    "Single Vision CRMC",
    "Single Vision Blue Ray",
    "Single Vision Photochromic",
    "Single Vision Bluechromic",
    "Progressive Standar",
  ];

  for (const kode of Object.keys(cabangs)) {
    const cId = cabangs[kode];
    for (const jenis of sampleLensTypes) {
      await prisma.lensStock.upsert({
        where: {
          id: `${cId}_${jenis.replace(/\s+/g, "_").toLowerCase()}`,
        },
        update: {},
        create: {
          id: `${cId}_${jenis.replace(/\s+/g, "_").toLowerCase()}`,
          cabangId: cId,
          jenisLensa: jenis,
          stockQty: 20,
          minStock: 5,
        },
      });
    }
  }
  console.log("✅ Sample stok lensa per cabang tersimpan.");

  // 5. Sample Pelanggan & Order Demo untuk Cabang Purwokerto & Cilacap
  const sampleCustomer = await prisma.customer.upsert({
    where: { id: "cust_demo_01" },
    update: {},
    create: {
      id: "cust_demo_01",
      nama: "Ananda Pratama",
      noWa: "081234567890",
      alamat: "Jl. HR Bunyamin No. 42, Purwokerto",
      jenisKelamin: "L",
    },
  });

  const sampleCustomer2 = await prisma.customer.upsert({
    where: { id: "cust_demo_02" },
    update: {},
    create: {
      id: "cust_demo_02",
      nama: "Siti Rahmawati",
      noWa: "081987654321",
      alamat: "Jl. Overste Isdiman No. 18, Purwokerto",
      jenisKelamin: "P",
    },
  });

  // Order antrian demo
  if (cabangs["PWT"]) {
    await prisma.order.upsert({
      where: { id: "ord_demo_01" },
      update: {},
      create: {
        id: "ord_demo_01",
        noAntrian: 1,
        customerId: sampleCustomer.id,
        cabangId: cabangs["PWT"],
        frameModel: "ISY Classic Titanium Aviator",
        frameColor: "Rose Gold",
        jenisLensa: "Stellify Bluechromic (Hoya)",
        status: "MENUNGGU_CEK_MATA",
        statusAntrian: "DIPANGGIL",
        dipanggilAt: new Date(),
      },
    });

    await prisma.order.upsert({
      where: { id: "ord_demo_02" },
      update: {},
      create: {
        id: "ord_demo_02",
        noAntrian: 2,
        customerId: sampleCustomer2.id,
        cabangId: cabangs["PWT"],
        frameModel: "ISY Acetate Minimalist Square",
        frameColor: "Matte Black",
        jenisLensa: "Single Vision Blue Ray",
        status: "MENUNGGU_CEK_MATA",
        statusAntrian: "MENUNGGU",
      },
    });
    console.log("✅ Sample order & antrian demo tersimpan.");
  }

  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
