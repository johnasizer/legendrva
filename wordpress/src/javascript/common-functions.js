module.exports = { calculatePaymentsForCheckout, calculateAverageMonthlyPrice, displayMonthlyAverage, getDailyRate, getNumberOfDaysInReservation};


function Payment(amount, dueDate, isInitial, isFinal, isProrated) {

    this.amount = amount;        
    this.dueDate = normalizeDateToUTC(dueDate);
    this.isInitial = isInitial;
    this.isFinal = isFinal;
    this.isProrated = isProrated;
}

function normalizeDateToUTC(date) {
   
     return new Date(date.setUTCHours(12, 0, 0, 0));

}

function calculateDaysDifference(startDate, endDate) {
    
    // Convert both dates to milliseconds
    const startMilliseconds = startDate.getTime();
    const endMilliseconds = endDate.getTime();

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = Math.abs(endMilliseconds - startMilliseconds);

    // Convert the difference to days
    const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

    return differenceInDays;
}

function calculatePaymentsForCheckout(checkinDate, checkoutDate, dailyRate) {
    
    const checkin = new Date(normalizeDateStringFromYYYYMMDD(checkinDate));
    const checkout = new Date(normalizeDateStringFromYYYYMMDD(checkoutDate));
    let payments = [];

    // Calculate the number of days between check-in and check-out dates
    const numberOfDays = calculateDaysDifference(checkin, checkout);

    // Reservation should not be for less than 30 days
    if (numberOfDays < 30) {
        console.log("Error: Check-in and check-out dates must be at least 30 days apart.");
        return "Error: Check-in and check-out dates must be at least 30 days apart.";
    }
    
    const numOfMonthsReservationSpans = calculateTotalMonths(checkin, checkout);

    // Find out if there is only one payment due
    const numOfDaysInCheckinMonth = getDaysInMonth(checkin);
				
     let initialPaymentAmount = numberOfDays > numOfDaysInCheckinMonth ? (numOfDaysInCheckinMonth) * dailyRate  : numberOfDays * dailyRate;
     let initialPayment = new Payment(initialPaymentAmount, new Date(), true, false, false);
     payments.push(initialPayment);
     
    if(numberOfDays === numOfDaysInCheckinMonth){
    	
        payments = formatPaymentAmounts(payments);
        return payments;

    }
   	
    if(numOfMonthsReservationSpans >= 2){
    	
       payments = calculateRemainingPayments(checkin, checkout, dailyRate, payments);     
       
    }
    
	return formatPaymentAmounts(payments);
  
}

// Function to go backwards one month on a Date object
function goBackOneMonth(date) {

    // Clone the original date to avoid mutating it
    const newDate = new Date(date);

    // Get the current month and year
    let month = newDate.getMonth();
    let year = newDate.getFullYear();

    // Handle the case where the current month is January
    if (month === 0) {
        // If the current month is January, go back to December of the previous year
        newDate.setFullYear(year - 1);
        newDate.setMonth(11); // December (zero-based index)
    } else {
        // Otherwise, simply go back one month
        newDate.setMonth(month - 1);
    }

    return newDate;
}

function advanceDate(date, numberOfDays) {
    // Clone the original date to avoid mutating it
    const newDate = new Date(date);

    // Get the current time value in milliseconds
    const currentTime = newDate.getTime();

    // Calculate the time value for the future date by adding the number of days in milliseconds
    const futureTime = currentTime + (numberOfDays * 24 * 60 * 60 * 1000);

    // Set the new time value to the Date object
    newDate.setTime(futureTime);

    return newDate;
}


