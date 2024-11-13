// import moment from 'moment';

// export const dateFormat = value => {
//   return moment(value).format('DD/MM/YY');
// };
// export const dateTimeFormat = value => {
//   return moment(value).format('DD/MM/YY hh:mm A');
// };
// export const currentStamp = value => {
//   return moment(value).valueOf();
// };

// export const currencyFormat = (value, fraction = 0) => {
//   const formatter = new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits: fraction,
//   });
//   return `${!isNaN(value) ? formatter.format(parseFloat(value)) : 0} /-`;
// };

// export const interestFormat = (value, fraction = 0) => {
//   const formatter = new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits: fraction,
//   });
//   return `${formatter.format(parseFloat(value))} / ₹100`;
// };

// let lastValue = 0;
// export const currencyInput = value => {
//   if (!value) return '';
//   let minimumFractionDigits = 0;
//   let digit = value.toString().split('.');
//   let lastDigit = lastValue.toString().split('.');
//   if (digit.length == 2) {
//     if (value == lastValue) minimumFractionDigits = 1;
//     if (value != lastValue && lastDigit.length == 1) minimumFractionDigits = 1;
//     if (value != lastValue && lastDigit.length == 2)
//       minimumFractionDigits = digit[1].length;
//   }
//   const formatter = new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//     minimumFractionDigits,
//   });

//   if (digit.length > 1) {
//     if (digit[1].length == 0) {
//       value = digit[0];
//     }
//   }
//   lastValue = formatter.format(value);
//   return lastValue;
// };

// export const dayCount = value => {
//   let date = moment(value).format('YYYY-MM-DD');
//   let start_date = moment(date);
//   let today = moment();
//   return today.diff(start_date, 'days');
// };

import moment from 'moment';

// Helper function to create currency formatter
const createCurrencyFormatter = (fraction = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fraction,
  });

export const dateFormat = value => moment(value).format('DD/MM/YY');

export const dateTimeFormat = value => moment(value).format('DD/MM/YY - hh:mm A');

export const currentStamp = value => moment(value).valueOf();

export const timeAgo = timestamp => {
  // Create a moment object from the timestamp
  const time = moment(timestamp);

  // Use moment's fromNow function to get a human-readable string
  return time.fromNow();
};

export const currencyFormat = (value, fraction = 0) => {
  const formatter = createCurrencyFormatter(fraction);
  return `${!isNaN(value) && value ? formatter.format(parseFloat(value)) : '₹0'
    } /-`;
};

export const interestFormat = (value, fraction = 0) => {
  const formatter = createCurrencyFormatter(fraction);
  return `${formatter.format(parseFloat(value))} / ₹100`;
};

let lastValue = 0;
export const currencyInput = value => {
  if (!value) return '';

  let minimumFractionDigits = 0;
  const digit = value.toString().split('.');
  const lastDigit = lastValue.toString().split('.');

  if (digit.length === 2) {
    if (value === lastValue) minimumFractionDigits = 1;
    if (value !== lastValue && lastDigit.length === 1)
      minimumFractionDigits = 1;
    if (value !== lastValue && lastDigit.length === 2)
      minimumFractionDigits = digit[1].length;
  }

  const formatter = createCurrencyFormatter(minimumFractionDigits);
  if (digit.length > 1 && digit[1].length === 0) {
    value = digit[0];
  }

  lastValue = formatter.format(value);
  return lastValue;
};

export const dayCount = (value, value2) => {
  const start_date = moment(value).startOf('day');
  const end_date = value2
    ? moment(value2).startOf('day')
    : moment().startOf('day');
  return end_date.diff(start_date, 'days');
};

export const isSameDay = (value1, value2) => {
  const date1 = moment(value1).startOf('day');
  const date2 = moment(value2).startOf('day');
  return date1.isSame(date2);
};


// Function to get both the remaining time and the time passed
export function getTimeDetails(current, reminderDate) {
  // const targetTime = new Date(reminderDate).getTime(); // Convert reminderDate to timestamp (if it's a string)

  // // Calculate the difference using moment
  // const duration = moment.duration(moment(reminderDate) - moment(now));
  // const passedDuration = moment.duration(moment(now) - moment(reminderDate)); // Duration passed

  // if (duration.asMilliseconds() < 0) {
  //   // If the target time has already passed
  //   return {
  //     remaining: 'Time has passed',
  //     passed: formatTime(passedDuration),
  //   };
  // }

  // // Format the time remaining
  // const remaining = formatTime(duration);

  // return {
  //   remaining: remaining,
  //   passed: formatTime(passedDuration),
  // };
  const now = moment(current); // Get current time using moment

  const reminderTime = moment(reminderDate); // Convert reminderDate to moment object

  // Time remaining (future)
  const remaining = reminderTime.isAfter(now)
    ? reminderTime.fromNow() // Time remaining (e.g., "in 2 minutes", "in 3 hours")
    : false; // If the reminder date has passed

  // Time passed (past)
  const passed = reminderTime.isBefore(now)
    ? reminderTime.fromNow() // Time passed (e.g., "2 minutes ago", "1 day ago")
    : false; // If the reminder date is in the future

  return { remaining, passed };
}

// Helper function to format the duration into a human-readable string
function formatTime(duration) {
  if (duration.days() > 0) {
    return `${duration.days()} day${duration.days() > 1 ? 's' : ''}`;
  } else if (duration.hours() > 0) {
    return `${duration.hours()} hour${duration.hours() > 1 ? 's' : ''}`;
  } else if (duration.minutes() > 0) {
    return `${duration.minutes()} minute${duration.minutes() > 1 ? 's' : ''}`;
  } else if (duration.seconds() > 0) {
    return `${duration.seconds()} second${duration.seconds() > 1 ? 's' : ''}`;
  } else {
    return 'Less than a minute';
  }
}
