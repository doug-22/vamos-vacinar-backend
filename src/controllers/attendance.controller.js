const { v4: uuidv4 } = require("uuid");
const axios = require('axios')
const Organize = require("../functions/organizeAppointments.function");

const attendance = require("../models/attendance.model");
const database = require("../config/database");
const arrayDates = require("../utils/arrayDates.util");
const day = require("../models/day.model");
require("dotenv").config();


module.exports = {
  index(req, res) {
    return res.json(database);
  },
  listAppointmentByDay(req, res) {
    const requestedDate = req.query.dia;
    if(arrayDates.includes(requestedDate)){
      database.map((value) => {
        if(value.date === requestedDate){
          res.json(value);
        }
      });
    }else{
      return res.json({
        message: "Estas são as datas com agendamentos",
        dates: arrayDates
      });
    }
  },
  createAttendance(req, res) {
    const name = req.body.name;
    const birthDate = req.body.birthDate.substr(0,10).split("-").reverse().join("-");
    const dateAppointment = req.body.dateAppointment.substr(0,10).split("-").reverse().join("-");
    const time = req.body.time;
    const vaccinated = req.body.vaccinated;
  
    //create a new attendance
    const newAttendance = Object.create(attendance);
    newAttendance.id = uuidv4();
    newAttendance.name = name;
    newAttendance.birthDate = birthDate;
    newAttendance.dateAppointment = dateAppointment;
    newAttendance.time = time;
    newAttendance.vaccinated = vaccinated;

    //check if date list includes the date appointment
    if(arrayDates.includes(dateAppointment)){
      //maps the database
      database.map((item) => {
        //if the date exists and is equal to the registered date, add a new attendance to the list of attendances
        if(item.date === dateAppointment){
          //check if reached number of vacancies
          if(!(item.attendanceData.length < 20)){
            return res.status(400).json({
              error: true,
              message: "Error: Vacancy limit reached, try another date!"
              });
          }else{
            //Checks if the number of appointments for the requested time has been reached
            const countOccurrences = Organize.countOccurrences(item.attendanceTimes, newAttendance.time);
            if(countOccurrences === 2){
              res.status(400).json({
                error: true,
                message: "Error: Appointments limit for selected time reached!"
              });
            }else{
              item.attendanceData.push(newAttendance);
              item.attendanceData.sort(Organize.organizeAppointments);
              item.attendanceTimes.push(newAttendance.time);
  
              res.status(200).json({
                error: false,
                message: "Vaccination successfully registered!"
              })
            };
          }
        }
      })
    //if not include, its a new day with new attendances
    }else{
      //add appointment date to date list
      arrayDates.push(dateAppointment);
      //create a new day of attendances, with the date and attendances list
      const newDay = Object.create(day);
      newDay.id = uuidv4();
      newDay.date = dateAppointment;
      let arrayAttendances = [];
      let arrayTimes = [];
      arrayTimes.push(newAttendance.time);
      arrayAttendances.push(newAttendance);
      newDay.attendanceData = arrayAttendances;
      newDay.attendanceTimes = arrayTimes;
      //add to database
      database.push(newDay)

      res.status(200).json({
        error: false,
        message: "Vaccination successfully registered!"
      });
    }
  },
  editAttendance(req, res) {
    const id = req.params.id;
    database.map((day) => {
      day.attendanceData.map((patient) => {
        if(patient.id === id){
          patient.vaccinated = req.body.vaccinated;
          return res.json(patient)
        }
      })
    })
  },
  deleteAttendance(req, res) {
    const day = req.query.dia;
    if(arrayDates.includes(day)){
      database.map((value, index) => {
        if(value.date === day){
          const indexInArrayDates = arrayDates.indexOf(day);
          database.splice(index, 1);
          arrayDates.splice(indexInArrayDates, 1);
          return res.status(200).json({
            error: false,
            message: "Os agendamentos selecionados foram deletados do banco de dados!"
          });
        }
      });
    }else{
      return res.status(400).json({
        error: true,
        message: "A data indicada não contém agendamentos!"
      });
    }
  },
  async getAccessToken(req, res) {
    try {
      const body = {
        code: req.body.code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
      }

      const response = await axios.post(
        process.env.URL_GITHUB,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const params = new URLSearchParams(response.data)
      const access_token = params.get('access_token')
      if(!access_token) {
        return res.status(400).json({
          message: "Código inválido!"
        })
      }
      return res.status(200).json({
        access_token: access_token
      })
    } catch (err) {
      return res.status(400).json({
        error: true,
        message: "Erro ao buscar token de acecsso!"
      });
    }
  }
}