function calculateRemainingPayments(checkinDate, checkoutDate, dailyRate, payments) {
  
  let normalizedCheckinDate = normalizeDateToUTC(checkinDate);
  let normalizedCheckoutDate = normalizeDateToUTC(checkoutDate);

  let currentBillingCycleStartDate = adjustDateObjectMonth(normalizedCheckinDate, true);
  currentBillingCycleStartDate = normalizeDateToUTC(currentBillingCycleStartDate);
  let paymentAmount = 0;
  let index = 1;

  while(currentBillingCycleStartDate.getTime() <= normalizedCheckoutDate.getTime()){
            
        let endOfCurrentBillingCycle = advanceDate(currentBillingCycleStartDate, getDaysInMonth(currentBillingCycleStartDate));
        
        //Get number of days in current month
        const numOfDaysInMonth = getDaysInMonth(currentBillingCycleStartDate);

        if(endOfCurrentBillingCycle > normalizedCheckoutDate) {

            //Find the billable days in the final billing cycle
            //The days between the checkout date and billing cycle end are not billable
            const billableDays =  calculateDaysDifference(normalizedCheckoutDate, currentBillingCycleStartDate);
            let isFinalPaymentProrated = false;

            paymentAmount = billableDays * dailyRate;

            if(billableDays < numOfDaysInMonth){
                
                isFinalPaymentProrated = true;
            }
            
            payments[index] =  new Payment(paymentAmount, adjustDueDate(currentBillingCycleStartDate), false, true, isFinalPaymentProrated);

            break;

        }else {
            
            paymentAmount = numOfDaysInMonth * dailyRate;
            payments[index++] =  new Payment(paymentAmount, adjustDueDate(currentBillingCycleStartDate), false, false, false);
            currentBillingCycleStartDate.setMonth(currentBillingCycleStartDate.getMonth() + 1);
            paymentAmount = 0;
        }

  }

  return payments;
}

function adjustDueDate(date){

    let paymentDueDate = new Date(date);
    paymentDueDate.setDate(paymentDueDate.getDate() - 10)
	
  return paymentDueDate;
}

//Final payment should be on the checkin day in the checkout - 10 days
function getFinalPaymentDate(checkin, checkout) {

	let checkoutDate = new Date(checkout);
    checkoutDate.setDate(checkin.getDate() - 10);
	return checkoutDate;
}

function adjustDateObjectMonth(date, forward){
	
	let adjustedDate =  new Date(date);
	
  if(forward){
    
         adjustedDate.setMonth(adjustedDate.getMonth() + 1);
    
    }else{
    
    		adjustedDate.setMonth(adjustedDate.getMonth() - 1);
    }

    return adjustedDate;
}

function calculateTotalMonths(checkin, checkout) {

    let currentBillingCycle = new Date(checkin);
    let numOfPaymentsDue = 0;
    
    while( currentBillingCycle < checkout){
          
        currentBillingCycle.setMonth(currentBillingCycle.getMonth() + 1);
        numOfPaymentsDue++;
    }
    
    return numOfPaymentsDue;
}

function getDaysInMonth(date) {
  
    if(!(date instanceof Date)){
        date = new Date(date)
    }

     // Get the year and month from the provided date
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Month is zero-based, so we add 1

    // Create a new Date object for the first day of the next month
    // This allows us to get the last day of the current month
    const nextMonthFirstDay = new Date(year, month, 1);

    // Subtract one day from the first day of the next month to get the last day of the current month
    const lastDayOfMonth = new Date(nextMonthFirstDay.getTime() - 1);

    // Get the day of the month from the last day of the current month
    const daysInMonth = lastDayOfMonth.getDate();

    return daysInMonth;
}


function isCheckInDayOnTheFirst(dateString) {
    
    let isCheckInDayOnTheFirst = false;
    // Parse the string date into a Date object
    const dateObject = new Date(dateString);
    
    // Extract the day as a number
    const day = dateObject.getDate();

    if (day === 1) {
        
        isCheckInDayOnTheFirst = true;

    }
    
    return isCheckInDayOnTheFirst;
}


function calculateLengthOfStay(checkInDate, checkOutDate) {
    
    // Convert string representations to Date objects
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    // Calculate the time difference in milliseconds
    const timeDifference = checkOut.getTime() - checkIn.getTime();
    
    // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
    const numberOfDays = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1;
    // Adding 1 to include the check-in day in the count
    
    return numberOfDays;
}

//functions in checkout page end


//functions in search results page begin

/**
 * Checks to see if the reservation duration is for greater than one month. Advances the check-in date by exactly one month and compares that to the check-out date.
 * If the check-out date is greater, then we know that the reservation duration is longer than 1 month.
 * 
 * 
 * Returns boolean
 * */
