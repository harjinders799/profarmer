import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { Auth } from 'src/service/setup';
import { useLang } from 'src/context/langContext';
import Header from 'src/components/header';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import { useStore } from 'src/context/context';
import Button from '../../components/button';
import { navigate } from '../../navigation/ref';
import { getAllPickerExpense, getPickerData } from '../../network/picker-service';
import DateWiseList from '../../container/picker/dateWiseList';
import { ToastError } from '../../utils/toast';
import Loader from '../../components/loader';
import MandiPrice from '../../container/picker/mandiPrice';
import { white } from '../../utils/color';
import { useCotton } from '../../context/cottonContext';
import { createCottonPriceTable, createPickerExpenseTable, createPickerTable, deleteDBConnectionDB, savePickerData, savePickerExpenseData } from '../../sql';

export default function Picker() {
  const { lang } = useLang();
  const { db, getPickerWeight, pickerWeight, getPickerExpense } = useCotton();
  const [loading, setLoading] = useState(false)
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      getData();
      getPickerWeight()
      getPickerExpense()
    }, [lang, isFocused]),
  );

  const getData = async () => {
    try {
      // console.log(pickerWeight, '-=-=-=-=-=-=-=-=-=----')
      await createCottonPriceTable(db);
      await createPickerTable(db);
      await createPickerExpenseTable(db);
      // console.log(pickerWeight, '-=-=-=-=-=-=-=-=-=----')
      if (pickerWeight == undefined || (Array.isArray(pickerWeight) && pickerWeight.length == 0)) {
        setLoading(true)
      }
      let wt = await getPickerData();
      if (Array.isArray(wt) && wt.length) {
        wt.map((o, i) => ({ ...o, id: i + 1 }))
        await savePickerData(db, wt);
      }
      let ex = await getAllPickerExpense();
      if (Array.isArray(ex) && ex.length) {
        ex.map((o, i) => ({ ...o, id: i + 1 }))
        await savePickerExpenseData(db, ex);
      }
      await getPickerWeight()
      await getPickerExpense()
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  };

  return (
    <BaseView>
      <Loader visible={loading} />
      <MandiPrice />
      <Text h3
      // onPress={async () => await deleteDBConnectionDB()}
      >{strings.picker_record}</Text>
      <DateWiseList />
      <Button
        iconName='plus'
        iconColor={white}
        label={strings.add_picker}
        btnStyle={{ width: '40%', position: 'absolute', bottom: 50, right: 30, zIndex: 999 }}
        onPress={() => navigate('AddPicker')}
      />
    </BaseView>
  );
}
