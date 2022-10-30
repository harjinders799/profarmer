import React, { useEffect, useState } from 'react'
import BaseView from 'src/container/base'
import Text from 'src/components/text'
import { FlatList, ScrollView, Share, StyleSheet, View } from 'react-native'
import { green, red, white } from 'src/utils/color'
import moment from 'moment'
import { sortBy } from 'lodash'
import { useRoute, useTheme } from '@react-navigation/native'
import { strings } from 'src/translations/locale'
import Button from 'src/components/button'
import GiverDetailAction from 'src/components/giverDetailAction'
import { commonStyle } from 'src/utils/style'
import Header from '../../components/header'
import Icon from '../../components/icon'
import { goBack } from '../../navigation/ref'
import { currencyFormat } from '../../utils/dateformat'

export default function Detail({ navigation }) {
  const { params } = useRoute();
  const { colors } = useTheme();
  const [rate, setRate] = useState();
  const data = params?.item ?? []
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
    //   ${data.data.map(i => `${dateFormat(i?.date)}  --->  ${i?.weight}Kg`).join('\n')}

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
    if (Array.isArray(data.data) && data.data.length) {
      let tot_interest = 0;
      data.data.map(v => {
        let start_date = moment(v?.date);
        let today = moment();
        let days = today.diff(start_date, 'days')
        let interest = (((parseFloat(v?.amount) * (parseFloat(v?.interest_rate) / 100)) / 30) * (parseFloat(days))).toFixed(2)
        tot_interest += parseFloat(interest)
      });
      setInterest(tot_interest)
    }
  }, [data])


  return (
    <BaseView>
      {/* <View style={[styles.row, { paddingTop: 20 }]}> */}
      <Header
        leftComponent={
          <Icon name="back" size={28} color={colors.text} onPress={() => goBack()} />
        }
        centerComponent={
          <Text h2>
            {data?.giver}
          </Text>
        }
        rightComponent={<Text h2>   </Text>}
      />
      {/* <PickerRate
        rate={rate}
        setRate={setRate}
      /> */}
      <View style={[styles.row, styles.underline]}>
        <Text h3>
          {strings.total_principal}
        </Text>
        <Text h3 style={{ color: green }}>
          {currencyFormat(data?.total)}
        </Text>
      </View>
      <View style={[styles.row, styles.underline]}>
        <Text h3>
          {strings.total_interest}
        </Text>
        <Text h3 style={{ color: red }}>
          {currencyFormat(interest)}
        </Text>
      </View>
      <View style={[styles.row, styles.underline]}>
        <Text h3>
          {strings.total_amount}
        </Text>
        <Text h3>
          {currencyFormat(data?.total + interest)}
        </Text>
      </View>
      {/* {rate ?
        <>
          <View style={[styles.row, styles.underline]}>
            <Text h3>
              Rate X  {strings.total_cotton}
            </Text>
            <Text h3>
              {`${rate * data?.total} Rs`}
            </Text>
          </View>
          <View style={[styles.row, styles.underline]}>
            <Text h3>
              {strings.amount}
            </Text>
            <Text h3>
              {sumBy(paid, o => parseInt(o.amount))} Rs
            </Text>
          </View>
          <View style={[[styles.row, styles.underline]]}>
            <Text h3>
              {strings.final}
            </Text>
            <Text h2 style={{ color: (rate * data?.total - (sumBy(paid, o => parseInt(o.amount)))) > 0 ? green : red }}>
              {rate * data?.total - (sumBy(paid, o => parseInt(o.amount)))} Rs
            </Text>
          </View>
        </>
        :
        <Text style={{ color: red }}>{strings.enter_rate}</Text>
      } */}
      <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false}>
        <View style={styles.wt}>
          <Text h4>{strings.amount}</Text>
          {Array.isArray(data.data) && data.data.length ?
            sortBy(data.data, (a, b) => moment(b?.date) - moment(a?.date)).map((v, i) => (
              <GiverDetailAction key={i} data={v} />
            ))
            : <Text>0</Text>
          }
        </View>
      </ScrollView>
    </BaseView>
  )
}
const styles = StyleSheet.create({
  list: {
    borderRadius: 10,
    elevation: 3,
    backgroundColor: white,
    padding: 10,
    marginVertical: 10,
    width: '98%',
    alignSelf: 'center'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '98%',
    marginVertical: 5
  },
  underline: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderStyle: 'dotted'
  },
  wt: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 10
  },
  icon: {
    elevation: 1,
    width: 30,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 5
  }
})