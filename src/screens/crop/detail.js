import React, { useCallback, useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { green, red, white } from 'src/utils/color';
import moment from 'moment';
import { sortBy, sumBy } from 'lodash';
import { useFocusEffect, useRoute, useTheme } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import Button from 'src/components/button';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import { currencyFormat, dateFormat } from '../../utils/dateformat';
import CropDetailAction from '../../container/crop/detailAction';
import Loader from '../../components/loader';
import { ToastError } from '../../utils/toast';
import {
  black,
  gray4,
  greenLight,
  greenlight,
  lightYellow,
  peach,
} from '../../utils/color';
import { useAuth } from '../../context/authContext';
import { Auth } from '../../service/setup';
import { deleteCropCollection } from '../../network/interest-service';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { useAadt } from '../../context/aadtContext';

const transparent = 'rgba(0,0,0,0.5)';

export default function Detail({ navigation }) {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { cropData: data, getCrop } = useAadt();
  const [loading, setLoading] = useState(false);
  const [interest, setInterest] = useState(0);
  useFocusEffect(
    useCallback(() => {
      getCrop();
    }, [navigation]),
  );
  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      let tot_interest = 0;
      data.map(v => {
        if (v?.interest_rate) {
          let date = moment(v?.date).format('YYYY-MM-DD');
          let start_date = moment(date);
          let today = moment();
          let days = today.diff(start_date, 'days');
          let interest = (
            ((parseFloat(v?.amount) * (parseFloat(v?.interest_rate) / 100)) /
              30) *
            parseInt(days)
          ).toFixed(2);
          tot_interest += parseFloat(interest);
        }
      });
      setInterest(tot_interest);
    }
  }, [data]);

  const [openModal, setopenModal] = useState(false);

  function renderModal() {
    return (
      <Modal visible={openModal} animationType="slide" transparent={true}>
        <View style={styles.modal}>
          <View
            style={{
              backgroundColor: 'white',
              padding: 20,
              width: '90%',
              borderRadius: 10,
              // height:110,
            }}>
            <Text
              h2
              style={{
                fontWeight: '700',
              }}>
              {strings.are_you_sure}
            </Text>
            <Text
              h3
              style={{
                marginTop: 10,
              }}>
              <Text
                h2
                style={{
                  fontWeight: '700',
                  color: red,
                }}>
                {strings.crop}
              </Text>
              {strings.alert}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 10,
              }}>
              <Loader visible={loading} />
              <Button
                label={strings.delete}
                btnStyle={{ width: '40%', backgroundColor: red }}
                size={30}
                // style={{color: red, display: _DEV_ ? 'flex' : 'none'}}
                onPress={async () => {
                  try {
                    setLoading(true);
                    setopenModal(false);
                    await deleteCropCollection(data?.crop);
                    setLoading(false);
                    goBack();
                  } catch (error) {
                    setLoading(false);
                    ToastError(error?.message);
                  }
                }}
              // type="MaterialCommunityIcons"
              />
              <Button
                label={strings.cancel}
                btnStyle={{ width: '40%', backgroundColor: gray4 }}
                size={30}
                onPress={() => setopenModal(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }

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
table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
  padding:10px;
}
td {
  text-align: center;
}
</style>
</head>
<body>
      <div style="display: flex; flex-direction:column; align-items:center">
          <div style="display: flex; justify-content: space-between; width:100%">
          <div>    
          <h2> ${strings.farmer_name} : ${user?.name}</h2>
          <p>${user?.phone}</p>
          <p>${user?.email}</p>
          </div>
          <div>
          <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
              <p>Time: ${moment().format('lll')}</p>
          </div>
          </div>
          <h2>${strings.crop_hisab}</h2>
      </div>
      <div style="display: flex; justify-content: space-between;">
      <div>
      <h3> ${strings.crop_total}: ${currencyFormat(
      sumBy(data, o => parseInt(o.amount)),
    )}
      </h3>
      <h3>${strings.total_interest}: ${currencyFormat(interest)} </h3>
      </div>
      <div>
    <h3>${strings.total_amount}  : ${currencyFormat(
      sumBy(data, o => parseInt(o.amount)) + interest,
    )}
    </h3>
      </div>
      </div>

      <h2>${strings.crop_hisab}</h2>
      <table style="width:100%">
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
          ${data.map(v => {
      v?.interest_rate;
      let date = moment(v?.date).format('YYYY-MM-DD');
      let start_date = moment(date);
      let today = moment();
      let days = today.diff(start_date, 'days');
      let interest = (
        ((parseFloat(v?.amount) * (parseFloat(v?.interest_rate) / 100)) /
          30) *
        parseInt(days)
      ).toFixed(2);
      let total_amount = parseFloat(v?.amount) + parseFloat(interest);
      return `<tr>
              <td>${dateFormat(data?.date)}</td>
              <td>${days}</td>
              <td>${v.crop}</td>
              <td>${currencyFormat(interest)}</td>
              <td>${currencyFormat(v?.amount)}</td>
              <td>${currencyFormat(interest)}</td>
              <td>${currencyFormat(
        parseFloat(v?.amount) + parseFloat(interest),
      )}</td>
              <td>${v?.detail}</td>
          </tr>`;
    })}
      </table>
  </body>
