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

  it("should be able to edit a appointment", async () => {
    //Fetching the id of an appointment
    const attendance = await request(app).get("/");
    let id;
    attendance.body.map(item => (
      expect(item).toHaveProperty("id"),
      expect(item.attendanceData.length).toBeGreaterThanOrEqual(1),
      item.attendanceData.map(attendance => (
        id = attendance.id
      ))
    ))
    //-----

    const res = await request(app)
      .put(`/api/editar/${id}`)
      .send({
        vaccinated: true
      });

    expect(res.body).toHaveProperty("id");
    expect(res.body.vaccinated).toBeTruthy;
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

  it("should be able to return an error if you try to register more than twenty appointments on the same day", async() => {
    //Registering all twenty appointments on 25-04-2022
    await request(app)
    .post("/api/cadastro")
    .send({ name: "João da Silva", birthDate: "1998-09-16", dateAppointment: "2022-04-25", time: "07:00",vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "José da Silva", birthDate: "1998-09-19", dateAppointment: "2022-04-25", time: "07:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Ayrton Sena", birthDate: "1998-09-02", dateAppointment: "2022-04-25", time: "09:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Fausto Silva", birthDate: "1998-07-05", dateAppointment: "2022-04-25", time: "09:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Gabriel Barbosa", birthDate: "1998-03-05", dateAppointment: "2022-04-25", time: "14:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Paulo Sousa", birthDate: "1998-07-05", dateAppointment: "2022-04-25", time: "14:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Lewis Hamilton", birthDate: "1998-04-23", dateAppointment: "2022-04-25", time: "16:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Sheldon Cooper", birthDate: "1998-07-05", dateAppointment: "2022-04-25", time: "16:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Galvão Bueno", birthDate: "1997-07-05", dateAppointment: "2022-04-25", time: "15:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Caio Ribeiro", birthDate: "1997-07-19", dateAppointment: "2022-04-25", time: "15:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "André Marques", birthDate: "1995-07-05", dateAppointment: "2022-04-25", time: "10:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "David Luiz", birthDate: "1995-02-05", dateAppointment: "2022-04-25", time: "10:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Alvo Dumbledore", birthDate: "1998-07-05", dateAppointment: "2022-04-25", time: "17:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Harry Potter", birthDate: "1992-07-05", dateAppointment: "2022-04-25", time: "17:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Lígia Gomes", birthDate: "1997-12-23", dateAppointment: "2022-04-25", time: "11:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Sarah Afonso", birthDate: "1997-07-05", dateAppointment: "2022-04-25", time: "11:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Tony Stark", birthDate: "1992-07-05", dateAppointment: "2022-04-25", time: "13:00", vaccinated: false });
    await request(app)
    .post("/api/cadastro")
    .send({ name: "Peter Parker", birthDate: "1992-07-05", dateAppointment: "2022-04-25", time: "13:00", vaccinated: false });
    //-------

    const res = await request(app)
      .post("/api/cadastro")
      .send({
        name: "Beltrano Santos Teste",
        birthDate: "1993-07-05",
        dateAppointment: "2022-04-25",
        time: "10:00",
        vaccinated: false
      });
      
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBeTruthy;
  });

  it("should be able to delete attendances", async () => {
    const res = await request(app)
      .delete("/api/deletar_agendamentos?dia=25-04-2022");

    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBeFalsy;
  });

  it("should be able to return an error if trying to delete unregistered appointments", async () => {
    const res = await request(app)
      .delete("/api/deletar_agendamentos?dia=25-04-2022");

    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toBeTruthy;
  });
});