function displayMonthlyAverage(checkinDate, checkoutDate){
    
    let formattedCheckInDate = new Date(normalizeDateStringFromYYYYMMDD(checkinDate));
    let formattedCheckOutDate = new Date(normalizeDateStringFromYYYYMMDD(checkoutDate));
    let displayMonthlyAverage = false;

    //Move the date forward by one month. Example. May 1 -> June 1
    formattedCheckInDate.setMonth(formattedCheckInDate.getMonth() + 1);

    if(formattedCheckOutDate > formattedCheckInDate){

        displayMonthlyAverage = true;
        
    }
    
    return displayMonthlyAverage;
}


/*
*Return the price to be display for the unit. If the reservation duration is greater than one month, display the average cost per month for the booking.
*The average cost considers all the months included in the booking request. It multiplies all the days in each of those months by the daily rate. It then
*sums the cost of each of those months and divides by the number of months. 
*If the booking is for less than a month or for exactly a month will return nothing.
**/    
function calculateAverageMonthlyPrice (checkinDate, checkoutDate, dailyRate) {
    
    let paymentSum = 0;
    let formattedCheckInDate = normalizeDateStringFromYYYYMMDD(checkinDate);
    let formattedCheckOutDate = normalizeDateStringFromYYYYMMDD(checkoutDate);
    let payments = getMonthlyPaymentAmountsForBooking(formattedCheckInDate, formattedCheckOutDate, dailyRate);
    
    payments = formatPaymentAmounts(payments);
        
        
    payments.forEach((payment, index) => {
    
        paymentSum += parseFloat(payment.amount);
    }); 
         
    let averageMonthlyPayment = (paymentSum / payments.length);

    return formatNumberToUSCurrency(averageMonthlyPayment);
    
}

function formatPaymentAmounts(payments) {
    
    payments.forEach(payment => {
       
        payment.amount = Math.trunc(payment.amount * 100) / 100;
        
    });
    
    return payments;
    
}
    
function getMonthlyPaymentAmountsForBooking(checkinDate, checkoutDate, dailyRate) {
    let checkin = new Date(checkinDate);
    let checkout = new Date(checkoutDate);
    let payments = [];
	let finalPayment;

    
    // Calculate the number of days between check-in and check-out dates, including the check-in day
    const numberOfDaysInReservation = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24)) + 1;

    //Reservation should not be for less than 30 days
    if (numberOfDaysInReservation < 30) {
        console.log("Error: Check-in and check-out dates must be at least 30 days apart.");
        return "Error: Check-in and check-out dates must be at least 30 days apart.";
    }

    //find out if there is only one payment due
    const numOfDaysInCheckinMonth = getDaysInMonth(checkin);
				
    if(numberOfDaysInReservation <= numOfDaysInCheckinMonth){
    	
      	return payments;
    }
    	
    payments = getPaymentAmountsForReservation(checkin, checkout, dailyRate);     
    
    
  	return payments;
}

function getPaymentAmountsForReservation(checkinDate, checkoutDate, dailyRate) {
  
    // We will add one to getMonth which will skip ahead from the checkin month
    let paymentAmount = 0;
    let payments = [];
    let payment;
    let index = 0;
    checkinDate.setHours(10, 30, 0);
    checkoutDate.setHours(10, 30, 0);
    
    let monthlyPaymentCycleDate = new Date(checkinDate);
   
   
    while((monthlyPaymentCycleDate.getMonth() <= checkoutDate.getMonth() && monthlyPaymentCycleDate.getTime() !== checkoutDate.getTime())){
        
        paymentAmount = getDaysInMonth(monthlyPaymentCycleDate) * dailyRate;
        payment =  new Payment(paymentAmount, adjustDueDate(monthlyPaymentCycleDate), false, false, false);
        payments[index++] =  payment;
        monthlyPaymentCycleDate.setMonth(monthlyPaymentCycleDate.getMonth() + 1);
     
    }
    
    return payments;
  }


    
function getDailyRate(numberOfDaysInReservation, totalReservationCost){
 
    let dailyRate = totalReservationCost / numberOfDaysInReservation;
    
    // Round to the nearest 100th
    return Math.round(dailyRate * 100) / 100;
        
}

