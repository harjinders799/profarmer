import React, {useCallback, useEffect, useState} from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import {Auth} from 'src/service/setup';
import {useLang} from 'src/context/langContext';
import Header from 'src/components/header';
import {useFocusEffect} from '@react-navigation/native';
import {strings} from 'src/translations/locale';
import {useStore} from 'src/context/context';
import Button from '../../components/button';
import {navigate} from '../../navigation/ref';
import {getPickerData} from '../../network/picker-service';
import DateWiseList from '../../container/picker/dateWiseList';
import {ToastError} from '../../utils/toast';
import Loader from '../../components/loader';

export default function Picker() {
  const {lang} = useLang();
  const {pickers, setPickers} = useStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [lang]),
  );

  const getData = async () => {
    try {
      let res = await getPickerData();
      if (Array.isArray(res) && res.length) {
        setData(res);
      } else setData([]);
      setLoading(false);
    } catch (error) {
      console.log(error,'--------pickerdata')
      ToastError(error?.message, 'Picker');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      Auth()?.currentUser?.uid &&
      Array.isArray(pickers) &&
      pickers.length < 1 &&
      Array.isArray(data) &&
      data.length
    ) {
      let pick = [];
      data.map(v => {
        if (pick.indexOf(v?.picker) === -1) pick.push(v?.picker);
      });
      setPickers(pick);
    }
  }, [data]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header
        leftComponent={
          <Button
            label={strings.add_picker}
            btnStyle={{width: '40%'}}
            onPress={() => navigate('AddPicker')}
          />
        }
        rightComponent={
          <Button
            label={strings.add_expense}
            btnStyle={{width: '40%'}}
            onPress={() => navigate('AddPickerExpense')}
          />
        }
      />
      <Text h2>{strings.picker_record}</Text>
      <DateWiseList data={data} />
    </BaseView>
  );
}
