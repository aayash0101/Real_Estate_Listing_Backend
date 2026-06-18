import { PrismaClient, PropertyType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.property.deleteMany();
  await prisma.agent.deleteMany();

  // Create agents
  const agents = await Promise.all([
    prisma.agent.create({
      data: {
        name: "Sarah Mitchell",
        email: "sarah.mitchell@realty.com",
        phone: "0412 345 678",
        is_admin: true,
      },
    }),
    prisma.agent.create({
      data: {
        name: "James Thornton",
        email: "james.thornton@realty.com",
        phone: "0423 456 789",
        is_admin: false,
      },
    }),
    prisma.agent.create({
      data: {
        name: "Emily Chen",
        email: "emily.chen@realty.com",
        phone: "0434 567 890",
        is_admin: false,
      },
    }),
  ]);

  console.log(`✅ Created ${agents.length} agents`);

  // Create properties
  const properties: Array<{
    title: string;
    description: string;
    price: number;
    suburb: string;
    state: string;
    postcode: string;
    address: string;
    property_type: PropertyType;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    land_size?: number;
    internal_status: string;
    agent_id: string;
  }> = [
    {
      title: "Charming Family Home in Northside",
      description:
        "A beautiful 4-bedroom family home nestled in a quiet street. Features a large backyard, updated kitchen, and open-plan living.",
      price: 850000,
      suburb: "Northside",
      state: "QLD",
      postcode: "4000",
      address: "12 Maple Street, Northside QLD 4000",
      property_type: PropertyType.HOUSE,
      bedrooms: 4,
      bathrooms: 2,
      parking: 2,
      land_size: 612,
      internal_status: "Vendor motivated — will accept offers above $820k",
      agent_id: agents[0].id,
    },
    {
      title: "Modern Apartment in City Centre",
      description:
        "Sleek 2-bedroom apartment on the 12th floor with stunning city views, gym access, and secure parking.",
      price: 620000,
      suburb: "City Centre",
      state: "QLD",
      postcode: "4001",
      address: "Unit 1204, 88 Queen Street, City Centre QLD 4001",
      property_type: PropertyType.APARTMENT,
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      internal_status: "Deceased estate — settlement flexible",
      agent_id: agents[1].id,
    },
    {
      title: "Spacious Townhouse Near Schools",
      description:
        "Three-storey townhouse in a well-maintained complex. Walking distance to top-rated schools and public transport.",
      price: 720000,
      suburb: "Eastwood",
      state: "QLD",
      postcode: "4152",
      address: "3/45 Park Road, Eastwood QLD 4152",
      property_type: PropertyType.TOWNHOUSE,
      bedrooms: 3,
      bathrooms: 2,
      parking: 2,
      land_size: 180,
      internal_status: "Tenant in place until March 2025",
      agent_id: agents[2].id,
    },
    {
      title: "Beachside Retreat — Stunning Views",
      description:
        "Rare 5-bedroom oceanfront property with direct beach access. Fully renovated with premium finishes throughout.",
      price: 2200000,
      suburb: "Coastal Heights",
      state: "QLD",
      postcode: "4218",
      address: "7 Ocean Drive, Coastal Heights QLD 4218",
      property_type: PropertyType.HOUSE,
      bedrooms: 5,
      bathrooms: 3,
      parking: 3,
      land_size: 890,
      internal_status: "Expressions of interest campaign — closes 30 July",
      agent_id: agents[0].id,
    },
    {
      title: "Affordable Studio in Westend",
      description:
        "Compact and efficient studio apartment in the heart of Westend. Perfect for investors or first-home buyers.",
      price: 310000,
      suburb: "Westend",
      state: "QLD",
      postcode: "4101",
      address: "Unit 5, 22 Boundary Street, Westend QLD 4101",
      property_type: PropertyType.APARTMENT,
      bedrooms: 1,
      bathrooms: 1,
      parking: 0,
      internal_status: "Strata levy arrears — buyer to be aware",
      agent_id: agents[1].id,
    },
    {
      title: "Large Land Block — Build Your Dream Home",
      description:
        "Flat 800sqm block in a fast-growing suburb. All services connected. Ready to build.",
      price: 480000,
      suburb: "Northside",
      state: "QLD",
      postcode: "4000",
      address: "Lot 14, Sunrise Crescent, Northside QLD 4000",
      property_type: PropertyType.LAND,
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      land_size: 800,
      internal_status: "Council approval pending for subdivision",
      agent_id: agents[2].id,
    },
    {
      title: "Executive Home with Pool",
      description:
        "Prestigious 4-bedroom executive home with heated pool, home theatre, and triple garage on a corner block.",
      price: 1350000,
      suburb: "Eastwood",
      state: "QLD",
      postcode: "4152",
      address: "1 Executive Place, Eastwood QLD 4152",
      property_type: PropertyType.HOUSE,
      bedrooms: 4,
      bathrooms: 3,
      parking: 3,
      land_size: 750,
      internal_status: "Owners overseas — power of attorney in place",
      agent_id: agents[0].id,
    },
    {
      title: "Cosy 2-Bed Unit Near Transport",
      description:
        "Well-presented two-bedroom unit within 200m of the train station. Great rental history — currently returning $480/week.",
      price: 540000,
      suburb: "Westend",
      state: "QLD",
      postcode: "4101",
      address: "Unit 8, 11 Railway Parade, Westend QLD 4101",
      property_type: PropertyType.APARTMENT,
      bedrooms: 2,
      bathrooms: 1,
      parking: 1,
      internal_status: "Investor selling — rental income verified",
      agent_id: agents[1].id,
    },
    {
      title: "Heritage Cottage — Character Charm",
      description:
        "Restored Queenslander cottage with original features, wraparound verandah, and lush tropical garden.",
      price: 975000,
      suburb: "City Centre",
      state: "QLD",
      postcode: "4001",
      address: "44 Heritage Lane, City Centre QLD 4001",
      property_type: PropertyType.HOUSE,
      bedrooms: 3,
      bathrooms: 1,
      parking: 1,
      land_size: 405,
      internal_status: "Heritage overlay — renovation restrictions apply",
      agent_id: agents[2].id,
    },
    {
      title: "Commercial Office Space — Prime Location",
      description:
        "Ground-floor commercial tenancy in a busy retail strip. Currently leased to a medical practice.",
      price: 1100000,
      suburb: "Northside",
      state: "QLD",
      postcode: "4000",
      address: "Ground Floor, 100 Commercial Road, Northside QLD 4000",
      property_type: PropertyType.COMMERCIAL,
      bedrooms: 0,
      bathrooms: 2,
      parking: 4,
      land_size: 320,
      internal_status: "Lease expiry in 18 months — renegotiation underway",
      agent_id: agents[0].id,
    },
  ];

  for (const property of properties) {
    await prisma.property.create({ data: property });
  }

  console.log(`✅ Created ${properties.length} properties`);
  console.log("🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());