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
  return `${formatter.format(parseInt(value))} /-`;
};

export const currencyInput = value => {
  if (!value) return '';
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });
  return formatter.format(value.replace(/[^0-9]/g, ''));
};

export const dayCount = value => {
  let start_date = moment(value);
  let today = moment();
  return today.diff(start_date, 'days');
};
