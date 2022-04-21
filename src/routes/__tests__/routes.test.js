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
        dateAppointment: "2022-04-25",
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

  it("should be able to return the dates of registered appointments", async () => {
    const res = await request(app).get("/api/agendamento");

    expect(res.body.dates.length).toBeGreaterThanOrEqual(1);
    expect(res.body.message).toBe("Estas são as datas com agendamentos")
  });

  it("should be able return the attendances by date", async () => {
    const res = await request(app)
      .get("/api/agendamento?dia=25-04-2022");
  
    expect(res.body).toHaveProperty("id");
    expect(res.body.date).toEqual("25-04-2022");
    expect(res.body.attendanceData.length).toBeGreaterThanOrEqual(1);
  });

  it("should be able to return an error if you try to register more than two appointments for the same day and time", async () => {
    await request(app)
      .post("/api/cadastro")
      .send({
        name: "Fulado da Silva",
        birthDate: "1998-09-15",
        dateAppointment: "2022-04-25",
        time: "08:00",
        vaccinated: false
      });
    
    const res = await request(app)
      .post("/api/cadastro")
      .send({
        name: "Ciclano Santos",
        birthDate: "1998-06-20",
        dateAppointment: "2022-04-25",
        time: "08:00",
        vaccinated: false
    });

    expect(res.body.error).toBeTruthy;
  });
});