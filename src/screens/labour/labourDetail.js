import React, { useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import { FlatList, ScrollView, Share, StyleSheet, View } from 'react-native';
import { green, red, white } from 'src/utils/color';
import moment from 'moment';
import { sortBy, sumBy } from 'lodash';
import { useRoute, useTheme } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import { commonStyle } from 'src/utils/style';
import LabourDetailAction from '../../container/labour/labourDetailAction';
import {
  deleteLabour,
  getLabourExpense,
  getLabourLeave,
} from '../../network/labour-service';
import LabourExpenseDetail from '../../container/labour/labourExpenseDetail';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack, navigate } from '../../navigation/ref';
import Button from '../../components/button';
import { currencyFormat } from '../../utils/dateformat';
import RNFS from 'react-native-fs'
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function LabourDetail({ navigation }) {
  const { params } = useRoute();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const data = params?.item ?? [];
  const [totalLabour, setTotalLabour] = useState(0);
  const [expense, setExpense] = useState([]);

  useEffect(() => {
    getExpense();
  }, [data]);

  const getExpense = async () => {
    try {
      setLoading(true);
      let res = await getLabourExpense(data?.labour);
      setExpense(res);
      setLoading(false);
      let html = '<h1>My Firestore Data</h1>';
      html += '<ul>';

      res.forEach(item => {
        html += `<li>${item.amount}: ${item.date}</li>`;
      });

      html += '</ul>';
      const options = {
        html: html,
        fileName: 'my-pdf',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      console.log(file.filePath);
      const pdfPath = `${RNFS.DocumentDirectoryPath}/users.pdf`;
      // await RNFS.writeFile(pdfPath, pdfBytes, 'binary');

    } catch (error) {
      ToastError(error?.message, 'Labour');
      setLoading(false);
    }
  };
  useEffect(() => {
    if (Array.isArray(data.data) && data.data.length) {
      let tot = 0;
      data.data.map(v => {
        tot += parseFloat(v?.count) * parseFloat(v?.rate);
      });
      setTotalLabour(tot);
    }
  }, [data]);

  let expenseTot =
    Array.isArray(expense) && expense.length
      ? sumBy(expense, o => parseFloat(o?.amount))
      : 0;

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
            label={strings.add_labour}
            btnStyle={{ width: '40%' }}
            onPress={() =>
              navigate('AddLabour', {
                data:
                  Array.isArray(data?.data) && data?.data.length
                    ? { ...data, ...data?.data[0] }
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
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.total_labour}</Text>
          <Text h3 style={{ color: green }}>
            {data?.total}
          </Text>
        </View>
        <View style={[styles.row, styles.underline]}>
          <Text h3>{strings.labour_amount}</Text>
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
        <View style={styles.wt}>
          <Text h4 style={styles.underline}>
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
            <Text>No Record</Text>
          )}
        </View>
        <View style={styles.wt}>
          <Text h4 style={styles.underline}>
            {strings.amount}
          </Text>
          {Array.isArray(expense) && expense.length ? (
            sortBy(expense, (a, b) => moment(b?.date) - moment(a?.date)).map(
              (v, i) => (
                <LabourExpenseDetail
                  key={i}
                  data={v}
                  onPress={async () => {
                    if (
                      !data?.total &&
                      Array.isArray(data.data) &&
                      data.data.length &&
                      expense.length == 1
                    )
                      await deleteLabour(data?.data[0]?.id);
                  }}
                />
              ),
            )
          ) : (
            <Text>No Record</Text>
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
    width: '100%',
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
