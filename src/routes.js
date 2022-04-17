const express = require("express");

const routes = express.Router();

const Attendance = require("./controllers/attendance.controller")

// routes.get("/api/agendamentos", Attendance.index);
routes.post("/api/cadastro", Attendance.createAttendence);

module.exports = routes;