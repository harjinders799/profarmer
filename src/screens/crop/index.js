import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import Profile from 'src/container/profile';
import { Auth } from 'src/service/setup';
import { commonStyle } from 'src/utils/style';
import Logo from 'src/container/logo';
import { useLang } from 'src/context/langContext';
import Header from 'src/components/header';
import { useFocusEffect } from '@react-navigation/native';
import { groupBy, sumBy } from 'lodash';
import moment from 'moment';
import { strings } from 'src/translations/locale';
import { useStore } from 'src/context/context';
import List from 'src/container/crop/list';
import Loader from '../../components/loader';
import { ToastError } from '../../utils/toast';
import Button from '../../components/button';
import { navigate } from '../../navigation/ref';
import { getCrops } from '../../network/interest-service';

export default function Crop({ navigation }) {
  const { lang } = useLang();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  let arr = [];

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [navigation, lang]),
  );

  const getData = async () => {
    try {
      let res = await getCrops();
      if (Array.isArray(res) && res.length) {
        setData(res);
      } else setData([]);
      setLoading(false);
    } catch (error) {
      ToastError(error?.message, 'Crop');
      setLoading(false);
    }
  };

  if (data.length) {
    let grp = groupBy(data, v => moment(v.date).format('YYYY/MM/DD'));
    Object.keys(grp).map(v =>
      arr.push({
        date: v,
        total: sumBy(grp[v], o => parseInt(o.amount)),
        data: grp[v],
      }),
    );
  }
  // useEffect(() => {
  //   if (
  //     Auth()?.currentUser?.uid &&
  //     Array.isArray(givers) &&
  //     givers.length < 1 &&
  //     Array.isArray(data) &&
  //     data.length
  //   ) {
  //     let pick = [];
  //     data.map(v => {
  //       if (pick.indexOf(v?.giver) === -1) pick.push(v?.giver);
  //     });
  //     setGivers(pick);
  //   }
  // }, [data]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header
        centerComponent={
          <Button
            label={strings.add_crop}
            btnStyle={{ width: '100%' }}
            onPress={() => navigate('AddCrop')}
          />
        }
      />
      <Text
        h2
        style={[
          commonStyle.p_v_10,
          { borderBottomWidth: StyleSheet.hairlineWidth },
        ]}>
        {strings.crop_hisab}
      </Text>
      <List data={data} />
    </BaseView>
  );
}
