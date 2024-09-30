const express = require("express");

const routes = express.Router();

const Attendance = require("../controllers/attendance.controller")
const Thullo = require("../controllers/thullo.controller")

routes.get("/", Attendance.index);
routes.get("/api/agendamento", Attendance.listAppointmentByDay);
routes.post("/api/cadastro", Attendance.createAttendance);
routes.put("/api/editar/:id", Attendance.editAttendance);
routes.delete("/api/deletar_agendamentos", Attendance.deleteAttendance);
routes.post("/getaccesstoken", Attendance.getAccessToken);

routes.post("/api/thullo/login", Thullo.login);
routes.get("/api/thullo/user", Thullo.user);

module.exports = routes;