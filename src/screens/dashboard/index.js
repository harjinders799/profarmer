import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import Profile from 'src/container/profile';
import {Auth} from 'src/service/setup';
import {commonStyle} from 'src/utils/style';
import Logo from 'src/container/logo';
import {useLang} from 'src/context/langContext';
import Header from 'src/components/header';
import LanguagePicker from 'src/components/languagePicker';
import {getInterstAmount} from 'src/network/interest-service';
import {useFocusEffect} from '@react-navigation/native';
import {groupBy, sumBy} from 'lodash';
import moment from 'moment';
import {strings} from 'src/translations/locale';
import {useStore} from 'src/context/context';
import List from 'src/container/list';
import Loader from '../../components/loader';
import {ToastError} from '../../utils/toast';
import Button from '../../components/button';
import {navigate} from '../../navigation/ref';

export default function DashBoard({navigation}) {
  const {lang} = useLang();
  const {givers, setGivers} = useStore();
  const [active, setActive] = useState('date');
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
      let res = await getInterstAmount();
      if (Array.isArray(res) && res.length) {
        setData(res);
      } else setData([]);
      setLoading(false);
    } catch (error) {
      ToastError(error?.message, 'Labour');
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
  useEffect(() => {
    if (
      Auth()?.currentUser?.uid &&
      Array.isArray(givers) &&
      givers.length < 1 &&
      Array.isArray(data) &&
      data.length
    ) {
      let pick = [];
      data.map(v => {
        if (pick.indexOf(v?.giver) === -1) pick.push(v?.giver);
      });
      setGivers(pick);
    }
  }, [data]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header
        leftComponent={
          <Button
            label={strings.aadhat_expense}
            // btnStyle={{ width: '0%' }}
            onPress={() => navigate('AddForm')}
          />
        }
        // rightComponent={
        //     <Button
        //         label={strings.add_crop}
        //         btnStyle={{ width: '40%' }}
        //         onPress={() => navigate('AddCrop')}
        //     />
        // }
      />
      {/* <Text h2 style={{ paddingTop: 10 }}>
                {strings.total_amount} {sumBy(arr, o => o.total)} Rs
            </Text>
            <View style={[commonStyle.row_c_s_b, commonStyle.p_b_15, { borderBottomWidth: StyleSheet.hairlineWidth }]}>
                <Text h4 style={{ paddingTop: 10 }}>
                    {strings.total_principal} {sumBy(arr, o => o.total)} Rs
                </Text>
                <Text h4 style={{ paddingTop: 10 }}>
                    {strings.total_interest} {sumBy(arr, o => o.total)} Rs
                </Text>
            </View> */}
      <Text
        h2
        style={[
          commonStyle.p_v_10,
          {borderBottomWidth: StyleSheet.hairlineWidth},
        ]}>
        {strings.aadhatiya_hisab}
      </Text>
      <List data={data} />
    </BaseView>
  );
}
