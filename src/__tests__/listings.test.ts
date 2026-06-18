import request from "supertest";
import app from "../app";
import prisma from "../config/prisma";

// We'll grab a real agent ID and property ID from the seeded DB
let adminAgentId: string;
let regularAgentId: string;
let propertyId: string;

beforeAll(async () => {
  const adminAgent = await prisma.agent.findFirst({
    where: { is_admin: true },
  });
  const regularAgent = await prisma.agent.findFirst({
    where: { is_admin: false },
  });
  const property = await prisma.property.findFirst();

  if (!adminAgent || !regularAgent || !property) {
    throw new Error("Seed data missing — run npm run db:seed first");
  }

  adminAgentId = adminAgent.id;
  regularAgentId = regularAgent.id;
  propertyId = property.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});


describe("GET /listings", () => {
  it("returns a paginated list of listings", async () => {
    const res = await request(app).get("/listings");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("items");
    expect(res.body.data).toHaveProperty("total");
    expect(res.body.data).toHaveProperty("page");
    expect(res.body.data).toHaveProperty("limit");
    expect(res.body.data).toHaveProperty("totalPages");
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });

  it("filters listings by suburb (case-insensitive)", async () => {
    const res = await request(app).get("/listings?suburb=northside");

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);

    for (const item of res.body.data.items) {
      expect(item.suburb.toLowerCase()).toBe("northside");
    }
  });

  it("filters listings by price range", async () => {
    const res = await request(app).get(
      "/listings?price_min=500000&price_max=900000"
    );

    expect(res.status).toBe(200);

    for (const item of res.body.data.items) {
      expect(item.price).toBeGreaterThanOrEqual(500000);
      expect(item.price).toBeLessThanOrEqual(900000);
    }
  });

  it("filters listings by property type", async () => {
    const res = await request(app).get("/listings?property_type=HOUSE");

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);

    for (const item of res.body.data.items) {
      expect(item.property_type).toBe("HOUSE");
    }
  });

  it("respects pagination — page and limit", async () => {
    const res = await request(app).get("/listings?page=1&limit=3");

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeLessThanOrEqual(3);
    expect(res.body.data.page).toBe(1);
    expect(res.body.data.limit).toBe(3);
  });

  it("searches by keyword in title or description", async () => {
    const res = await request(app).get("/listings?keyword=pool");

    expect(res.status).toBe(200);
    // At least one result should contain 'pool' in title or description
    if (res.body.data.items.length > 0) {
      const hasKeyword = res.body.data.items.some(
        (item: { title: string; description: string }) =>
          item.title.toLowerCase().includes("pool") ||
          item.description.toLowerCase().includes("pool")
      );
      expect(hasKeyword).toBe(true);
    }
  });
});

// ─── Test Suite 2: Role-based access ─────────────────────────────────────────

describe("Role-based access — internal_status field", () => {
  it("hides internal_status from unauthenticated users", async () => {
    const res = await request(app).get("/listings");

    expect(res.status).toBe(200);
    for (const item of res.body.data.items) {
      expect(item).not.toHaveProperty("internal_status");
    }
  });

  it("hides internal_status from regular (non-admin) agents", async () => {
    const res = await request(app)
      .get("/listings")
      .set("x-agent-id", regularAgentId);

    expect(res.status).toBe(200);
    for (const item of res.body.data.items) {
      expect(item).not.toHaveProperty("internal_status");
    }
  });

  it("exposes internal_status to admin agents", async () => {
    const res = await request(app)
      .get("/listings")
      .set("x-agent-id", adminAgentId);

    expect(res.status).toBe(200);
    expect(res.body.data.items.length).toBeGreaterThan(0);

    for (const item of res.body.data.items) {
      expect(item).toHaveProperty("internal_status");
    }
  });
});

// ─── Test Suite 3: GET /listings/:id ─────────────────────────────────────────

describe("GET /listings/:id", () => {
  it("returns a single listing by ID", async () => {
    const res = await request(app).get(`/listings/${propertyId}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id", propertyId);
    expect(res.body.data).toHaveProperty("title");
    expect(res.body.data).toHaveProperty("price");
    expect(res.body.data).toHaveProperty("agent");
  });

  it("returns 404 for a non-existent listing ID", async () => {
    const fakeId = "00000000-0000-0000-0000-000000000000";
    const res = await request(app).get(`/listings/${fakeId}`);

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("includes internal_status on detail page for admin", async () => {
    const res = await request(app)
      .get(`/listings/${propertyId}`)
      .set("x-agent-id", adminAgentId);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("internal_status");
  });

  it("excludes internal_status on detail page for guests", async () => {
    const res = await request(app).get(`/listings/${propertyId}`);

    expect(res.status).toBe(200);
    expect(res.body.data).not.toHaveProperty("internal_status");
  });
});