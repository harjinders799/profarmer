import React from 'react';
import DatePicker from 'react-native-date-picker';

const DateTimePicker = ({
  date = new Date(),
  mode = 'date',
  setDate,
  show,
  setShow,
  ...props
}) => {
  return (
    <DatePicker
      modal
      mode={mode}
      open={show}
      date={date}
      onConfirm={date => {
        setShow(false);
        setDate(date);
      }}
      onCancel={() => {
        setShow(false);
      }}
      {...props}
    />
  );
};

export default DateTimePicker;
