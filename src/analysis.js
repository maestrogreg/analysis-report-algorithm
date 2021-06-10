const { getTrips, getDriver, getVehicle } = require('api');
//const drivers = require('api/data/drivers')

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
let fixer = (value) => Number(value.toFixed(2));

async function analysis() {
  let trips = await getTrips();
  let drivers = []
  let noOfCashTrips = 0;
  let noOfNonCashTrips = 0;
  let cashBilledTotal = 0;
  let nonCashBilledTotal = 0;
  let billedTotal = 0;
  let driverList = [];
  let noOfDriversWithMoreThanOneVehicle =  0;
   
  //Get drivers ID from all trips
  drivers = trips.map( driver => driver.driverID);
  drivers = new Set(drivers);
  
  let array = [];
  drivers.forEach((item) => array.push(item))

  let promiser = [];
   for(element of array){
      promiser.push(getDriver(element));
   }
   
   let settled = await Promise.allSettled(promiser);
   settled
   settledFilter = settled.filter((item) => item.status === "fulfilled");
   
   for(let i= 0; i < settledFilter.length; i++){
      let driver = settled[i].value;    
      driverList.push(driver);
      driver.id = array[i];
      
        if(driver.vehicleID.length > 1){
          noOfDriversWithMoreThanOneVehicle++;
          
        }

      
   }
  for(let i = 0; i < trips.length; i++){
    billedTotal += Number(trips[i].billedAmount.toString().replace(/,/g, ''));
    if(trips[i].isCash){
         noOfCashTrips++;
         cashBilledTotal += Number(trips[i].billedAmount.toString().replace(/,/g, ''));
    }else{
      noOfNonCashTrips++;
      nonCashBilledTotal += Number(trips[i].billedAmount.toString().replace(/,/g, ''));
    }
  }
  //Return the value to two decimal places
  nonCashBilledTotal = Number(nonCashBilledTotal.toFixed(2));
  billedTotal = Number(billedTotal.toFixed(2));
  
  //get the most traveled driver
  let tripID = []
  for(let i =0; i < trips.length; i++){
    tripID.push(trips[i].driverID);
  }
  let maxAppearingID = 0;
  let holderObject = {};
  let maxCount = 0;
 //create element for each driver ID and count their trips to get highest appearing 
  for(let id of tripID){
    if(!holderObject[id]){
       holderObject[id] = 1;
    }else{
      holderObject[id]++;
    }
    if (holderObject[id] >= maxCount) {
      maxAppearingID = id;
      maxCount = holderObject[id];
    }
  }
maxCount
maxAppearingID
tripID
  //calculate highest earning driver
 let holder ={};
  for(let i =0; i < trips.length; i++){
    let amount = trips[i].billedAmount.toString().replace(/,/g, '');
    amount = Number(amount);
    let id = trips[i].driverID;
      if(holder.hasOwnProperty(id)){
          holder[id] += amount;
      }else{
        holder[id] = amount;
      }
  }


  //create an array from returned object holding the ID's and cash earned
  let holderEntries = Object.entries(holder);
  let sortedEntries = holderEntries.sort((item1, item2) => item2[1] - item1[1]);
  let highestEarningDriverID = sortedEntries[0][0];
  let highestEarningDriverMoney = sortedEntries[0][1];
  holder
  //get an array for the driver with the most travels
  let highestTraveledDriver = driverList.filter(
    (items) => items.id == maxAppearingID
  );
  
//get details of highest earning driver
    let highestEarning = driverList.filter((item) => item.id == highestEarningDriverID);
   driverList
//add number trips of highest earning driver
     let noTravels = 0
    for (let index = 0; index < trips.length; index++) {
        if(trips[index].driverID == highestEarningDriverID){
          noTravels++
        }
    }
  //get the earnings of highest traveled driver
  let highestTraveler = trips.filter((item) => item.driverID == maxAppearingID);
  let earningOfHighestTraveler = 0;
  for(let i = 0; i < highestTraveler.length; i++ ){
    earningOfHighestTraveler += Number(highestTraveler[i].billedAmount.toString().replace(/,/g, ''));
  }
  
  let output = {
    "mostTripsByDriver": {
    },
    "highestEarningDriver": {
    }
  }
  
  output.noOfCashTrips = noOfCashTrips,
  output.noOfNonCashTrips = noOfNonCashTrips,
  output.cashBilledTotal = cashBilledTotal;
  output.nonCashBilledTotal = nonCashBilledTotal;
  output.billedTotal = billedTotal;
  output.noOfDriversWithMoreThanOneVehicle = noOfDriversWithMoreThanOneVehicle;
  output.mostTripsByDriver.name =  highestTraveledDriver[0].name;
  output.mostTripsByDriver.email =  highestTraveledDriver[0].email;
  output.mostTripsByDriver.phone =  highestTraveledDriver[0].phone;
  output.mostTripsByDriver.noOfTrips = maxCount; 
  output.mostTripsByDriver.totalAmountEarned = earningOfHighestTraveler; 
  output.highestEarningDriver.name = highestEarning[0].name;
  output.highestEarningDriver.email = highestEarning[0].email;
  output.highestEarningDriver.phone = highestEarning[0].phone;
  output.highestEarningDriver.noOfTrips = noTravels;
  output.highestEarningDriver.totalAmountEarned = highestEarningDriverMoney;
  output
  return output
}
 analysis();

module.exports = analysis;
