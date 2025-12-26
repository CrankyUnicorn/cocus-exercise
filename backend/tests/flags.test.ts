import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/prisma";

describe("FeatureFlags API", () => {
  beforeAll(async () => {
    await prisma.featureFlag.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  let flagId: string;

  it("should create a flag and enforce unique key", async () => {
    const res1 = await request(app).post("/flags").send({
      key: "new_checkout",
      description: "Test flag",
      enabled: true,
      rolloutPercentage: 50,
    });

    expect(res1.status).toBe(201);
    flagId = res1.body.id;

    const res2 = await request(app).post("/flags").send({
      key: "new_checkout",
      description: "Duplicate key",
      enabled: false,
      rolloutPercentage: 10,
    });

    expect(res2.status).toBe(409);
    expect(res2.body.error).toMatch(/already exists/);
  });

  it("should update rolloutPercentage with validation", async () => {
    const res = await request(app).patch(`/flags/${flagId}`).send({
      rolloutPercentage: 120, // invalid
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/must be less than or equal to 100/);
  });

  it("should deterministically evaluate a flag", async () => {
    const userId = "user123";

    const res1 = await request(app)
      .get("/flags/evaluate")
      .query({ key: "new_checkout", userId });

    const res2 = await request(app)
      .get("/flags/evaluate")
      .query({ key: "new_checkout", userId });

    expect(res1.body.active).toBe(res2.body.active); // deterministic
  });
});
