import React from 'react';
import {View, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateTimePick = props => {
  const {show, setShow, date, setDate} = props;

  const onChange = selectedDate => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShow(false);
  };

  const hideDatePicker = () => {
    setShow(false);
  };

  return (
    <View style={[styles.screen]}>
      {show && (
        <DateTimePickerModal
          isVisible={show}
          mode={'date'}
          date={date}
          onConfirm={onChange}
          onCancel={hideDatePicker}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default DateTimePick;
