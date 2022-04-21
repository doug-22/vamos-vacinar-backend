const request = require("supertest");
const app = require("../../../app");

describe("Testing api routes", () => {
  it("should return database", async () => {
    const res = await request(app).get("/")

    expect(res.body).toEqual([])
  })
})