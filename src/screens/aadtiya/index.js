import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { Auth } from 'src/service/setup';
import { useLang } from 'src/context/langContext';
import Header from 'src/components/header';
import { getInterstAmount } from 'src/network/interest-service';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
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
import { sortBy, sumBy } from 'lodash';
import { useAadt } from '../../context/aadtContext';
import { getInterst, getTotalInterst } from '../../utils/helper';
import { currencyFormat } from '../../utils/dateformat';
import { useAuth } from '../../context/authContext';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { dateFormat } from 'src/utils/dateformat';

export default function DashBoard({ navigation }) {
  const { lang } = useLang();
  const { aadtData, getAadt, cropData, getCrop } = useAadt();
  const { givers, setGivers } = useStore();
  const [data, setData] = useState([]);
  let arr = [];
  const [isTextVisible, setTextVisible] = useState(false);
  const { user } = useAuth();

  useFocusEffect(
    useCallback(() => {
      getAadt();
      getCrop();
    }, [navigation, lang]),
  );

  const onShare = async () => {
    if (!user?.name) {
      ToastError('Please Complete your profile');
      navigate('EditProfile');
      return;
    }
    let html = `<!DOCTYPE html>
<html>
  <head>
    <style>
      table,
      th,
      td {
        border: 1px solid black;
        border-collapse: collapse;
        padding: 10px;
      }

      td {
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div style="display: flex; flex-direction: column; align-items: center">
      <div style="display: flex; justify-content: space-between; width: 100%">
        <div>
          <h2>${strings.farmer_name}: ${user?.name}</h2>
          <p>${user?.phone}</p>
          <p>${user?.email}</p>
        </div>
        <div>
          <a href="https://play.google.com/store/apps/details?id=com.profarmer"
            >Pro Farmer</a
          >
          <p>${moment().format('lll')}</p>
        </div>
      </div>
      <h2>${strings.aadhatiya_hisab}</h2>
    </div>
    <div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <h3>
            ${strings.taken_amount} : ${currencyFormat(
      getTotalInterst(aadtData) - getInterst(aadtData), 2)}
          </h3>
        </div>
        <div>
          <h3>
            ${strings.crop} : ${currencyFormat(getTotalInterst(cropData) - getInterst(cropData), 2)}
          </h3>
        </div>
      </div> 
      <div style="display: flex; justify-content: space-between">
        <div>
          <h3>
            ${strings.total_interest} : ${currencyFormat(
        getInterst(aadtData), 2)}
          </h3>
        </div>
        <div>
          <h3>
            ${strings.total_interest} : ${currencyFormat(getInterst(cropData), 2)}
          </h3>
        </div>
      </div> 
      <div style="display: flex; justify-content: space-between">
      <div>
          <h3>
            ${strings.taken_amount_from_aadhtiya} : ${currencyFormat(
          getTotalInterst(aadtData), 2)}
          </h3>
          <h4>(${strings.interest_included})</h4>
        </div>
        <div>
          <h3>
            ${strings.crop} : ${currencyFormat(getTotalInterst(cropData), 2)}
          </h3>
          <h4>(${strings.interest_included})</h4>
        </div>
      </div>
      
      <div style="display: flex; align-self: center">
        <h2>
          ${strings.final} (${getTotalInterst(aadtData) -
        getTotalInterst(cropData) > 0 ? strings.give : strings.receive}) :
          ${currencyFormat(getTotalInterst(cropData) -
          getTotalInterst(aadtData), 2)}${'\n'}
        </h2>
      </div>
    </div>
    <h2>${strings.givers_list}</h2>
    <table style="width: 100%">
      <tr>
        <th>"${strings.date}</th>
        <th>${strings.day}</th>
        <th>${strings.interest}</th>
        <th>${strings.total_principal}</th>
        <th>${strings.total_interest}</th>
        <th>${strings.total_amount}</th>
        <th>${strings.remark}</th>
      </tr>
      ${sortBy(aadtData, (a, b) => moment(b?.date) - moment(a?.date)).map(
            record => {
              let date = moment(record?.date).format('YYYY-MM-DD'); let
                start_date = moment(date); let today = moment(); let days =
                  today.diff(start_date, 'days'); let interest = (
                    ((parseFloat(record?.amount) * (parseFloat(record?.interest_rate) / 100))
                      / 30) * parseInt(days)).toFixed(2); let final_amount =
                        parseFloat(record?.amount) + parseFloat(interest); return `
      <tr>
        <td>${dateFormat(record?.date)}</td>
        <td>${days}</td>
        <td>${record?.interest_rate}</td>
        <td>${currencyFormat(record?.amount, 2)}</td>
        <td>${currencyFormat(interest, 2)}</td>
        <td>${currencyFormat(final_amount, 2)}</td>
        <td>${record?.detail}</td>
      </tr>
      `;
            },)}
    </table>
    <h2>${strings.crop_hisab}</h2>
    <table style="width: 100%">
      <tr>
        <th>${strings.date}</th>
        <th>${strings.day}</th>
        <th>${strings.crop}</th>
        <th>${strings.interest}</th>
        <th>${strings.crop_total}</th>
        <th>${strings.total_interest}</th>
        <th>${strings.total_amount}</th>
        <th>${strings.remark}</th>
      </tr>
      ${cropData.map(v => {
              v?.interest_rate; let date =
                moment(v?.date).format('YYYY-MM-DD'); let start_date = moment(date); let
                  today = moment(); let days = today.diff(start_date, 'days'); let interest
                    = (((parseFloat(v?.amount) * (parseFloat(v?.interest_rate) / 100)) / 30)
                      * parseInt(days)).toFixed(2); let total_amount = parseFloat(v?.amount) +
                        parseFloat(interest); return `
      <tr>
        <td>${dateFormat(data?.date)}</td>
        <td>${days}</td>
        <td>${v.crop}</td>
        <td>${currencyFormat(v?.interest_rate, 2)}</td>
        <td>${currencyFormat(v?.amount, 2)}</td>
        <td>${currencyFormat(interest, 2)}</td>
        <td>${currencyFormat(parseFloat(v?.amount) + parseFloat(interest), 2)}</td>
        <td>${v?.detail}</td>
      </tr>
      `;
            })}
    </table>
  </body>
</html>
`;

    const options = {
      html: html,
      base64: true,
      fileName: strings.aadhatiya_hisab,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    Share.open({
      url: `data:application/pdf;base64,${file?.base64}`,
      type: 'application/pdf',
      title: strings.aadhatiya_hisab,
      saveToFiles: true,
      showAppsToView: true,
      filename: strings.aadhatiya_hisab,
    })
      .then(res => console.log(res, '---res'))
      .catch(err => console.log(err, '----err'));
  };

  return (
    <BaseView style={{ paddingHorizontal: 0 }}>
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
        <Text
          h2
          style={{
            textAlign: 'center',
            marginVertical: 10,
            paddingHorizontal: 50,
          }}>
          {strings.aadhatiya_hisab}
        </Text>
        <Icon
          name="pdffile1"
          size={30}
          color={green}
          style={{ position: 'absolute', right: 20, top: 10 }}
          onPress={onShare}
        />
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
              )}
              {'\n'}
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
                width: '40%',
                display:
                  Array.isArray(cropData) && cropData.length ? 'none' : 'flex',
              }}
              onPress={() => navigate('AddCrop')}
            />
          }
        />
      </ScrollView>
    </BaseView>
  );
}
