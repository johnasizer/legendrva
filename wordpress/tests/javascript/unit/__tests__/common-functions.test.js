const { calculatePaymentsForCheckout, calculateAverageMonthlyPrice, displayMonthlyAverage, getDailyRate, getNumberOfDaysInReservation, formatDate } = require('../../../../src/javascript/common-functions');

//Nightly rate  
const rate = '105.29';
  

  function prettyFormatDateObject(date) {
  
    // Extract the month, day, and year components from the Date object
    let month = date.getMonth() + 1; // Months are zero-based, so we add 1
    let day = date.getDate();
    let year = date.getFullYear();

    // Ensure that single-digit month and day values are zero-padded
    let formattedMonth = month < 10 ? '0' + month : month;
    let formattedDay = day < 10 ? '0' + day : day;

    // Construct the date string in "mm-dd-yyyy" format
    return formattedMonth + '-' + formattedDay + '-' + year;
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

  

  describe('Test for the total reservation cost header', () => {

    test('Test formatDate, take date in the 2024-05-01 format and transform it to mm dd (May 1)', () => {

      const checkInDate = '2024-04-01';
      const checkOutDate = '2024-05-01';

      expect(formatDate(checkInDate)).toBe('April 1');
      expect(formatDate(checkOutDate)).toBe('May 1');

    }),

    test('Test displayMonthlyAverage, return false, as the reservation is only for one month.', () => {

      const checkInDate = '2024-04-01';
      const checkOutDate = '2024-05-01';

      expect(displayMonthlyAverage(checkInDate, checkOutDate)).toBe(false);

    }),

    test('Test displayMonthlyAverage, return true, as the reservation duration exceeds one month.', () => {

      const checkInDate = '2024-04-01';
      const checkOutDate = '2024-05-02';

      expect(displayMonthlyAverage(checkInDate, checkOutDate)).toBe(true);

    }),

    test('Test getDailyRate positive test, 30 day reservation total reservation cost 3158.70.', () => {

      const numberOfDaysInReservation = '30';
      const totalReservationCost = '3158.70';

      expect(getDailyRate(numberOfDaysInReservation, totalReservationCost)).toBe(105.29);

    }),

    test('Test getDailyRate, positive test, 31 day reservation total reservation cost 3263.99.', () => {

      const numberOfDaysInReservation = '31';
      const totalReservationCost = '3263.99';

      expect(getDailyRate(numberOfDaysInReservation, totalReservationCost)).toBe(105.29);

    }),

    test('Test getDailyRate, positive test, 27 day reservation total reservation cost 2842.83.', () => {

      const numberOfDaysInReservation = '27';
      const totalReservationCost = '2842.83';

      expect(getDailyRate(numberOfDaysInReservation, totalReservationCost)).toBe(105.29);

    }),

    test('Test getDailyRate, positive test, 27 day reservation total reservation cost 2700.00.', () => {

      const numberOfDaysInReservation = '27';
      const totalReservationCost = '2700.00';

      expect(getDailyRate(numberOfDaysInReservation, totalReservationCost)).toBe(100.00);

    }),

    test('Test getNumberOfDaysInReservation, positive test for 30 day reservation', () => {

      const checkInDate = '2024-04-01';
      const checkOutDate = '2024-05-01';

      expect(getNumberOfDaysInReservation(checkInDate, checkOutDate)).toBe(30);

    }),
    test('Test getNumberOfDaysInReservation, positive test for 32 day reservation', () => {

      const checkInDate = '2024-04-01';
      const checkOutDate = '2024-05-03';;

      expect(getNumberOfDaysInReservation(checkInDate, checkOutDate)).toBe(32);

    }),
    test('Test getNumberOfDaysInReservation, positive test for 202 day reservation', () => {

      const checkInDate = '2024-03-03';
      const checkOutDate = '2024-09-21';;

      expect(getNumberOfDaysInReservation(checkInDate, checkOutDate)).toBe(202);

    }),

      test('Test calculateAverageMonthlyPrice for 1 month and 1 day stay, April 1 + May 2', () => {

        const checkInDate = '2024-04-01';
        const checkOutDate = '2024-05-02';
        const dailyRate = '105.29';
   

        expect(calculateAverageMonthlyPrice(checkInDate, checkOutDate, dailyRate)).toBe('$3,211.34');

      }),


      test('Test calculateAverageMonthlyPrice for 2 month stay, April 1 + June 1', () => {

        const checkInDate = '2024-04-01';
        const checkOutDate = '2024-06-01';
        const dailyRate = '105.29';
   

        expect(calculateAverageMonthlyPrice(checkInDate, checkOutDate, dailyRate)).toBe('$3,211.34');

      }),

      test('Test calculateAverageMonthlyPrice for 2 month and 1 day stay, April 1 + June 2', () => {

        const checkInDate = '2024-04-01';
        const checkOutDate = '2024-06-02';
        const dailyRate = '105.29';
   

        expect(calculateAverageMonthlyPrice(checkInDate, checkOutDate, dailyRate)).toBe('$3,193.79');

      }),

      test('Test calculateAverageMonthlyPrice cost calculation for 6 month stay, April 1 - Sept 10', () => {

        const checkInDate = '2024-04-01';
        const checkOutDate = '2024-09-10';
        const dailyRate = '105.29';
   

        expect(calculateAverageMonthlyPrice(checkInDate, checkOutDate, dailyRate)).toBe('$3,211.34');

      }),

      test('Test calculatePaymentsForCheckout payments for one month, April 1 - May 1', () => {

        const checkInDate = '2024-04-01';
        const checkOutDate = '2024-05-01';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);
        let date = new Date();
        date.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(date);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

      }),
      test('Test calculatePaymentsForCheckout payments for one month and one day, April 1 - May 2', () => {

        const checkInDate = '2024-04-01';
        const checkOutDate = '2024-05-02';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);
        
        let firstPaymentDueDate = new Date();
        firstPaymentDueDate.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(firstPaymentDueDate);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

        expect(payments[1].amount).toBe(105.29);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[1].dueDate)).toEqual('04-21-2024');
        expect(payments[1].isInitial).toEqual(false);
        expect(payments[1].isFinal).toEqual(true);
        expect(payments[1].isProrated).toEqual(true);

      }),
      
      test('Test calculatePaymentsForCheckout payments for one month and 24 days, April 1 - May 25', () => {

        const checkInDate = '2024-04-01';
        const checkOutDate = '2024-05-25';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);
        
        let firstPaymentDueDate = new Date();
        firstPaymentDueDate.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(firstPaymentDueDate);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

        expect(payments[1].amount).toBe(2526.96);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[1].dueDate)).toEqual('04-21-2024');
        expect(payments[1].isInitial).toEqual(false);
        expect(payments[1].isFinal).toEqual(true);
        expect(payments[1].isProrated).toEqual(true);

      }),
      
      test('Test calculatePaymentsForCheckout payments for 4 months and 6 days, April 6 - July 12', () => {

        const checkInDate = '2024-04-06';
        const checkOutDate = '2024-07-12';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);
        
        let firstPaymentDueDate = new Date();
        firstPaymentDueDate.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(firstPaymentDueDate);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

        expect(payments[1].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[1].dueDate)).toEqual('04-26-2024');
        expect(payments[1].isInitial).toEqual(false);
        expect(payments[1].isFinal).toEqual(false);
        expect(payments[1].isProrated).toEqual(false);

        expect(payments[2].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[2].dueDate)).toEqual('05-27-2024');
        expect(payments[2].isInitial).toEqual(false);
        expect(payments[2].isFinal).toEqual(false);
        expect(payments[2].isProrated).toEqual(false);

        expect(payments[3].amount).toBe(631.74);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[3].dueDate)).toEqual('06-26-2024');
        expect(payments[3].isInitial).toEqual(false);
        expect(payments[3].isFinal).toEqual(true);
        expect(payments[3].isProrated).toEqual(true);

      }),

      test('Test calculatePaymentsForCheckout payments for 4 months and 6 days, April 6 - July 2', () => {

        const checkInDate = '2024-04-06';
        const checkOutDate = '2024-07-2';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);
        
        let firstPaymentDueDate = new Date();
        firstPaymentDueDate.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(firstPaymentDueDate);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

        expect(payments[1].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[1].dueDate)).toEqual('04-26-2024');
        expect(payments[1].isInitial).toEqual(false);
        expect(payments[1].isFinal).toEqual(false);
        expect(payments[1].isProrated).toEqual(false);

        expect(payments[2].amount).toBe(2737.54);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[2].dueDate)).toEqual('05-27-2024');
        expect(payments[2].isInitial).toEqual(false);
        expect(payments[2].isFinal).toEqual(true);
        expect(payments[2].isProrated).toEqual(true);

      }),

      test('Test calculatePaymentsForCheckout payments for 4 months and 6 days, April 6 - Dec 6', () => {

        const checkInDate = '2024-04-06';
        const checkOutDate = '2024-12-06';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);
        
        let firstPaymentDueDate = new Date();
        firstPaymentDueDate.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(firstPaymentDueDate);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

        expect(payments[1].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[1].dueDate)).toEqual('04-26-2024');
        expect(payments[1].isInitial).toEqual(false);
        expect(payments[1].isFinal).toEqual(false);
        expect(payments[1].isProrated).toEqual(false);

        expect(payments[2].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[2].dueDate)).toEqual('05-27-2024');
        expect(payments[2].isInitial).toEqual(false);
        expect(payments[2].isFinal).toEqual(false);
        expect(payments[2].isProrated).toEqual(false);

        expect(payments[3].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[3].dueDate)).toEqual('06-26-2024');
        expect(payments[3].isInitial).toEqual(false);
        expect(payments[3].isFinal).toEqual(false);
        expect(payments[3].isProrated).toEqual(false);

        expect(payments[4].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[4].dueDate)).toEqual('07-27-2024');
        expect(payments[4].isInitial).toEqual(false);
        expect(payments[4].isFinal).toEqual(false);
        expect(payments[4].isProrated).toEqual(false);

        expect(payments[5].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[5].dueDate)).toEqual('08-27-2024');
        expect(payments[5].isInitial).toEqual(false);
        expect(payments[5].isFinal).toEqual(false);
        expect(payments[5].isProrated).toEqual(false);

        expect(payments[6].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[6].dueDate)).toEqual('09-26-2024');
        expect(payments[6].isInitial).toEqual(false);
        expect(payments[6].isFinal).toEqual(false);
        expect(payments[6].isProrated).toEqual(false);

        expect(payments[7].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[7].dueDate)).toEqual('10-27-2024');
        expect(payments[7].isInitial).toEqual(false);
        expect(payments[7].isFinal).toEqual(true);
        expect(payments[7].isProrated).toEqual(false);

      }),

      test('Test calculatePaymentsForCheckout payments for 4 months and 6 days, April 6 - Dec 12', () => {

        const checkInDate = '2024-04-06';
        const checkOutDate = '2024-12-12';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);
        
        let firstPaymentDueDate = new Date();
        firstPaymentDueDate.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(firstPaymentDueDate);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

        expect(payments[1].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[1].dueDate)).toEqual('04-26-2024');
        expect(payments[1].isInitial).toEqual(false);
        expect(payments[1].isFinal).toEqual(false);
        expect(payments[1].isProrated).toEqual(false);

        expect(payments[2].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[2].dueDate)).toEqual('05-27-2024');
        expect(payments[2].isInitial).toEqual(false);
        expect(payments[2].isFinal).toEqual(false);
        expect(payments[2].isProrated).toEqual(false);

        expect(payments[3].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[3].dueDate)).toEqual('06-26-2024');
        expect(payments[3].isInitial).toEqual(false);
        expect(payments[3].isFinal).toEqual(false);
        expect(payments[3].isProrated).toEqual(false);

        expect(payments[4].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[4].dueDate)).toEqual('07-27-2024');
        expect(payments[4].isInitial).toEqual(false);
        expect(payments[4].isFinal).toEqual(false);
        expect(payments[4].isProrated).toEqual(false);

        expect(payments[5].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[5].dueDate)).toEqual('08-27-2024');
        expect(payments[5].isInitial).toEqual(false);
        expect(payments[5].isFinal).toEqual(false);
        expect(payments[5].isProrated).toEqual(false);

        expect(payments[6].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[6].dueDate)).toEqual('09-26-2024');
        expect(payments[6].isInitial).toEqual(false);
        expect(payments[6].isFinal).toEqual(false);
        expect(payments[6].isProrated).toEqual(false);

        expect(payments[7].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[7].dueDate)).toEqual('10-27-2024');
        expect(payments[7].isInitial).toEqual(false);
        expect(payments[7].isFinal).toEqual(false);
        expect(payments[7].isProrated).toEqual(false);

        expect(payments[8].amount).toBe(631.74);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[8].dueDate)).toEqual('11-26-2024');
        expect(payments[8].isInitial).toEqual(false);
        expect(payments[8].isFinal).toEqual(true);
        expect(payments[8].isProrated).toEqual(true);

      }),


      test('Test calculatePaymentsForCheckout payments for 11 months and 19 days, April 6 - Feb 25 2025', () => {

        const checkInDate = '2024-04-06';
        const checkOutDate = '2025-02-25';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);

        console.log(payments.length);
        
        let firstPaymentDueDate = new Date();
        firstPaymentDueDate.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(firstPaymentDueDate);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

        expect(payments[1].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[1].dueDate)).toEqual('04-26-2024');
        expect(payments[1].isInitial).toEqual(false);
        expect(payments[1].isFinal).toEqual(false);
        expect(payments[1].isProrated).toEqual(false);

        expect(payments[2].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[2].dueDate)).toEqual('05-27-2024');
        expect(payments[2].isInitial).toEqual(false);
        expect(payments[2].isFinal).toEqual(false);
        expect(payments[2].isProrated).toEqual(false);

        expect(payments[3].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[3].dueDate)).toEqual('06-26-2024');
        expect(payments[3].isInitial).toEqual(false);
        expect(payments[3].isFinal).toEqual(false);
        expect(payments[3].isProrated).toEqual(false);

        expect(payments[4].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[4].dueDate)).toEqual('07-27-2024');
        expect(payments[4].isInitial).toEqual(false);
        expect(payments[4].isFinal).toEqual(false);
        expect(payments[4].isProrated).toEqual(false);

        expect(payments[5].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[5].dueDate)).toEqual('08-27-2024');
        expect(payments[5].isInitial).toEqual(false);
        expect(payments[5].isFinal).toEqual(false);
        expect(payments[5].isProrated).toEqual(false);

        expect(payments[6].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[6].dueDate)).toEqual('09-26-2024');
        expect(payments[6].isInitial).toEqual(false);
        expect(payments[6].isFinal).toEqual(false);
        expect(payments[6].isProrated).toEqual(false);

        expect(payments[7].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[7].dueDate)).toEqual('10-27-2024');
        expect(payments[7].isInitial).toEqual(false);
        expect(payments[7].isFinal).toEqual(false);
        expect(payments[7].isProrated).toEqual(false);

        expect(payments[8].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[8].dueDate)).toEqual('11-26-2024');
        expect(payments[8].isInitial).toEqual(false);
        expect(payments[8].isFinal).toEqual(false);
        expect(payments[8].isProrated).toEqual(false);

        expect(payments[9].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[9].dueDate)).toEqual('12-27-2024');
        expect(payments[9].isInitial).toEqual(false);
        expect(payments[9].isFinal).toEqual(false);
        expect(payments[9].isProrated).toEqual(false);


        expect(payments[10].amount).toBe(2000.51);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[10].dueDate)).toEqual('01-27-2025');
        expect(payments[10].isInitial).toEqual(false);
        expect(payments[10].isFinal).toEqual(true);
        expect(payments[10].isProrated).toEqual(true);

      }),

      test('Test calculatePaymentsForCheckout payments for 11 months and 19 days, April 6 - March 6 2025', () => {

        const checkInDate = '2024-04-06';
        const checkOutDate = '2025-03-06';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);

        console.log(payments.length);
        
        let firstPaymentDueDate = new Date();
        firstPaymentDueDate.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(firstPaymentDueDate);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

        expect(payments[1].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[1].dueDate)).toEqual('04-26-2024');
        expect(payments[1].isInitial).toEqual(false);
        expect(payments[1].isFinal).toEqual(false);
        expect(payments[1].isProrated).toEqual(false);

        expect(payments[2].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[2].dueDate)).toEqual('05-27-2024');
        expect(payments[2].isInitial).toEqual(false);
        expect(payments[2].isFinal).toEqual(false);
        expect(payments[2].isProrated).toEqual(false);

        expect(payments[3].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[3].dueDate)).toEqual('06-26-2024');
        expect(payments[3].isInitial).toEqual(false);
        expect(payments[3].isFinal).toEqual(false);
        expect(payments[3].isProrated).toEqual(false);

        expect(payments[4].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[4].dueDate)).toEqual('07-27-2024');
        expect(payments[4].isInitial).toEqual(false);
        expect(payments[4].isFinal).toEqual(false);
        expect(payments[4].isProrated).toEqual(false);

        expect(payments[5].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[5].dueDate)).toEqual('08-27-2024');
        expect(payments[5].isInitial).toEqual(false);
        expect(payments[5].isFinal).toEqual(false);
        expect(payments[5].isProrated).toEqual(false);

        expect(payments[6].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[6].dueDate)).toEqual('09-26-2024');
        expect(payments[6].isInitial).toEqual(false);
        expect(payments[6].isFinal).toEqual(false);
        expect(payments[6].isProrated).toEqual(false);

        expect(payments[7].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[7].dueDate)).toEqual('10-27-2024');
        expect(payments[7].isInitial).toEqual(false);
        expect(payments[7].isFinal).toEqual(false);
        expect(payments[7].isProrated).toEqual(false);

        expect(payments[8].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[8].dueDate)).toEqual('11-26-2024');
        expect(payments[8].isInitial).toEqual(false);
        expect(payments[8].isFinal).toEqual(false);
        expect(payments[8].isProrated).toEqual(false);

        expect(payments[9].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[9].dueDate)).toEqual('12-27-2024');
        expect(payments[9].isInitial).toEqual(false);
        expect(payments[9].isFinal).toEqual(false);
        expect(payments[9].isProrated).toEqual(false);

        expect(payments[10].amount).toBe(2948.12);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[10].dueDate)).toEqual('01-27-2025');
        expect(payments[10].isInitial).toEqual(false);
        expect(payments[10].isFinal).toEqual(true);
        expect(payments[10].isProrated).toEqual(false);

      }),

      test('Test calculatePaymentsForCheckout payments for 11 months and 19 days, April 6 - March 7 2025', () => {

        const checkInDate = '2024-04-06';
        const checkOutDate = '2025-03-07';
        const dailyRate = '105.29';
        
        const payments = calculatePaymentsForCheckout(checkInDate, checkOutDate, dailyRate);

        console.log(payments.length);
        
        let firstPaymentDueDate = new Date();
        firstPaymentDueDate.setUTCHours(12, 0, 0, 0);

        expect(payments[0].amount).toBe(3158.70);
        expect(payments[0].dueDate).toEqual(firstPaymentDueDate);
        expect(payments[0].isInitial).toEqual(true);
        expect(payments[0].isFinal).toEqual(false);
        expect(payments[0].isProrated).toEqual(false);

        expect(payments[1].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[1].dueDate)).toEqual('04-26-2024');
        expect(payments[1].isInitial).toEqual(false);
        expect(payments[1].isFinal).toEqual(false);
        expect(payments[1].isProrated).toEqual(false);

        expect(payments[2].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[2].dueDate)).toEqual('05-27-2024');
        expect(payments[2].isInitial).toEqual(false);
        expect(payments[2].isFinal).toEqual(false);
        expect(payments[2].isProrated).toEqual(false);

        expect(payments[3].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[3].dueDate)).toEqual('06-26-2024');
        expect(payments[3].isInitial).toEqual(false);
        expect(payments[3].isFinal).toEqual(false);
        expect(payments[3].isProrated).toEqual(false);

        expect(payments[4].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[4].dueDate)).toEqual('07-27-2024');
        expect(payments[4].isInitial).toEqual(false);
        expect(payments[4].isFinal).toEqual(false);
        expect(payments[4].isProrated).toEqual(false);

        expect(payments[5].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[5].dueDate)).toEqual('08-27-2024');
        expect(payments[5].isInitial).toEqual(false);
        expect(payments[5].isFinal).toEqual(false);
        expect(payments[5].isProrated).toEqual(false);

        expect(payments[6].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[6].dueDate)).toEqual('09-26-2024');
        expect(payments[6].isInitial).toEqual(false);
        expect(payments[6].isFinal).toEqual(false);
        expect(payments[6].isProrated).toEqual(false);

        expect(payments[7].amount).toBe(3158.70);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[7].dueDate)).toEqual('10-27-2024');
        expect(payments[7].isInitial).toEqual(false);
        expect(payments[7].isFinal).toEqual(false);
        expect(payments[7].isProrated).toEqual(false);

        expect(payments[8].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[8].dueDate)).toEqual('11-26-2024');
        expect(payments[8].isInitial).toEqual(false);
        expect(payments[8].isFinal).toEqual(false);
        expect(payments[8].isProrated).toEqual(false);

        expect(payments[9].amount).toBe(3263.99);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[9].dueDate)).toEqual('12-27-2024');
        expect(payments[9].isInitial).toEqual(false);
        expect(payments[9].isFinal).toEqual(false);
        expect(payments[9].isProrated).toEqual(false);

        expect(payments[10].amount).toBe(2948.12);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[10].dueDate)).toEqual('01-27-2025');
        expect(payments[10].isInitial).toEqual(false);
        expect(payments[10].isFinal).toEqual(false);
        expect(payments[10].isProrated).toEqual(false);

        expect(payments[11].amount).toBe(105.29);
        expect(transformDateFromMillisecondsToMMDDYYYY(payments[11].dueDate)).toEqual('02-24-2025');
        expect(payments[11].isInitial).toEqual(false);
        expect(payments[11].isFinal).toEqual(true);
        expect(payments[11].isProrated).toEqual(true);

      });

  });