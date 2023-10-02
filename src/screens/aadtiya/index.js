import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { Auth } from 'src/service/setup';
import { useLang } from 'src/context/langContext';
import Header from 'src/components/header';
import { getInterstAmount } from 'src/network/interest-service';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { groupBy, sumBy } from 'lodash';
import moment from 'moment';
import { strings } from 'src/translations/locale';
import { useStore } from 'src/context/context';
import ListAadt from 'src/container/list';
import ListCrop from 'src/container/crop/list';
import Loader from '../../components/loader';
import { ToastError } from '../../utils/toast';
import Button from '../../components/button';
import { navigate } from '../../navigation/ref';
import Icon from '../../components/icon';
import {
  blue,
  gray10,
  green,
  greenDark,
  greenLight,
  orange,
  red,
  white,
} from '../../utils/color';
import { useAadt } from '../../context/aadtContext';
import { getTotalInterst } from '../../utils/helper';
import { currencyFormat } from '../../utils/dateformat';

export default function DashBoard({ navigation }) {
  const { lang } = useLang();
  const { aadtData, getAadt, cropData, getCrop } = useAadt();
  const { givers, setGivers } = useStore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  let arr = [];
  const [isTextVisible, setTextVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getAadt();
      getCrop();
    }, [navigation, lang]),
  );

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
      {/* <Loader visible={loading} /> */}
      {/* <Header
        centerComponent={
          <Button
            label={strings.aadhat_expense}
            btnStyle={{ width: '100%' }}
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
      /> */}
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

   
        <View   style={{
          // marginTop: 30,
          width: '100%',
          alignItem: 'center',
          flexDirection: "row",
          justifyContent: "space-between"
        }}>
      
        <Icon
          name={isTextVisible ? 'eye-slash' : 'eye'}
          type="FontAwesome"
          size={25}
          color={gray10}
          style={{
            position: 'relative',
            zIndex: 99,
            marginTop: 15
            // display: !isSearchActive ? 'flex' : 'none',
          }}
          onPress={() => setTextVisible(!isTextVisible)}
        />
      <Text h2 style={{ textAlign: 'center', marginVertical: 10 }}>
        {strings.aadhatiya_hisab}
      </Text>
          
      </View>
      {/* {isTextVisible && ( */}
      <View
        style={{
          padding: 10,
          width: '100%',
          borderRadius: 10,
          backgroundColor: greenLight,
          elevation: 5,
          marginVertical: 10,
          marginBottom: 30,
        }}>
        <View
          style={{
            // flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginVertical: 5,
          }}>
          <Text
            h3
            style={{ color: blue, fontWeight: '700', textAlign: 'center' }}>
            {currencyFormat(getTotalInterst(aadtData))}
          </Text>
          <Text h4 style={{ textAlign: 'center' }}>
            {strings.taken_amount_from_aadhtiya} ({strings.interest_included})
          </Text>
        </View>
        <View
          style={{
            // flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginVertical: 10,
          }}>
          <Text
            h3
            style={{ color: orange, fontWeight: '700', textAlign: 'center' }}>
            {currencyFormat(getTotalInterst(cropData))}
          </Text>
          <Text h4 style={{ textAlign: 'center' }}>
            {strings.crop} ({strings.interest_included})
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginVertical: 10,
          }}>
          <Text h3 style={{ textAlign: 'center' }}>
            {strings.final}
          </Text>
          <Text
            h2
            style={{
              color:
                getTotalInterst(aadtData) - getTotalInterst(cropData) > 0
                  ? red
                  : greenDark,
              fontWeight: '700',
              textAlign: 'center',
            }}>
            {currencyFormat(
              getTotalInterst(cropData) - getTotalInterst(aadtData),
            )}{'\n'}
            <Text
              h4
              style={{
                color:
                  getTotalInterst(aadtData) - getTotalInterst(cropData) > 0
                    ? red
                    : greenDark,
              }}>
              {getTotalInterst(aadtData) - getTotalInterst(cropData) > 0
                ? strings.give
                : strings.receive}
            </Text>
          </Text>
        </View>
      </View>
      {/* {isTextVisible && (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 0.5,
            marginVertical: 10,
          }}>
          <Text h3>{strings.total_amount}</Text>
          <Text h3> {sumBy(arr, o => o.total)} Rs</Text>
        </View>
      )} */}
      <Text h3 style={{ textAlign: 'center' }}>
        {strings.givers_list}
      </Text> 
      <ListAadt data={aadtData} />
      <Text h3 style={{ textAlign: 'center', marginTop: 10 }}>
        {strings.crop_hisab}
      </Text>
      <ListCrop data={cropData} />
      <Header
        leftComponent={
          <Button
            iconName="plus"
            iconColor={white}
            label={strings.aadhat_expense}
            btnStyle={{
              width: 'auto',
              maxWidth:'47%',
              paddingHorizontal: 15,
              display:
                Array.isArray(aadtData) && aadtData.length ? 'none' : 'flex',
            }}
            onPress={() => navigate('AddForm')}
          />
        }
        rightComponent={
          <Button
            iconName="plus"
            iconColor={white}
            label={strings.add_crop}
            btnStyle={{
              width: 'auto',
              maxWidth:'47%',
              paddingHorizontal: 15,
              display:
                Array.isArray(cropData) && cropData.length ? 'none' : 'flex',
            }}
            onPress={() => navigate('AddCrop')}
          />
         }
      />
    </BaseView>
  );
}
