import React, { useEffect, useState } from 'react';
import Text from 'src/components/text';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import _, { every, filter, find, groupBy, some, sumBy } from 'lodash';
import { strings } from '../../translations/locale';
import { navigate } from 'src/navigation/ref';
import {
  getLabourExpense,
  getLabourLeave,
} from '../../network/labour-service';
import { ToastError } from '../../utils/toast';
import { green, greenDark, navy, red } from '../../utils/color';
import { currencyFormat, dayCount } from '../../utils/dateformat';
import Button from '../../components/button';
import { WIDTH } from '../../utils/constant';
import Animated from 'react-native-reanimated';

export default function DateWiseList({ data }) {
  const [fullData, setFullData] = useState([]);
  const [loading, setLoading] = useState(true);
  console.log(fullData);
  useEffect(() => {
    if (data.length) getExpense();
    else setFullData([]);
  }, [data]);

  const getExpense = async () => {
    try {
      setLoading(true);
      const groupedLabour = groupBy(data, 'labour');
      console.log(JSON.stringify(groupedLabour));

      const labourData = Object.keys(groupedLabour).map(labour => ({
        labour,
        total: sumBy(groupedLabour[labour], o => parseInt(o.count)),
        is_regulare: some(groupedLabour[labour], { is_regulare: true }),
        data: groupedLabour[labour],
      }));

      const result = await Promise.all(
        labourData.map(async ({ labour }) => {
          const expense = await calculateExpense(labour);
          const leave = await calculateLeave(labour);
          const labourInfo = find(labourData, { labour });
          return { ...expense, ...leave, ...labourInfo };
        }),
      );

      setFullData(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      ToastError(error?.message, 'Labour');
    }
  };

  const calculateExpense = async labour => {
    const expenses = await getLabourExpense(labour);
    const groupedExpenses = groupBy(expenses, v => v.labour);
    const totalAmount = sumBy(groupedExpenses[labour], o => parseInt(o.amount));
    return { amount: totalAmount };
  };

  const calculateLeave = async labour => {
    const leaves = await getLabourLeave(labour);
    const groupedLeaves = groupBy(leaves, v => v.labour);
    const totalLeaves = sumBy(groupedLeaves[labour], o => parseInt(o.count));
    return { leaves: totalLeaves };
  };

  const renderItem = item => {
    let tot = 0;
    console.log({ item })
    if (item.data) {
      item.data.map(v => {
        tot +=
          (v?.is_regulare
            ? item?.leaves
              ? dayCount(v?.date) - item?.leaves
              : dayCount(v?.date)
            : parseInt(v?.count)) * parseFloat(v?.rate);
        return tot;
      });
    }

    return (
      <Animated.View style={[styles.list, styles.line]}>
        <TouchableOpacity
          onPress={() =>
            navigate(
              item?.is_regulare ? 'RegularLabourDetail' : 'LabourDetail',
              { item },
            )
          }>
          {item?.is_regulare ? (
            <Text numberOfLines={1} style={{ color: green }} h4>
              {strings.regular + ' ' + strings.labour}
            </Text>
          ) : null}
          <View style={styles.row}>
            <Text numberOfLines={1} h3 style={{ width: '60%' }}>
              {item?.labour}
            </Text>
            <Text
              numberOfLines={1}
              h3
              style={{
                color: loading
                  ? greenDark
                  : tot - (!isNaN(item?.amount) ? item?.amount : 0) > 0
                    ? greenDark
                    : red,
              }}>
              {!loading
                ? currencyFormat(
                  tot - (!isNaN(item?.amount) ? item?.amount : 0),
                )
                : '__'}{' '}
              {/* {!loading
                    ? (!isNaN(item?.amount) ? item?.amount : 0) >= 0
                      ? strings.give
                      : strings.receive
                    : '__'}{' '} */}
            </Text>
            {/* <Text h5>{strings.view}</Text> */}
          </View>
          {!item?.is_regulare ? (
            <Animated.View style={styles.row}>
              {/* // entering={FadeInUp}
              // layout={Layout.springify}> */}
              {/* <Text numberOfLines={1} h4>
                {strings.final}
              </Text> */}
              <View style={{ flexDirection: 'row' }}>
                <Button
                  hitSlop={10}
                  label={strings.add_expense}
                  btnStyle={{
                    backgroundColor: navy,
                    marginRight: 10,
                    width: 'auto',
                    paddingHorizontal: 8,
                    height: 25,
                    borderRadius: 5,
                    marginVertical: 0,
                  }}
                  onPress={() =>
                    navigate('AddLabourExpense', { data: { labour: item?.labour } })
                  }
                />
              </View>
              <Text
                numberOfLines={1}
                h3
                style={{
                  color: loading
                    ? green
                    : tot - (!isNaN(item?.amount) ? item?.amount : 0) > 0
                      ? green
                      : red,
                }}>
                {/* {!loading
                  ? currencyFormat(
                    tot - (!isNaN(item?.amount) ? item?.amount : 0),
                  )
                  : '__'}{' '} */}
                {!loading
                  ? tot - (!isNaN(item?.amount) ? item?.amount : 0) > 0
                    ? strings.give
                    : strings.receive
                  : '__'}{' '}
              </Text>
            </Animated.View>
          ) : null}
          {item?.is_regulare ? (
            <>
              <Animated.View style={styles.row}>
                {/* // entering={FadeInUp}
                // layout={Layout.damping}> */}
                {/* <Text numberOfLines={1} h4>
                  {strings.final}
                </Text> */}
                <View style={{ flexDirection: 'row' }}>
                  <Button
                    label={strings.add_leave}
                    hitSlop={10}
                    btnStyle={{
                      marginRight: 10,
                      width: 'auto',
                      paddingHorizontal: 8,
                      height: 25,
                      borderRadius: 5,
                      marginVertical: 0,
                    }}
                    onPress={() => navigate('AddLabourLeave', { item })}
                  // onPress={() =>
                  //   navigate('AddPickerWeight', {
                  //     data: {
                  //       picker: item?.picker,
                  //       rate: item.data.income[item.data.income.length - 1]?.rate,
                  //     },
                  //   })
                  // }
                  />
                  <Button
                    hitSlop={10}
                    label={strings.add_expense}
                    btnStyle={{
                      backgroundColor: navy,
                      marginRight: 10,
                      width: 'auto',
                      paddingHorizontal: 8,
                      height: 25,
                      borderRadius: 5,
                      marginVertical: 0,
                    }}
                    onPress={() =>
                      navigate('AddLabourExpense', {
                        data: { labour: item?.labour },
                      })
                    }
                  />
                </View>
                <Text
                  numberOfLines={1}
                  h3
                  style={{
                    color: loading
                      ? green
                      : tot - (!isNaN(item?.amount) ? item?.amount : 0) > 0
                        ? green
                        : red,
                  }}>
                  {/* {!loading
                    ? currencyFormat(
                      tot - (!isNaN(item?.amount) ? item?.amount : 0),
                    )
                    : '__'}{' '} */}
                  {!loading
                    ? tot - (!isNaN(item?.amount) ? item?.amount : 0) > 0
                      ? strings.give
                      : strings.receive
                    : '__'}{' '}
                </Text>
              </Animated.View>
              {/* <Button
                label={strings.add_leave}
                onPress={() => navigate('AddLabourLeave', { item })}
                btnStyle={{ width: '50%', height: 30, marginVertical: 10 }}
              /> */}
            </>
          ) : null}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  return (
    <FlatList
      style={{ width: '100%' }}
      contentContainerStyle={{ paddingBottom: 100 }}
      data={fullData}
      keyExtractor={item => Math.random().toString()}
      ListEmptyComponent={() => (
        <Text style={{ textAlign: 'center', paddingTop: 30 }}>
          {strings.no_data}
        </Text>
      )}
      extraData={data}
      showsVerticalScrollIndicator={false}
      // ItemSeparatorComponent={() => <View style={styles.line} />}
      renderItem={({ item }) => renderItem(item)}
    />
  );
}
const styles = StyleSheet.create({
  list: {
    borderRadius: 10,
    marginTop: 20,
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
  icon: {
    elevation: 1,
    width: 30,
    height: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: 5,
  },
  line: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: WIDTH - 40,
  },
});
