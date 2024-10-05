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

export const dateFormat = (value) => moment(value).format('DD/MM/YY');

export const dateTimeFormat = (value) => moment(value).format('DD/MM/YY hh:mm A');

export const currentStamp = (value) => moment(value).valueOf();

export const timeAgo = (timestamp) => {
  // Create a moment object from the timestamp
  const time = moment(timestamp);

  // Use moment's fromNow function to get a human-readable string
  return time.fromNow();
}

export const currencyFormat = (value, fraction = 0) => {
  const formatter = createCurrencyFormatter(fraction);
  return `${!isNaN(value) ? formatter.format(parseFloat(value)) : 0} /-`;
};

export const interestFormat = (value, fraction = 0) => {
  const formatter = createCurrencyFormatter(fraction);
  return `${formatter.format(parseFloat(value))} / ₹100`;
};

let lastValue = 0;
export const currencyInput = (value) => {
  if (!value) return '';

  let minimumFractionDigits = 0;
  const digit = value.toString().split('.');
  const lastDigit = lastValue.toString().split('.');

  if (digit.length === 2) {
    if (value === lastValue) minimumFractionDigits = 1;
    if (value !== lastValue && lastDigit.length === 1) minimumFractionDigits = 1;
    if (value !== lastValue && lastDigit.length === 2) minimumFractionDigits = digit[1].length;
  }

  const formatter = createCurrencyFormatter(minimumFractionDigits);
  if (digit.length > 1 && digit[1].length === 0) {
    value = digit[0];
  }

  lastValue = formatter.format(value);
  return lastValue;
};

export const dayCount = (value) => {
  const start_date = moment(value).startOf('day');
  const today = moment().startOf('day');
  return today.diff(start_date, 'days');
};
