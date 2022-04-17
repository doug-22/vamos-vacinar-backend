const { v4: uuidv4 } = require("uuid");
const Organize = require("../functions/organizeAppointments.function");

const attendance = require("../models/attendance.model");
const database = require("../config/database");
const arrayDates = require("../utils/arrayDates.util");
let arrayAttendances = require("../utils/arrayAttendances.util");
const day = require("../models/day.model");
const res = require("express/lib/response");


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
  
    //check if the database is empty
    if(database.length === 0){
      //add appointment date to date list
      arrayDates.push(dateAppointment);
      //create a new day of attendances, with the date and attendances list
      const newDay = Object.create(day);
      newDay.id = uuidv4();
      newDay.date = dateAppointment;
      arrayAttendances.push(newAttendance);
      newDay.attendanceData = arrayAttendances;
      //add to database
      database.push(newDay)
    
    //if database not empty
    }else{
      //maps the data
      database.map((item) => {
        //check if date list includes the date appointment
        if(arrayDates.includes(dateAppointment)){
          //if the date exists and is equal to the registered date, add a new attendance to the list of attendances
          if(item.date === dateAppointment){
            //check if reached number of vacancies
            if(!(item.attendanceData.length < 20)){
              return res.status(400).json({
                error: true,
                message: "Error: Vacancy limit reached, try another date!"
                });
            }else{
              item.attendanceData.push(newAttendance);
              item.attendanceData.sort(Organize.organizeAppointments);

              res.status(200).json({
                error: false,
                message: "Vaccination successfully registered"
              });
            }
          }
        //if not include, its a new day with new attendances
        }else{
          //add appointment date to date list
          arrayDates.push(dateAppointment)
          //create a new day of attendances, with the date and new attendances list
          const newDay = Object.create(day)
          arrayAttendances = [];
          newDay.id = uuidv4();
          newDay.date = dateAppointment;
          arrayAttendances.push(newAttendance);
          arrayAttendances.sort(Organize.organizeAppointments);
          newDay.attendanceData = arrayAttendances;
          //add to database the new day
          database.push(newDay);
        }
      })
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
  }
}

