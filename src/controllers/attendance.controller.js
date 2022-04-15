const { v4: uuidv4 } = require("uuid");
const Compare = require("../functions/compare.function");

const attendance = require("../models/attendance.model");
const database = require("../config/database");
const arrayDates = require("../utils/arrayDates.util");
let arrayAttendances = require("../utils/arrayAttendances.util");
const day = require("../models/day.model");


module.exports = {
  createAttendence(req, res) {
    const {name, birthDate, dateAppointment, time, vaccinated} = req.body;
  
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
            if(item.attendanceData.length < 20){
              item.attendanceData.push(newAttendance);
              item.attendanceData.sort(Compare.compare);
            }else{
              return res.status(400).json({
                error: true,
                message: "Error: Vacancy limit reached, try another date!"
              })
            }
          }
        //if not include, its a new day with new attendances
        }else{
          //add appointment date to date list
          arrayDates.push(dateAppointment)
          //create a new day of attendances, with the date and new attendances list
          const newDay = Object.create(day)
          arrayAttendances = [];
          newDay.date = dateAppointment;
          arrayAttendances.push(newAttendance);
          arrayAttendances.sort(Compare.compare);
          newDay.attendanceData = arrayAttendances;
          //add to database the new day
          database.push(newDay);
        }
      })
    }
    return res.status(200).json({
      error: false,
      message: "Vaccination successfully registered"
    });
  }
}

