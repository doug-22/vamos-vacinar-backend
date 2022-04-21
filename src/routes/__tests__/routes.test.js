const request = require("supertest");
const app = require("../../../app");

describe("Testing api routes", () => {

  it("should be able return empty database", async () => {
    const res = await request(app).get("/");

    expect(res.body).toEqual([]);
  });

  it("should be able create attendance", async () => {
    const res = await request(app)
      .post("/api/cadastro")
      .send({
        name: "Douglas Aguiar Oliveira",
        birthDate: "1998-10-31",
        dateAppointment: "2022-04-22",
        time: "08:00",
        vaccinated: false
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBeFalsy;
  });

  it("should be able return the database with one register", async () => {
    const res = await request(app).get("/");
    res.body.map(item => (
      expect(item).toHaveProperty("id"),
      expect(item.attendanceData.length).toBeGreaterThanOrEqual(1),
      item.attendanceData.map(attendance => (
        expect(attendance).toHaveProperty("id")
      ))
    ))
  });
})