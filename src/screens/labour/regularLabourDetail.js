import React, { useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import { StyleSheet, View } from 'react-native';
import { green, red, white } from 'src/utils/color';
import moment from 'moment';
import { filter, find, sortBy, sumBy } from 'lodash';
import { useRoute, useTheme } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import LabourDetailAction from '../../container/labour/labourDetailAction';
import { getLabourExpense, getLabourLeave } from '../../network/labour-service';
import LabourExpenseDetail from '../../container/labour/labourExpenseDetail';
import { currencyFormat, dateFormat, dayCount } from '../../utils/dateformat';
import Header from '../../components/header';
import Icon from '../../components/icon';
import LabourLeaveDetail from '../../container/labour/labourLeaveDetail';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Button from '../../components/button';
import { goBack, navigate } from '../../navigation/ref';

export default function RegularLabourDetail() {
  const { params } = useRoute();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const data = params?.item ?? [];
  const [totalLabour, setTotalLabour] = useState(0);
  const [expense, setExpense] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    getExpense();
  }, [data]);

  const getExpense = async () => {
    try {
      setLoading(true);
      let res = await getLabourExpense(data?.labour);
      setExpense(res);
      let leave = await getLabourLeave(data?.labour);
      setLeaves(leave);
      setLoading(false);
    } catch (error) {
      ToastError(error?.message, 'Labour');
      setLoading(false);
    }
  };

  let extraDay = parseInt(
    sumBy(
      filter(data?.data, o => !o?.is_regulare),
      o => parseInt(o.count),
    ),
  );
  let expenseTot =
    Array.isArray(expense) && expense.length
      ? sumBy(expense, o => parseFloat(o?.amount))
      : 0;
  let date = moment(find(data?.data, o => o?.is_regulare === true)?.date).format("YYYY-MM-DD");
  let start_date = moment(date);
  let today = moment();
  let days = today.diff(start_date, 'days');
  let leaveTot =
    Array.isArray(leaves) && leaves.length
      ? sumBy(leaves, o => parseFloat(o?.count))
      : 0;

  useEffect(() => {
    if (Array.isArray(data.data) && data.data.length) {
      let tot = 0;
      data.data.map(v => {
        tot +=
          (v?.is_regulare ? dayCount(v?.date) - leaveTot : parseInt(v?.count)) *
          parseFloat(v?.rate);
      });
      setTotalLabour(tot);
    }
  }, [data, leaveTot]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header
        leftComponent={
          <Icon
            name="back"
            size={28}
            color={colors.text}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text h2>{data?.labour}</Text>}
        rightComponent={
          <Text numberOfLines={1} style={{ color: green }} h4>
            {data?.is_regulare ? strings.regular : ''}
          </Text>
        }
      />

      <Header
        leftComponent={
          <Button
            label={strings.add_leave}
            btnStyle={{ width: '40%' }}
            onPress={() =>
              // { console.log(Array.isArray(data?.data) && data?.data.length ? data?.data[0] : data)}
              navigate('AddLabourLeave', {
                item:
                  Array.isArray(data?.data) && data?.data.length
                    ? data?.data[0]
                    : data,
              })
            }
          />
        }
        rightComponent={
          <Button
            label={strings.add_expense}
            btnStyle={{ width: '40%' }}
            onPress={() =>
              navigate('AddLabourExpense', { data: { labour: data?.labour } })
            }
          />
        }
      />
      <Animated.ScrollView
        style={[{ width: '100%' }]}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.start_date}</Text>
          <Text h3 style={{ color: green }}>
            {dateFormat(find(data?.data, o => o?.is_regulare === true)?.date)}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.total_days_from_start}</Text>
          <Text h3 style={{ color: green }}>
            {days}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.extra_labour}</Text>
          <Text h3 style={{ color: green }}>
            {extraDay}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.leaves}</Text>
          <Text h3 style={{ color: red }}>
            {leaveTot}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.labour_day}</Text>
          <Text h3 style={{ color: green }}>
            {days + extraDay - leaveTot}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.labour_rate}</Text>
          <Text h3 style={{ color: green }}>
            {currencyFormat(data?.data[0]?.rate)}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.total_labour}</Text>
          <Text h3 style={{ color: green }}>
            {currencyFormat(totalLabour)}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.given_amount}</Text>
          <Text h3 style={{ color: red }}>
            {currencyFormat(expenseTot)}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.final}</Text>
          <Text h3 style={{ color: totalLabour - expenseTot > 0 ? green : red }}>
            {currencyFormat(totalLabour - expenseTot)}
          </Text>
        </View>
        <Text h3 style={styles.subhead}>
          {strings.leaves}
        </Text>
        {Array.isArray(leaves) && leaves.length ? (
          <Animated.View style={styles.wt} entering={FadeInUp}>
            {sortBy(leaves, (a, b) => moment(b?.date) - moment(a?.date)).map(
              (v, i) => (
                <LabourLeaveDetail key={i} data={v} />
              ),
            )}
          </Animated.View>
        ) : (
          <Text>0</Text>
        )}
        <Text h3 style={styles.subhead}>
          {strings.labour_record}
        </Text>
        {Array.isArray(data.data) && data.data.length && data?.total ? (
          sortBy(data.data, (a, b) => moment(b?.date) - moment(a?.date)).map(
            (v, i) => (
              <LabourDetailAction
                key={i}
                data={v}
                totalExpense={expense.length}
                totalLabour={data?.total}
              />
            ),
          )
        ) : (
          <Text>{strings.no_record}</Text>
        )}
        <Text h3 style={styles.subhead}>
          {strings.amount}
        </Text>
        {Array.isArray(expense) && expense.length ? (
          <Animated.View style={styles.wt} entering={FadeInUp}>
            {sortBy(expense, (a, b) => moment(b?.date) - moment(a?.date)).map(
              (v, i) => (
                <LabourExpenseDetail key={i} data={v} onPress={() => { }} />
              ),
            )}
          </Animated.View>
        ) : (
          <Text>0</Text>
        )}
      </Animated.ScrollView>
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
    width: '100%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  underline: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderStyle: 'dotted',
  },
  subhead: {
    textAlign: 'center',
    marginTop: 30,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderStyle: 'dashed',
  },
  wt: {
    width: '100%',
    alignItems: 'center',
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
