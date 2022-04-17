const express = require("express");

const routes = express.Router();

const Attendance = require("./controllers/attendance.controller")

routes.get("/", Attendance.index);
routes.get("/api/agendamento", Attendance.listAppointmentByDay);
routes.post("/api/cadastro", Attendance.createAttendance);
routes.put("/api/editar/:id", Attendance.editAttendance)

module.exports = routes;