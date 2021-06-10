const { getTrips, getDriver, getVehicle } = require('api');

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here
  let journeys = await getTrips();
  let final = [];
  let driversID = [];
  for(let i =0; i < journeys.length; i++){
  driversID.push(journeys[i].driverID)
  };
  let filteredID = new Set(driversID);
  let workingDriverID = [];
  // let shade = {a: 1, b: 2, c: 5}
  // let newArr = Array.from(filteredID); newArr
  filteredID.forEach(item => workingDriverID.push(item));
  
  
  for(let i =0; i< workingDriverID.length; i++){
          let journey = [];
          let driverEarningTotal = 0;
          let totalCashAmount= 0;
          let totalNonCashAmount= 0;
          let cashTripsCount = 0;
          let nonCashTripsCount = 0;
          let count = 0;
          let vehicles = [];
          let returnedDriver = {};
          let driversHolder = [];
          journeys.forEach( (item) => {
            let earnings = 0
            earnings += Number(`${item.billedAmount}`.split(",").join(""));
            if (item.driverID == workingDriverID[i]) {
              driverEarningTotal += earnings;
              journey.push({
                user: item.user.name,
                created: item.created,
                pickup: item.pickup.address,
                destination: item.destination.address,
                billed: earnings,
                isCash: item.isCash,
              });
              count++;
            }
            if (item.isCash) {
              cashTripsCount++;
              totalCashAmount += earnings;
            } else {
              nonCashTripsCount++;
              totalNonCashAmount += earnings;
            }
          });
        try{
            let currentDriver = await getDriver(workingDriverID[i]);
            currentDriver.id = workingDriverID[i];
            returnedDriver.name = currentDriver.name;
            returnedDriver.phone = currentDriver.phone;
            driversHolder.push(currentDriver);
            for(let j = 0; j < currentDriver.vehicleID.length; j++){
            
              let vehicleFetch = await getVehicle(currentDriver.vehicleID[j]);
              let emptyObj = {};
              emptyObj.plate= vehicleFetch.plate,
              emptyObj.manufacturer= vehicleFetch.manufacturer;
              vehicles.push(emptyObj);
            }
        }catch(err){
        
        }
      final[i] = {};
      if(returnedDriver.hasOwnProperty("name")){
      final[i].fullname = returnedDriver.name;
      final[i].phone = returnedDriver.phone;
      };
      final[i].id = workingDriverID[i];
      final[i].vehicles = vehicles;
      final[i].noOfTrips = count;
      final[i].noOfCashTrips = cashTripsCount;
      final[i].noOfNonCashTrips = nonCashTripsCount;
      final[i].trips = journey;
      final[i].totalAmountEarned = Number(driverEarningTotal.toFixed(2));
      final[i].totalCashAmount = Number(totalCashAmount.toFixed(2));
      final[i].totalNonCashAmount = Number(totalNonCashAmount.toFixed(2));
      
    }
    final
    workingDriverID
}
driverReport()
module.exports = driverReport;