function getNumberOfDaysInReservation(checkinDate, checkoutDate){

    // Convert string representations to Date objects
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    
    // Calculate difference in milliseconds
    const differenceInMs = checkout.getTime() - checkin.getTime();
    
    // Convert difference to days
    const differenceInDays = Math.ceil(differenceInMs / (1000 * 60 * 60 * 24));
    
    return differenceInDays; 
    
}
    

//functions in search results page end



//functions in unit page begin
    
function getTotalDaysInReservation() {
        
    var spanElement = document.querySelector('.mphb-price-period');

    // Get the text content of the element
    var textContent = spanElement.textContent.trim();

    // Extract the numeric value
    var numOfDaysInReservation = textContent.match(/\d+/)[0];
        
    // Subtract one day from the reservation duration as the checkout date is not charged
    return parseInt(numOfDaysInReservation);
        
}

//Transforms a date in this format 11-28-1988 -> 11/28/1988
function standardizeDateFormatMmDdYYYY(inputDate) {
    // Split the input date string into parts
    const parts = inputDate.split('-');

    // Rearrange the parts to the desired format
    const formattedDate = parts[1] + '/' + parts[2] + '/' + parts[0];

    return formattedDate;
}

//Transforms a number into us currency ex. 1234.00 -> $1,234.00, returns a string
function formatNumberToUSCurrency(paymentAmount){
    
    const truncatedPaymentAmount = Math.trunc(paymentAmount * 100) / 100;
    return Number(truncatedPaymentAmount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
}


//Retrieves maximum concurrent users for current time
function getMax() {
    
    const currentTime = new Date();
    let min = 1, max = 0;
        
    if(fullCount(currentTime)) {
            
  	     max = ga4MaxUserCountPrime;
    }else {
  
  	    max = ga4MaxUserCountOffHours;
    }
	
    return Math.floor(Math.random() * (max - min + 1)) + min;

}

//Defines user activity count and times
function fullCount(currentTime) {
  
    // Define the time ranges for day and night
    var dayStart = parseTimeString("08:00"); 
    var dayEnd = parseTimeString("22:00");  

    if (currentTime >= dayStart && currentTime <= dayEnd) {
        
        return true;
        
    } else {
        
        return false;
    }
}


function parseTimeString(timeString) {
  
    var timeParts = timeString.split(':');
    var time = new Date();
    
    time.setHours(parseInt(timeParts[0], 10));
    time.setMinutes(parseInt(timeParts[1], 10));
    time.setSeconds(0);
    
    return time;
}
 
//Transforms a date from yyyy-mm-dd into mm-dd-yyyy
function normalizeDateStringFromYYYYMMDD(date) {
        
    let dateComponent = date.split('-');
    return dateComponent[1] + "-" + dateComponent[2] + "-" + dateComponent[0];
}

//Transforms a date object into a mm dd representation ex 12/25/2024 -> Dec 25    
function formatDateIntoMonthAndDay(date) {
        
    let formattedDateString = normalizeDateFromYYYYMMDD(date);
    let formattedDateObj = new Date(formattedDateString);
    return monthNames[formattedDateObj.getMonth()] + ' ' + formattedDateObj.getDate();
}
    
//Removes the decimal point from a us currency representation ex $125.00 -> $125
function formatReservationCost(reservationCost) {
 
    const reservationCostArray = reservationCost.split('.');
    return reservationCostArray[0];
}
    
    
function transformDateFromMillisecondsToMMDDYYYY(dateInMilliseconds) {

    let date = new Date(dateInMilliseconds);

    // Extract the month, day, and year components from the Date object
    let month = date.getMonth() + 1; // Months are zero-based, so we add 1
    let day = date.getDate();
    let year = date.getFullYear();

    // Ensure that single-digit month and day values are zero-padded
    let formattedMonth = month < 10 ? '0' + month : month;
    let formattedDay = day < 10 ? '0' + day : day;

    // Construct the date string in "MM-DD-YYYY" format
    return formattedMonth + '-' + formattedDay + '-' + year;
  }


    
    

    