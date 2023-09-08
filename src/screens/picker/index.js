import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { Auth } from 'src/service/setup';
import { useLang } from 'src/context/langContext';
import Header from 'src/components/header';
import { useFocusEffect } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import { useStore } from 'src/context/context';
import Button from '../../components/button';
import { navigate } from '../../navigation/ref';
import { getPickerData } from '../../network/picker-service';
import DateWiseList from '../../container/picker/dateWiseList';
import { ToastError } from '../../utils/toast';
import Loader from '../../components/loader';
import MandiPrice from '../../container/picker/mandiPrice';
import { white } from '../../utils/color';
import { useCotton } from '../../context/cottonContext';
import { deleteDBConnectionDB } from '../../sql';

export default function Picker() {
  const { lang } = useLang();
  const { getPickerWeight, getPickerExpense } = useCotton();

  useFocusEffect(
    useCallback(() => {
      getPickerWeight()
      getPickerExpense()
    }, [lang]),
  );
  return (
    <BaseView>
      {/* <Header
        leftComponent={
          <Button
            label={strings.add_picker}
            btnStyle={{ width: '40%' }}
            onPress={() => navigate('AddPicker')}
          />
        }
        rightComponent={
          <Button
            label={strings.add_expense}
            btnStyle={{ width: '40%' }}
            onPress={() => navigate('AddPickerExpense')}
          />
        }
      /> */}
      <MandiPrice />
      <Text h3
      // onPress={async () => await deleteDBConnectionDB()}
      >{strings.picker_record}</Text>
      <DateWiseList />
      <Button
        iconName='plus'
        iconColor={white}
        label={strings.add_picker}
        btnStyle={{ width: '40%', position: 'absolute', bottom: 50, right: 30 }}
        onPress={() => navigate('AddPicker')}
      />
    </BaseView>
  );
}