</html>
  `;

    const options = {
      html: html,
      base64: true,
      fileName: strings.crop,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    Share.open({
      url: `data:application/pdf;base64,${file?.base64}`,
      type: 'application/pdf',
      title: strings.crop,
      saveToFiles: true,
      showAppsToView: true,
      filename: strings.crop,
    })
      .then(res => console.log(res, '---res'))
      .catch(err => console.log(err, '----err'));
  };

  return (
    <BaseView style={{ paddingHorizontal: 0 }}>
      <Loader visible={loading} />
      <Header
        style={styles.header}
        leftComponent={
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name="back"
              size={28}
              style={(backgroundColor = black)}
              color={white}
              onPress={() => goBack()}
            />
          </View>
        }
        centerComponent={
          <Text h2 style={{ color: white }}>
            {' '}
            {strings.crop}
          </Text>
        }
        // rightComponent={<Text h2> </Text>}
        rightComponent={
          <View style={{ flexDirection: 'row' }}>
            {/* <Icon
              name="search1"
              color={white}
              size={25}
              style={{ marginRight: 15 }}
              onPress={() => ToastProgress(strings.in_progress)}
            /> */}
            <Icon
              name="pdffile1"
              size={25}
              color={white}
              style={{
                marginRight: 15,
                // display: cropData.length > 1 ? 'flex' : 'none',
              }}
              onPress={onShare}
            />

            <TouchableOpacity
              onPress={() => {
                setopenModal(true);
              }}>
              <Icon
                name="delete"
                size={30}
                color={white}
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
            {renderModal()}
          </View>
        }
      />
      <View style={[styles.row1]}>
        <View style={[styles.card, { borderColor: lightYellow + 50 }]}>
          <Text h3>{strings.crop_total}</Text>
          <Text h3 style={{ color: green }}>
            {currencyFormat(sumBy(data, o => parseInt(o.amount)))}
          </Text>
        </View>
        <View style={[styles.card, { borderColor: greenLight + 50 }]}>
          <Text h3>{strings.total_interest}</Text>
          <Text h3 style={{ color: red }}>
            {currencyFormat(interest)}
          </Text>
        </View>
        <View style={[styles.card, { borderColor: peach + 50 }]}>
          <Text h3>{strings.total_amount}</Text>
          <Text h3>
            {currencyFormat(sumBy(data, o => parseInt(o.amount)) + interest)}
          </Text>
        </View>
      </View>
      <ScrollView
        style={{ width: '100%', paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.wt}>
          <Text
            h3
            style={[
              styles.underline,
              {
                backgroundColor: greenLight,
                width: '100%',
                textAlign: 'center',
              },
            ]}>
            {strings.crop_hisab}
          </Text>

          <View style={styles.row}>
            <Text style={{ width: '20%', textAlign: 'left' }} h4>
              {strings.date}
            </Text>
            <Text style={{ width: '20%', textAlign: 'center' }} h4>
              {strings.crop}
            </Text>
            <Text style={{ width: '30%', textAlign: 'center' }} h4>
              {strings.total_interest}
            </Text>
            <Text style={{ width: '30%', textAlign: 'center' }} h4>
              {strings.total_amount}
            </Text>
            {/* <Text h3 style={{ textAlign: 'center',}}>
        {strings.remark}
      </Text> */}
          </View>
          {Array.isArray(data) && data.length ? (
            sortBy(data, (a, b) => moment(b?.date) - moment(a?.date)).map(
              (v, i) => <CropDetailAction key={i} data={v} />,
            )
          ) : (
            <Text>0</Text>
          )}
        </View>
      </ScrollView>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  row1: {
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
    flexWrap: 'wrap',
  },
  underline: {
    paddingVertical: 10,
  },
  wt: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
  header: {
    backgroundColor: green,
    paddingHorizontal: 15,
    paddingVertical: 15,
    width: '100%',
  },
  card: {
    backgroundColor: white,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 10,
    elevation: 5,
    marginVertical: 5,
    borderWidth: 3,
  },
});
