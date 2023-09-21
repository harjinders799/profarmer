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
import { getLabourData } from '../../network/labour-service';
import DateWiseList from '../../container/labour/dateWiseList';
import { ToastError } from '../../utils/toast';
import Loader from '../../components/loader';
import { white } from '../../utils/color';

export default function Labour() {
  const { lang } = useLang();
  const { labours, setLabours } = useStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [lang]),
  );

  const getData = async () => {
    try {
      let res = await getLabourData();
      if (Array.isArray(res) && res.length) {
        setData(res);
      } else setData([]);
      setLoading(false);
    } catch (error) {
      ToastError(error?.message, 'Labour');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      Auth()?.currentUser?.uid &&
      Array.isArray(labours) &&
      labours.length < 1 &&
      Array.isArray(data) &&
      data.length
    ) {
      let pick = [];
      data.map(v => {
        if (pick.indexOf(v?.labour) === -1) pick.push(v?.labour);
      });
      setLabours(pick);
    }
  }, [data]);

  return (
    <BaseView>
      <Loader visible={loading} />
      {/* <Header
        leftComponent={
          <Button
            label={strings.add_labour}
            btnStyle={{width: '40%'}}
            onPress={() => navigate('AddLabour')}
          />
        }
        rightComponent={
          <Button
            label={strings.add_expense}
            btnStyle={{width: '40%'}}
            onPress={() => navigate('AddLabourExpense')}
          />
        }
      /> */}

      <Text h3 style={{ paddingBottom: 10, textAlign: 'center' }}>
        {strings.labour_record}</Text>
      <DateWiseList data={data} />
      <Button
        iconName="plus"
        iconColor={white}
        label={strings.add_labour}
        btnStyle={{
          width: '40%',
          height: 50,
          position: 'absolute',
          bottom: 20,
          right: 30,
          zIndex: 999,
        }}
        onPress={() => navigate('AddLabour')}
      />
    </BaseView>
  );
}
