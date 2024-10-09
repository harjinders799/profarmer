import React, { useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import { ScrollView, StyleSheet, PixelRatio, View } from 'react-native';
import moment from 'moment';
import { sortBy } from 'lodash';
import { useRoute, useTheme } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import Button from 'src/components/button';
import Header from '../../components/header';
import { goBack } from '../../navigation/ref';
import { currencyFormat } from '../../utils/dateformat';
import { ToastError } from '../../utils/toast';
import Loader from 'src/components/loader';
import { navigate, replace } from 'src/navigation/ref';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useAuth } from '../../context/authContext';
import { deleteLoanCollection } from '../../network/loan-service';
import Share from 'react-native-share';
import LoanDetailAction from '../../container/loan/loanDetailAction';
import { common } from '@utils/style';
import DeleteModal from '@container/deleteModal';
import { loanHTMLFormat } from '@html/loan';
import auth from '@react-native-firebase/auth';

const transparent = 'rgba(0,0,0,0.5)';

export default function LoanDetail() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { params } = useRoute();
  const data = params?.item ?? {};
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      setOpenModal(false);
      await deleteLoanCollection(data?.id);
      setLoading(false);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  };

  const handleShare = async () => {
    const html = loanHTMLFormat(strings, user, data);
    const options = {
      html: html,
      base64: true,
      fileName: data?.name,
      directory: 'Documents',
    };
    const file = await RNHTMLtoPDF.convert(options);
    Share.open({
      // url: `data:application/pdf;base64,${file?.base64}`,
      url: `file://${file?.filePath}`,
      message: strings.shareMessage,
      type: 'application/pdf',
      title: data?.name,
      // saveToFiles: true,
      showAppsToView: true,
      filename: data?.name,
    })
      .then(res => console.log(res, '---res'))
      .catch(err => console.log(err, '----err'));
  };

  return (
    <BaseView>
      <Header
        back
        label={data?.name}
        share
        deleteIcon={data?.uid == auth()?.currentUser?.uid}
        onDeletePress={() => setOpenModal(true)}
        onSharePress={handleShare}
      />
      <Loader visible={loading} />
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{
          paddingBottom: '100%',
        }}
        stickyHeaderIndices={[2]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.error }]}>
          <View style={styles.row}>
            <View style={{ alignItems: 'flex-start', padding: 10 }}>
              <Text h4 bold color={colors.background}>
                {currencyFormat(data?.totalGivenAmountWithInterest, 2)}
              </Text>
              <Text h5 color={colors.background}>
                Given
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View
                style={[
                  styles.innerCard,
                  {
                    backgroundColor: colors.background + 40,
                    borderBottomLeftRadius: 20
                  },
                ]}>
                <Text h4 bold color={colors.background}>
                  {currencyFormat(data?.totalGivenAmount, 2)}
                </Text>
                <Text h6 color={colors.background}>
                  {strings.taken_amount}
                </Text>
              </View>
              <View
                style={[
                  styles.innerCard,
                  {
                    backgroundColor: colors.background + 40,
                    marginTop: 10,
                    borderTopLeftRadius: 20
                  },
                ]}>
                <Text h4 bold color={colors.background}>
                  {currencyFormat(data?.totalGivenAmountInterest, 2)}
                </Text>
                <Text h6 color={colors.background}>
                  {strings.interest}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.card, { backgroundColor: colors.success }]}>
          <View style={styles.row}>
            <View style={{ alignItems: 'flex-start', padding: 10 }}>
              <Text h4 bold color={colors.background}>
                {currencyFormat(data?.totalReceivedAmountWithInterest, 2)}
              </Text>
              <Text h5 color={colors.background}>
                Taken
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={[
                styles.innerCard,
                {
                  backgroundColor: colors.background + 40,
                  borderBottomLeftRadius: 20
                },
              ]}>
                <Text h4 bold color={colors.background}>
                  {currencyFormat(data?.totalReceivedAmount, 2)}
                </Text>
                <Text h6 color={colors.background}>
                  {strings.taken_amount}
                </Text>
              </View>
              <View
                style={[
                  styles.innerCard,
                  {
                    backgroundColor: colors.background + 40,
                    marginTop: 10,
                    borderTopLeftRadius: 20
                  },
                ]}>
                <Text h4 bold color={colors.background}>
                  {currencyFormat(data?.totalReceivedAmountInterest, 2)}
                </Text>
                <Text h6 color={colors.background}>
                  {strings.interest}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            {
              ...common.card,
              ...common.shadow,
              paddingVertical: 15,
              marginHorizontal: 20,
              backgroundColor: colors.secondaryCard,
            },
          ]}>
          <View style={common.row_btw}>
            <Text h4 bold>
              Final Amount
            </Text>
            <Text
              h2
              bold
              color={data?.finalAmount < 0 ? colors.error : colors.success}>
              {currencyFormat(
                data?.finalAmount > 0 ? data?.finalAmount : -data?.finalAmount,
              )}
            </Text>
          </View>
          <Text
            h6
            center
            color={data?.finalAmount < 0 ? colors.error : colors.success}
            style={{ position: 'absolute', bottom: -10, alignSelf: 'center' }}>
            {data?.finalAmount < 0 ? strings.give : strings.receive}
          </Text>
        </View>
        {Array.isArray(data?.transactions) && data.transactions.length ? (
          sortBy(
            data.transactions,
            (a, b) => moment(b?.date) - moment(a?.date),
          ).map((o, i) => <LoanDetailAction key={i} item={o} data={data} />)
        ) : (
          null
        )}
      </ScrollView>
      <DeleteModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        data={data}
        onDelete={onDelete}
      />
      <Button
        hitSlop={10}
        label={strings.receive}
        btnStyle={{
          display: data?.uid == auth()?.currentUser?.uid ? 'flex' : 'none',
          backgroundColor: colors.success,
          width: '40%',
          position: 'absolute',
          bottom: 5,
          left: 30,
          zIndex: 999,
          height: 35 * PixelRatio.getFontScale(),
        }}
        onPress={() =>
          navigate('AddCredit', {
            data: {
              ...data,
              type: 'receiver',
            },
          })
        }
      />
      <Button
        hitSlop={10}
        label={strings.give}
        btnStyle={{
          display: data?.uid == auth()?.currentUser?.uid ? 'flex' : 'none',
          backgroundColor: colors.error,
          width: '40%',
          position: 'absolute',
          bottom: 5,
          right: 30,
          zIndex: 999,
          height: 35 * PixelRatio.getFontScale(),
        }}
        onPress={() =>
          navigate('AddCredit', {
            data: {
              ...data,
              type: 'giver',
            },
          })
        }
      />
    </BaseView>
  );
}
const styles = StyleSheet.create({
  row: {
    ...common.row_btw,
    marginVertical: 5,
  },
  card: {
    ...common.card,
    ...common.shadow,
    marginBottom: 10,
    padding: 0,
    marginHorizontal: 20,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
  underline: {
    width: '100%',
  },
  text: {
    width: '50%',
  },
  cardtext: {
    width: '80%',
    textAlign: 'center',
  },
  innerCard: {
    // borderTopLeftRadius: 20,
    marginVertical: -5,
    // borderBottomLeftRadius: 20,
    paddingLeft: 25,
    paddingRight: 15,
    padding: 10,
    paddingVertical: 5,
  },
});
