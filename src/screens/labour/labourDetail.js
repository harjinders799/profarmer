import { View, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import Loader from 'src/components/loader';
import { green, red, white, greenDark } from '../../utils/colors';
import { sumBy } from 'lodash';
import { useRoute, useTheme } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import { common } from 'src/utils/style';
import { getLabourExpense, getLabourWork } from '../../network/labour-service';
import { ToastError } from '../../utils/toast';
import LabourExpenseDetail from '../../container/labour/labourExpenseDetail';
import Header from '../../components/header';
import { navigate } from '../../navigation/ref';
import { currencyFormat } from '../../utils/dateformat';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useAuth } from '../../context/authContext';
import Share from 'react-native-share';
import LabourWorkDetail from '@container/labour/labourWorkDetail';
import { laborHTMLFormat } from '@html/labour';
import LabourDeleteModal from '@container/labour/labourDeleteModal';

const transparent = 'rgba(0,0,0,0.5)';

export default function LabourDetail({ navigation }) {
  const { params } = useRoute();
  const { colors } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const data = params?.item ?? [];
  const [openModal, setOpenModal] = useState(false);
  const [work, setWork] = useState([]);
  const [expense, setExpense] = useState([]);

  useEffect(() => {
    const unsubscribeWork = getLabourWork(data?.id, updatedWork => {
      console.log({ updatedWork });
      setWork(updatedWork);
      setLoading(false);
    });
    const unsubscribeExpense = getLabourExpense(data?.id, updatedExpense => {
      console.log({ updatedExpense });
      setExpense(updatedExpense);
      setLoading(false);
    });
    return () => {
      if (unsubscribeWork) unsubscribeWork();
      if (unsubscribeExpense) unsubscribeExpense();
    };
  }, [data]);

  const onShare = async () => {
    if (!user?.name) {
      ToastError('Please Complete your profile');
      navigate('EditProfile');
      return;
    }
    let html = laborHTMLFormat(strings, user, data, work, expense);

    const options = {
      html: html,
      base64: true,
      fileName: data?.name,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    Share.open({
      url: `data:application/pdf;base64,${file?.base64}`,
      type: 'application/pdf',
      title: data?.name,
      saveToFiles: true,
      showAppsToView: true,
      filename: data?.name,
    })
      .then(res => console.log(res, '---res'))
      .catch(err => console.log(err, '----err'));
  };

  return (
    <BaseView style={{ paddingHorizontal: 0 }}>
      <Loader visible={loading} />

      <Header
        back
        label={data?.name}
        deleteIcon
        share
        onDeletePress={() => {
          setOpenModal(true);
        }}
        onSharePress={onShare}
      />

      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.row]}>
          <View style={[styles.card, { backgroundColor: '#bbdffc' }]}>
            <Text h2 style={{ fontWeight: 'bold' }}>
              {sumBy(work, o => parseFloat(o?.count))}
              {/* {parseFloat(data?.total_labour_count)} */}
            </Text>
            <Text h3>{strings.total_labour}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#ffccaa' }]}>
            {/* <Text h3 style={{ color: green }}> */}
            <Text h2 style={{ fontWeight: 'bold' }}>
              {currencyFormat(
                sumBy(work, o => parseFloat(o?.count) * parseFloat(o?.rate)),
              )}
              {/* {currencyFormat(data?.total_labour_amount)} */}
            </Text>
            <Text h3>{strings.labour_amount}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#bee8ba' }]}>
            {/* <Text h3>{strings.given_amount}</Text> */}
            {/* <Text h3 style={{ color: red }}> */}
            <Text h2 style={{ fontWeight: 'bold' }}>
              {currencyFormat(sumBy(expense, o => parseFloat(o?.amount)))}
              {/* {currencyFormat(data?.given_amount)} */}
            </Text>
            <Text h3>{strings.given_amount}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#e5e5e5' }]}>
            <Text
              h2
              style={{
                fontWeight: 'bold',
                color:
                  sumBy(work, o => parseFloat(o?.count) * parseFloat(o?.rate)) -
                    sumBy(expense, o => parseFloat(o?.amount)) >
                    0
                    ? greenDark
                    : red,
              }}>
              {currencyFormat(
                sumBy(work, o => parseFloat(o?.count) * parseFloat(o?.rate)) -
                sumBy(expense, o => parseFloat(o?.amount)),
              )}
            </Text>
            <Text h3>{strings.final}</Text>
          </View>
        </View>
        <LabourWorkDetail data={data} work={work} />
        <LabourExpenseDetail data={data} expense={expense} />
      </ScrollView>
      <LabourDeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data}
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
    width: '98%',
    alignSelf: 'center',
  },
  header: {
    backgroundColor: green,
    paddingHorizontal: 15,
    paddingVertical: 15,
    elevation: 15,
  },
  row: {
    ...common.row_btw,
    marginVertical: 5,
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  card: {
    elevation: 5,
    backgroundColor: white,
    width: '48%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  underline: {
    // borderBottomWidth: 1,
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
  modal: {
    flexShrink: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
});
