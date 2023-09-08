import moment from 'moment';

export const dateFormat = value => {
  return moment(value).format('DD/MM/YYYY');
};
export const currentStamp = value => {
  return moment(value).valueOf();
};

export const currencyFormat = value => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });
  return `${formatter.format(parseFloat(value))} /-`;
};

export const currencyInput = value => {
  if (!value) return '';
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });
  return formatter.format(value ? value.replace(/[^0-9]/g, '') : 0);
};

export const dayCount = value => {
  let date = moment(value).format("YYYY-MM-DD");
  let start_date = moment(date);
  let today = moment();
  return today.diff(start_date, 'days');
};
