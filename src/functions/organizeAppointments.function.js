module.exports = {
  organizeAppointments(itemA, itemB){
    if (itemA.time < itemB.time)
    return -1;
    if (itemA.time > itemB.time)
      return 1;
    return 0;
  }
};