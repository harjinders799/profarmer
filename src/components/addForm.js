import * as React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
// import DateTimePick from '../../components/DateTime'
// import Category from './category'
import {useTheme} from '@react-navigation/native';
import {useAuth} from 'src/context/context';
import Button from 'src/components/button';
import Input from 'src/components/input';
import Text from 'src/components/text';
import Category from './category';
import DateTimePick from 'src/components/DateTime';
import moment from 'moment';
import {dateFormat} from 'src/utils/dateformat';
import BaseView from 'src/container/base';
import {WIDTH} from 'src/utils/constant';
import Header from 'src/components/header';
import Profile from 'src/container/profile';
import Icon from 'src/components/icon';

export default function AddForm({navigation: {goBack}}) {
  const {user} = useAuth();
  const [data, setData] = React.useState({
    id: '',
    sender: '',
    receiver: '',
    reason: '',
    amount: '',
    category: '',
    type: '',
    date: moment.now(),
  });
  const [showDate, setShowDate] = React.useState(false);
  // const [catData, setCatData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const {colors} = useTheme();

  const {id, sender, receiver, reason, amount, category, type, date} = data;

  const onChangeValue = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const onPress = () => {};

  const AddNew = async () => {
    if (
      sender.trim() == '' ||
      receiver.trim() == '' ||
      type.trim() == '' ||
      amount.trim() == '' ||
      parseInt(amount) <= 0 ||
      category.trim() == ''
    ) {
      alert('Enter valid data!');
    } else {
      setLoading(true);
      let res = await createKhrach(data, user);
      setLoading(false);
      setData({
        id: '',
        sender: '',
        receiver: '',
        reason: '',
        amount: '',
        category: '',
        type: '',
        date: moment.now(),
      });
      // }
    }
  };

  const update = async () => {
    setLoading(true);
    // await updateKhrach(data, item?.key, user);
    setLoading(false);
    setData({
      id: '',
      sender: '',
      receiver: '',
      reason: '',
      amount: '',
      category: '',
      type: '',
      date: moment.now(),
    });
  };

  return (
    <BaseView>
      <Header
        leftComponent={
          <Icon
            name="back"
            size={28}
            color={colors.text}
            onPress={() => goBack()}
          />
        }
        rightComponent={<Profile small />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginBottom: 30, width: '90%'}}>
        <View style={styles.form}>
          <View style={styles.type}>
            <Button
              label="Recieve"
              btnStyle={{
                backgroundColor:
                  type == 'recieve' ? colors.success : colors.success + 30,
                width: WIDTH / 3,
                height: 40,
              }}
              onPress={() => onChangeValue('type', 'recieve')}
            />
            <Button
              label="Give"
              btnStyle={{
                backgroundColor:
                  type == 'give' ? colors.error : colors.error + 30,
                width: WIDTH / 3,
                height: 40,
              }}
              onPress={() => onChangeValue('type', 'give')}
            />
          </View>
          <Input
            placeholder="Sender"
            value={sender}
            autoCapitalize="words"
            onChangeText={value => onChangeValue('sender', value)}
          />
          <Input
            placeholder="Receiver"
            value={receiver}
            autoCapitalize="words"
            onChangeText={value => onChangeValue('receiver', value)}
          />
          <Input
            placeholder="Amount"
            value={amount}
            keyboardType="numeric"
            onChangeText={value => onChangeValue('amount', value)}
          />
          <Category
            selectedCat={category}
            setSelectedCat={val => {
              onChangeValue('category', val);
            }}
          />
          <Input
            placeholder="Reason"
            multiline
            autoCapitalize="words"
            value={reason}
            onChangeText={value => onChangeValue('reason', value)}
          />
          <TouchableOpacity
            style={styles.date}
            onPress={() => setShowDate(true)}>
            <Text h4 medium>
              {dateFormat(date)}
            </Text>
          </TouchableOpacity>

          <DateTimePick
            show={showDate}
            setShow={setShowDate}
            date={date}
            setDate={data => onChangeValue('date', data)}
          />
          <Button label="Add Khracha" onPress={onPress} />
        </View>
      </ScrollView>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  type: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  date: {
    borderBottomWidth: 1,
    height: 50,
    marginBottom: 30,
    justifyContent: 'center',
  },
  form: {
    paddingVertical: 25,
  },
});
