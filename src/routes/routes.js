const express = require("express");

const routes = express.Router();

const Attendance = require("../controllers/attendance.controller")

routes.get("/", Attendance.index);
routes.get("/api/agendamento", Attendance.listAppointmentByDay);
routes.post("/api/cadastro", Attendance.createAttendance);
routes.put("/api/editar/:id", Attendance.editAttendance);
routes.delete("/api/deletar_agendamentos", Attendance.deleteAttendance);
routes.post("/getaccesstoken", Attendance.getAccessToken);

module.exports = routes;