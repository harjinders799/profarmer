import moment from 'moment';

export const dateFormat = value => {
  return moment(value).format('DD/MM/YY');
};
export const dateTimeFormat = value => {
  return moment(value).format('DD/MM/YY hh:mm A');
};
export const currentStamp = value => {
  return moment(value).valueOf();
};

export const currencyFormat = (value, fraction = 0) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fraction,
  });
  return `${formatter.format(parseFloat(value))} /-`;
};

export const interestFormat = (value, fraction = 0) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: fraction,
  });
  return `${formatter.format(parseFloat(value))} / ₹100`;
};

let lastValue = 0;
export const currencyInput = value => {
  if (!value) return '';
  let minimumFractionDigits = 0;
  let digit = value.toString().split('.');
  let lastDigit = lastValue.toString().split('.');
  if (digit.length == 2) {
    if (value == lastValue) minimumFractionDigits = 1;
    if (value != lastValue && lastDigit.length == 1) minimumFractionDigits = 1;
    if (value != lastValue && lastDigit.length == 2)
      minimumFractionDigits = digit[1].length;
  }
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits,
  });

  if (digit.length > 1) {
    if (digit[1].length == 0) {
      value = digit[0];
    }
  }
  lastValue = formatter.format(value);
  return lastValue;
};

export const dayCount = value => {
  let date = moment(value).format('YYYY-MM-DD');
  let start_date = moment(date);
  let today = moment();
  return today.diff(start_date, 'days');
};
