const express = require("express");

const routes = express.Router();

const Attendance = require("./controllers/attendance.controller")

routes.post("/api/cadastro", Attendance.createAttendence);

module.exports = routes;