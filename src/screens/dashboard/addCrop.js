import * as React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useRoute, useTheme} from '@react-navigation/native';
import Button from 'src/components/button';
import Input from 'src/components/input';
import Text from 'src/components/text';
import DateTimePick from 'src/components/DateTime';
import {currentStamp, dateFormat} from 'src/utils/dateformat';
import {submitInterestAmount} from 'src/network/interest-service';
import Loader from 'src/components/loader';
import BaseView from 'src/container/base';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import DataPicker from 'src/components/dataPicker';
import {strings} from 'src/translations/locale';
import {navigate} from 'src/navigation/ref';
import {useStore} from 'src/context/context';
import {goBack} from 'src/navigation/ref';
import {updateIneterstAmt} from 'src/network/interest-service';
import Header from '../../components/header';
import Icon from '../../components/icon';
import {submitCrop, updateCrop} from '../../network/interest-service';

export default function AddCrop() {
  const {colors} = useTheme();
  const {setGivers, givers} = useStore();
  const {params} = useRoute();
  const editData = params?.data ?? {};
  const refAmt = React.useRef();
  const [data, setData] = React.useState({
    id: editData?.id ?? '',
    agent: editData?.agent ?? '',
    detail: editData?.detail ?? '',
    amount: editData?.amount ?? '',
    crop: editData?.crop ?? '',
    date: editData?.date ? new Date(editData?.date) : new Date(),
  });
  const [showDate, setShowDate] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const {agent, detail, amount, crop, date} = data;

  React.useEffect(() => {
    if (givers.length == 1 && !agent) onChangeValue('agent', givers[0]);
  }),
    [givers];

  const onChangeValue = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const onPress = () => {
    if (editData.agent) updateWt();
    else AddNew();
  };
  const updateWt = async () => {
    if (agent == '') {
      ToastError(strings.giver_name, 'Amount');
    } else if (amount.trim() == '' || parseInt(amount) <= 0) {
      ToastError(strings.taken_amount, 'Amount');
    } else if (crop.trim() == '' || parseInt(crop) <= 0) {
      ToastError(strings.crop, 'Amount');
    } else {
      setLoading(true);
      let res = await updateCrop({
        ...data,
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess('strings.picker_amt_added', 'Amount');
      goBack();
    }
  };

  const AddNew = async () => {
    if (agent == '') {
      ToastError(strings.err_picker, 'Amount');
    } else if (amount.trim() == '' || parseInt(amount) <= 0) {
      ToastError(strings.taken_amount, 'Amount');
    } else if (crop.trim() == '' || parseInt(crop) <= 0) {
      ToastError(strings.crop, 'Amount');
    } else {
      setLoading(true);
      let res = await submitCrop({
        ...data,
        agent: agent.trim(),
        date: currentStamp(date),
      });
      setLoading(false);
      ToastSuccess('strings.picker_amt_added', 'Amount');
      let name = agent.trim();
      if (Array.isArray(givers) && givers.length) {
        let exist = givers.findIndex(
          o => o.toUpperCase() === name.toUpperCase(),
        );
        if (exist == -1) {
          setGivers([...givers, name]);
        }
      } else {
        setGivers([name]);
      }
      goBack();
      // }
    }
  };

  return (
    <BaseView style={styles.container}>
      <Loader visible={loading} />
      <Header
        leftComponent={
          <Icon
            name="back"
            size={28}
            color={colors.text}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text h2>{strings.crop}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <View style={styles.form}>
        <Input
          placeholder={strings.crop}
          value={crop}
          autoCapitalize="words"
          setValue={value => onChangeValue('crop', value)}
        />
        <DataPicker
          data={givers}
          // intialVisible={!editData?.agent}
          placeholder={strings.aadhtiya}
          selectedItem={agent}
          setSelectedItem={val => {
            onChangeValue('agent', val);
          }}
        />
        <Input
          refs={refAmt}
          placeholder={strings.total_amount}
          value={amount}
          keyboardType="number-pad"
          setValue={value => onChangeValue('amount', value)}
        />
        <Input
          placeholder={strings.remark}
          multiline
          autoCapitalize="words"
          value={detail}
          setValue={value => onChangeValue('detail', value)}
        />
        <TouchableOpacity
          style={[styles.date, {borderColor: colors.border}]}
          onPress={() => setShowDate(true)}>
          <Text h3 medium>
            {dateFormat(date)}
          </Text>
        </TouchableOpacity>

        <DateTimePick
          show={showDate}
          setShow={setShowDate}
          date={date}
          setDate={data => onChangeValue('date', data)}
        />
        <Button label={strings.save} onPress={onPress} />
      </View>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  container: {},
  type: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  date: {
    borderWidth: 1,
    height: 50,
    width: '100%',
    borderRadius: 10,
    marginVertical: 5,
    marginBottom: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  form: {
    paddingVertical: 25,
    width: '100%',
  },
});
