import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
// import { StyleSheet, View } from 'react-native';
import { green, red, white, gray4 } from 'src/utils/color';
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
import { useAuth } from '../../context/authContext';
import Share from 'react-native-share';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { ToastError } from '../../utils/toast';
import { deletePickerNameWise } from '../../sql';
import auth from '@react-native-firebase/auth';



const transparent = 'rgba(0,0,0,0.5)';

export default function RegularLabourDetail() {
  const { params } = useRoute();
  const { colors } = useTheme();
  const { user } = useAuth();
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
  const {
    db,

  } = useState();


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
              {strings.are_you_sure}     <Text numberOfLines={1} style={{ color: green }} h3>
                {data?.is_regulare ? strings.regular : ''}
              </Text>
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
                {data?.labour}
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
                style={{ color: red, display: __DEV__ ? 'flex' : 'none' }}
                onPress={async () => {
                  try {
                    setLoading(true);
                    setopenModal(false);
                    await deletePickerNameWise(db, {
                      ...data,
                      uid: auth().currentUser?.uid,
                    });
                    await deletePickerCollection(data?.labour);
                    getPickerWeight();
                    getPickerExpense();
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
  padding:13px;
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
          <h2>${strings.farmer_name}: ${user?.name}</h2>
          <p>${user?.phone}</p>
          <p>${user?.email}</p>
          </div>
          <div>
          <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
              <p>${moment().format('lll')}</p>
          </div>
          </div>
          <h2>${strings.labour_name}: ${data?.labour}</h2>
      </div>
      <div style="display: flex; justify-content: space-between;">
          <div>
              <h3>${strings.start_date}: ${dateFormat(find(data?.data, o => o?.is_regulare === true)?.date)}</h3>
    <h3>${strings.total_days_from_start}: ${days}
    </h3>
    <h3>${strings.extra_labour}: ${extraDay}
      </h3>
      <h3>${strings.leaves}: ${leaveTot}
        </h3>
      </div>
      <div>
      <h3>${strings.labour_day} : ${days + extraDay - leaveTot}
    </h3>
    <h3>${strings.labour_rate}: ${currencyFormat(data?.data[0]?.rate)}
      </h3>
    <h3>${strings.total_labour_amount} : ${currencyFormat(totalLabour
    )}</h3>
    <h3>${strings.given_amount}: ${currencyFormat(expenseTot
    )}</h3>
          </div>
      </div>
      
      <div>
      <h3>${strings.final}: ${currencyFormat(totalLabour - expenseTot
    )}</h3>
      </div>


      <h2>${strings.labour}</h2>
      <table style="width:100%">
          <tr>
              <th style="width:15%">${strings.date}</th>
              <th style="width:15%">${strings.labour_name}</th>
              <th style="width:10%">${strings.labour}</th>
              <th style="width:10%">${strings.labour_rate}</th>
              <th style="width:15%">${strings.amount}</th>
              <th style="width:30%">${strings.remark}</th>
          </tr>
         ${data.data.map(v =>
      v?.data
        ? null
        : `<tr>
              <td style="width:15%">${dateFormat(data?.date)}</td>
              <td style="width:15%">${data?.labour}</td>
              <td style="width:10%">${v?.count}
        </td>
              <td style="width:10%">${currencyFormat(v?.rate)}</td>
              <td style="width:15%">${currencyFormat(parseFloat(v?.rate) * parseFloat(v?.count))}
        </td>
              <td style="width:30%">${v?.detail}</td>
          </tr>`,
    )}
      </table>

      <h2>${strings.labour_amount}</h2>
      <table style="width:100%">
          <tr>
              <th id="date">${strings.date}</th>
              <th>${strings.labour}</th>
              <th>${strings.amount}</th>
              <th>${strings.remark}</th>
          </tr>
          ${expense.map(
      amount =>
        `<tr>
              <td id="date">${dateFormat(amount?.date)}</td>
              <td>${amount?.labour}</td>
              <td>${currencyFormat(amount?.amount)}</td>
              <td>${amount?.detail}</td>
          </tr>`,
    )}
      </table>
      
      <h2>${strings.leaves}</h2>
      <table style="width:100%">
          <tr>
              <th id="date">${strings.date}</th>
              <th>${strings.labour}</th>
              <th>${strings.leave}</th>
              <th>${strings.extra_labour}</th>
              <th>${strings.remark}</th>
          </tr>
          ${data, leaves.map(o =>
      o?.data
        ? null
        : `<tr>
              <td id="date">${dateFormat(data?.date)}</td>
              <th>${data?.labour}</th>
              <td>${o?.count}</td>
              <td>${extraDay}</td>
              <td>${o?.detail}</td>
          </tr>`,
    )}
      </table>
  </body>
</html>
  `;

    const options = {
      html: html,
      base64: true,
      fileName: data?.labour,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    Share.open({
      url: `data:application/pdf;base64,${file?.base64}`,
      type: 'application/pdf',
      title: data?.labour,
      saveToFiles: true,
      showAppsToView: true,
      filename: data?.labour,
    })
      .then(res => console.log(res, '---res'))
      .catch(err => console.log(err, '----err'));
  };


  return (
    <BaseView >
      <Loader visible={loading} />
      <Header
        style={styles.header}
        leftComponent={
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name="back"
              size={28}
              style={{ color: white, marginRight: 5 }}
              onPress={() => goBack()}
            />
          </View>
        }
        centerComponent={
          <Text h2 numberOfLines={1} style={{ width: '50%', color: white }}>
            {data?.labour}
          </Text>
        }
        rightComponent={
          <View style={{ flexDirection: 'row' }}>
            <Icon
              name="pdffile1"
              size={25}
              color={white}
              style={{
                marginRight: 15,
                // display: labourData.length > 1 ? 'flex' : 'none',
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
      {/* <Header
        leftComponent={
        }
        centerComponent={<Text h2>{data?.labour}</Text>}
        rightComponent={
          <Text numberOfLines={1} style={{ color: green }} h4>
            {data?.is_regulare ? strings.regular : ''}
          </Text>
        }
      /> */}

      <Animated.ScrollView
        style={[{ width: '100%' }]}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={{ alignSelf: "center", marginTop: 8 }}>
          <Text numberOfLines={1} style={{ color: green }} h4>
            {data?.is_regulare ? strings.regular : ''}
          </Text>
        </View>
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
          <Text h3>{strings.total_labour_amount}</Text>
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
      <Header
        style={{ paddingHorizontal: 20 }}
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
  header: {
    backgroundColor: green,
    paddingHorizontal: '10%',
    width: '120%',
    paddingVertical: 15,
    elevation: 15,
  },
  row: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
    // marginTop:5,
    paddingHorizontal: 10
  },
  underline: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderStyle: 'dotted',
  },
  subhead: {
    textAlign: 'center',
    marginTop: 30,
    // borderBottomWidth: 1,
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
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
});
