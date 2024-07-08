import React, { useCallback, useEffect, useState } from 'react';
import BaseView from 'src/container/base';
import Text from 'src/components/text';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import { green, red, white } from 'src/utils/colors';
import moment from 'moment';
import { sortBy, sumBy } from 'lodash';
import { useFocusEffect, useRoute, useTheme } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import Button from 'src/components/button';
import GiverDetailAction from 'src/components/giverDetailAction';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import { currencyFormat, interestFormat } from '../../utils/dateformat';
import { ToastError } from '../../utils/toast';
import Loader from 'src/components/loader';
import { dateFormat } from 'src/utils/dateformat';
import { navigate, replace } from 'src/navigation/ref';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useAuth } from '../../context/authContext';
import { useLang } from 'src/context/langContext';

import { deleteGiverCollection } from '../../network/interest-service';

import { gray4, greenLight, lightYellow, peach } from '../../utils/colors';
import Share from 'react-native-share';
import { useAadt } from '../../context/aadtContext';
import { getTotalInterst } from '../../utils/helper';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { common } from '@utils/style';
import AadhatTransacton from '@container/aadhat/aadhatTransaction';

const transparent = 'rgba(0,0,0,0.5)';
const { card, row_btw, underline, shadow } = common;

export default function CropDetail() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { lang } = useLang();
  const {
    params: { data },
  } = useRoute();
  const [openModal, setopenModal] = useState(false);

  //   function renderModal() {
  //     return (
  //       <Modal visible={openModal} animationType="slide" transparent={true}>
  //         <View style={styles.modal}>
  //           <View
  //             style={{
  //               backgroundColor: 'white',
  //               padding: 20,
  //               width: '90%',
  //               borderRadius: 10,
  //               // height:110,
  //             }}>
  //             <Text
  //               h2
  //               style={{
  //                 fontWeight: '700',
  //               }}>
  //               {strings.are_you_sure}
  //             </Text>
  //             <Text
  //               h3
  //               style={{
  //                 marginTop: 10,
  //               }}>
  //               <Text
  //                 h2
  //                 style={{
  //                   fontWeight: '700',
  //                   color: red,
  //                 }}>
  //                 {data[0]?.giver}
  //               </Text>
  //               {strings.alert}
  //             </Text>

  //             <View
  //               style={{
  //                 flexDirection: 'row',
  //                 justifyContent: 'space-between',
  //                 marginTop: 10,
  //               }}>
  //               <Loader visible={loading} />
  //               <Button
  //                 label={strings.delete}
  //                 btnStyle={{ width: '40%', backgroundColor: red }}
  //                 size={30}
  //                 style={{ color: red, display: __DEV__ ? 'flex' : 'none' }}
  //                 onPress={async () => {
  //                   try {
  //                     setLoading(true);
  //                     setopenModal(false);

  //                     await deleteGiverCollection(data[0]?.giver);
  //                     setLoading(false);
  //                     goBack();
  //                   } catch (error) {
  //                     setLoading(false);
  //                     ToastError(error?.message);
  //                   }
  //                 }}
  //               // type="MaterialCommunityIcons"
  //               />
  //               <Button
  //                 label={strings.cancel}
  //                 btnStyle={{ width: '40%', backgroundColor: gray4 }}
  //                 size={30}
  //                 onPress={() => setopenModal(false)}
  //               />
  //             </View>
  //           </View>
  //         </View>
  //       </Modal>
  //     );
  //   }

  //   const onShare = async () => {
  //     if (!user?.name) {
  //       ToastError('Please Complete your profile');
  //       navigate('EditProfile');
  //       return;
  //     }
  //     let html = `<!DOCTYPE html>
  // <html>
  // <head>
  // <style>
  // table, th, td {
  //   border: 1px solid black;
  //   border-collapse: collapse;
  //   padding:10px;
  // }
  // td {
  //   text-align: center;
  // }
  // </style>
  // </head>
  // <body>
  //       <div style="display: flex; flex-direction:column; align-items:center">
  //           <div style="display: flex; justify-content: space-between; width:100%">
  //           <div>
  //           <h2>${strings.farmer_name}: ${user?.name}</h2>
  //           <p>${user?.phone}</p>
  //           <p>${user?.email}</p>
  //           </div>
  //           <div>
  //           <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
  //               <p>${moment().format('lll')}</p>
  //           </div>
  //           </div>
  //           <h2>${strings.giver_name}: ${data[0]?.giver}</h2>
  //       </div>
  //       <div style="display: flex; justify-content: space-between;">
  //           <div>
  //               <h3>${strings.total_principal}: ${currencyFormat(sumBy(data, o => parseFloat(o?.amount)))}
  //     </h3>

  //       </div>
  //       <div>
  //       <h3>${strings.total_interest}: ${currencyFormat(interest)} </h3>
  //           </div>
  //       </div>
  //       <div>
  //       <h3>${strings.total_amount}  : ${currencyFormat(getTotalInterst(data)
  //     )}</h3>
  //         </div>

  //       <h2>${strings.aadhatiya_hisab}</h2>
  //       <table style="width:100%">
  //       <tr>
  //       <th>"${strings.date}</th>
  //       <th>${strings.day}</th>
  //       <th>${strings.interest}</th>
  //       <th>${strings.total_principal}</th>
  //       <th>${strings.total_interest}</th>
  //       <th>${strings.total_amount}</th>
  //       <th>${strings.remark}</th>
  //   </tr>
  //           ${sortBy(data, (a, b) => moment(b?.date) - moment(a?.date)).map(
  //       record => {
  //         let date = moment(record?.date).format('YYYY-MM-DD');
  //         let start_date = moment(date);
  //         let today = moment();
  //         let days = today.diff(start_date, 'days');
  //         let interest = (
  //           ((parseFloat(record?.amount) *
  //             (parseFloat(record?.interest_rate) / 100)) /
  //             30) *
  //           parseInt(days)
  //         ).toFixed(2);
  //         let final_amount =
  //           parseFloat(record?.amount) + parseFloat(interest);
  //         return `<tr>
  //               <td>${dateFormat(record?.date)}</td>
  //               <td>${days}</td>
  //                <td>${record?.interest_rate}</td>
  //               <td>${currencyFormat(record?.amount)}</td>
  //               <td>${currencyFormat(interest)}</td>
  //               <td>${currencyFormat(final_amount)}</td>
  //               <td>${record?.detail}</td>
  //           </tr>`;
  //       },
  //     )}
  //       </table>
  //   </body>
  // </html>
  //   `;

  //     const options = {
  //       html: html,
  //       base64: true,
  //       fileName: data[0]?.giver,
  //       directory: 'Documents',
  //     };

  //     const file = await RNHTMLtoPDF.convert(options);
  //     Share.open({
  //       url: `data:application/pdf;base64,${file?.base64}`,
  //       type: 'application/pdf',
  //       title: data[0]?.giver,
  //       saveToFiles: true,
  //       showAppsToView: true,
  //       filename: data[0]?.giver,
  //     })
  //       .then(res => console.log(res, '---res'))
  //       .catch(err => console.log(err, '----err'));
  //   };

  return (
    <BaseView>
      <Header
        back
        label={strings.crop_hisab}
      // share
      // deleteIcon
      />

      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: '20%' }}>
        <Animated.View
          entering={FadeIn.delay(100)}
          style={[
            card,
            shadow,
            { backgroundColor: colors.background, margin: 20 },
          ]}>
          <View style={[row_btw]}>
            <Text h4 entering={FadeInUp}>
              {strings.interest}
            </Text>
            <Text medium h4 entering={FadeInUp}>
              {interestFormat(data[0]?.interest_rate)}
            </Text>
          </View>
          <View style={[row_btw, { marginTop: 20 }]}>
            <Text h4 entering={FadeInUp}>
              {strings.crop} / {strings.given_amount}
            </Text>
            <Text medium h4 entering={FadeInUp}>
              {currencyFormat(data[0]?.totalGivenAmount)}
            </Text>
          </View>
          <View style={[row_btw, { marginTop: 20 }]}>
            <Text h4 entering={FadeInUp}>
              {strings.total_interest}
            </Text>
            <Text medium h4 entering={FadeInUp}>
              {currencyFormat(data[0]?.totalGivenAmountInterest)}
            </Text>
          </View>
          <View style={[row_btw, { marginTop: 20 }]}>
            <Text medium h4 entering={FadeInUp}>
              {strings.total_amount}
            </Text>
            <Text medium h4 entering={FadeInUp}>
              {currencyFormat(data[0]?.totalGivenAmountWithInterest)}
            </Text>
          </View>
        </Animated.View>
        {Array.isArray(data[0]?.transactions) && data[0].transactions.length ? (
          data[0].transactions.map((item, i) => (
            <AadhatTransacton type={'giver'} key={i} data={data} item={item} />
          ))
        ) : (
          <Text>{strings.no_data}</Text>
        )}
      </ScrollView>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: green,
    paddingHorizontal: 25,
    paddingVertical: 15,
    width: '120%',
  },
  row: {
    ...common.row_btw,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  underline: {
    // borderBottomWidth: 1,
    paddingVertical: 10,
    marginVertical: 10,
    // borderStyle: 'dotted',
  },
  wt: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
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
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
});
