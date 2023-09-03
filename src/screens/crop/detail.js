import React, { useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import { FlatList, ScrollView, Share, StyleSheet, View } from 'react-native';
import { green, red, white } from 'src/utils/color';
import moment from 'moment';
import { sortBy, sumBy } from 'lodash';
import { useRoute, useTheme } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import Button from 'src/components/button';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import { currencyFormat } from '../../utils/dateformat';
import CropDetailAction from '../../container/crop/detailAction';

export default function Detail({ navigation }) {
  const { params } = useRoute();
  const { colors } = useTheme();
  const [rate, setRate] = useState();
  const data = params?.data ?? [];
  const [interest, setInterest] = useState(0);

  const onShare = async () => {
    // if (!rate) { ToastError(strings.enter_rate, 'Picker'); return; }
    // try {
    //   let messseag = `
    //   ${data?.picker}
    //   ${strings.total_cotton} --->  ${data?.total} Kg
    //   Rate X  ${strings.total_cotton}  --->   ${`${rate * data?.total} Rs`}
    //   ${strings.amount}  --->  ${sumBy(paid, o => parseInt(o.amount))} Rs
    //   ${strings.final} --->   ${rate * data?.total - (sumBy(paid, o => parseInt(o.amount)))} Rs
    //   ${strings.weight}
    //   ${data.map(i => `${dateFormat(i?.date)}  --->  ${i?.weight}Kg`).join('\n')}
    //   ${strings.amount}
    //   ${paid.map(i => `${dateFormat(i?.date)}  --->  ${i?.amount}Rs`).join('\n')}
    //   `
    //   const result = await Share.share({
    //     title: data?.picker,
    //     message: messseag
    //   });
    // } catch (error) {
    //   ToastError(error.message, "Share")
    // }
  };

  useEffect(() => {
    if (Array.isArray(data) && data.length) {
      let tot_interest = 0;
      data.map(v => {
        if (v?.interest_rate) {
          let date = moment(v?.date).format("YYYY-MM-DD");
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

  return (
    <BaseView>
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
      <View style={[styles.row, styles.underline]}>
        <Text h3>{strings.crop_total}</Text>
        <Text h3 style={{ color: green }}>
          {currencyFormat(sumBy(data, o => parseInt(o.amount)))}
        </Text>
      </View>
      <View style={[styles.row, styles.underline]}>
        <Text h3>{strings.total_interest}</Text>
        <Text h3 style={{ color: red }}>
          {currencyFormat(interest)}
        </Text>
      </View>
      <View style={[styles.row, styles.underline]}>
        <Text h3>{strings.total_amount}</Text>
        <Text h3>{currencyFormat(sumBy(data, o => parseInt(o.amount)) + interest)}</Text>
      </View>
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.wt}>
          <Text h4>{strings.crop_hisab}</Text>
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
  list: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: white,
    padding: 10,
    marginVertical: 10,
    width: '98%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '98%',
    marginVertical: 5,
  },
  underline: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderStyle: 'dotted',
  },
  wt: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    elevation: 1,
    width: 30,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 5,
  },
});
