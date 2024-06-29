// import React, { memo, useCallback, useEffect, useState } from 'react';
// import Text from 'src/components/text';
// import {
//     FlatList,
//     PixelRatio,
//     StyleSheet,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import _, { filter, sumBy } from 'lodash';
// import { strings } from '../../translations/locale';
// import { navigate } from 'src/navigation/ref';
// import BaseView from 'src/container/base';
// import { ToastError } from '../../utils/toast';
// import {
//     green,
//     red,
//     black,
//     greenDark,
//     gray3,
//     blue,
// } from '../../utils/color';
// import { currencyFormat, dateFormat, kg } from '../../utils/dateformat';
// import Button from '../../components/button';
// import Icon from '../../components/icon';
// import Loader from '../../components/loader';
// import { useCotton } from '../../context/cottonContext';
// import { useFocusEffect, useRoute } from '@react-navigation/native';
// import moment from 'moment';
// import Header from '../../components/header';
// import { getPickerFinal, updatePickerGid } from '../../sql';
// import { goBack } from '../../navigation/ref';
// import Search from '../../components/search';
// import Share from 'react-native-share';
// import { useAuth } from '../../context/authContext';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';

// export default function GroupDetail() {
//     const {
//         params: { name },
//     } = useRoute();
//     const { db, pickerWeight, pickerExpense, getPickerWeight, getPickerExpense } =
//         useCotton();
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [isSearchActive, setSearchActive] = useState(false);
//     const { user } = useAuth();
//     useFocusEffect(
//         useCallback(() => {
//             getPickerWeight();
//             getPickerExpense();
//             getData();
//         }, []),
//     );
//     const getData = async () => {
//         try {
//             setLoading(true);
//             let data = await getPickerFinal(db);
//             setData(
//                 filter(data, o => (name != 'null' ? o?.gname == name : !o?.gname || o?.gname == 'null')),
//             );
//             setLoading(false);
//         } catch (error) {
//             setLoading(false);
//             ToastError(error?.message, 'Picker');
//         }
//     };

//     const RenderItem = memo(({ item }) => {
//         const todayWeight =
//             sumBy(
//                 filter(
//                     pickerWeight,
//                     o =>
//                         moment(o?.date).isSame(moment(), 'day') &&
//                         o?.picker === item?.picker,
//                 ),
//                 p => parseFloat(p.weight),
//             ) ?? 0;

//         const todayExpense =
//             sumBy(
//                 filter(
//                     pickerExpense,
//                     o =>
//                         moment(o?.date).isSame(moment(), 'day') &&
//                         o?.picker === item?.picker,
//                 ),
//                 p => parseFloat(p.amount),
//             ) ?? 0;

//         return (
//             <TouchableOpacity
//                 style={[styles.list]}
//                 onPress={() => navigate('PickerDetail', { item })}>
//                 <View style={styles.row}>
//                     <Text numberOfLines={1} h3 style={{ width: '60%' }}>
//                         {item?.picker}
//                     </Text>
//                     <Text
//                         numberOfLines={1}
//                         h3
//                         style={{
//                             color:
//                                 (!isNaN(item?.total_rate_weight - item?.total_given_amount)
//                                     ? item?.total_rate_weight - item?.total_given_amount
//                                     : 0) >= 0
//                                     ? greenDark
//                                     : red,
//                         }}>
//                         {currencyFormat(
//                             !isNaN(item?.total_rate_weight - item?.total_given_amount)
//                                 ? item?.total_rate_weight - item?.total_given_amount
//                                 : 0,
//                         )}{' '}
//                     </Text>
//                 </View>
//                 <View style={[styles.row, { marginVertical: 0 }]}>
//                     <Text
//                         style={{
//                             fontSize: 15 / PixelRatio.getFontScale(),
//                         }}>
//                         {strings.today}
//                         {'  '}
//                         <Text style={{ color: todayWeight ? 'green' : 'red' }}>
//                             {todayWeight ? todayWeight : ' - '} Kg{'  '}
//                         </Text>
//                         <Text style={{ color: todayExpense ? 'green' : 'red' }}>
//                             {todayExpense ? `${todayExpense} Rs` : ''}
//                         </Text>
//                     </Text>
//                     <Text
//                         numberOfLines={1}
//                         // h3
//                         style={{
//                             fontSize: 15 / PixelRatio.getFontScale(),
//                             color:
//                                 (!isNaN(item?.total_rate_weight - item?.total_given_amount)
//                                     ? item?.total_rate_weight - item?.total_given_amount
//                                     : 0) >= 0
//                                     ? green
//                                     : red,
//                         }}>
//                         {(!isNaN(item?.total_rate_weight - item?.total_given_amount)
//                             ? item?.total_rate_weight - item?.total_given_amount
//                             : 0) >= 0
//                             ? strings.give
//                             : strings.receive}{' '}
//                     </Text>
//                 </View>

//                 <View style={styles.row}>
//                     <Button
//                         hitSlop={10}
//                         label={strings.add_expense}
//                         btnStyle={{
//                             backgroundColor: blue,
//                             width: 'auto',
//                             paddingHorizontal: 8,
//                             height: 25 * PixelRatio.getFontScale(),
//                             borderRadius: 5,
//                             marginVertical: 5,
//                         }}
//                         onPress={() =>
//                             navigate('AddPickerExpense', { data: { picker: item?.picker } })
//                         }
//                     />
//                     <Button
//                         hitSlop={10}
//                         label={strings.add_weight}
//                         btnStyle={{
//                             width: 'auto',
//                             paddingHorizontal: 8,
//                             height: 25 * PixelRatio.getFontScale(),
//                             borderRadius: 5,
//                             marginVertical: 5,
//                         }}
//                         onPress={() =>
//                             navigate('AddPickerWeight', {
//                                 data: {
//                                     picker: item?.picker,
//                                     rate: pickerWeight[pickerWeight.length - 1]?.rate,
//                                 },
//                             })
//                         }
//                     />
//                 </View>
//             </TouchableOpacity>
//         );
//     });
//     const onShare = async () => {
//         if (!user?.name) {
//             ToastError('Please Complete your profile');
//             navigate('EditProfile');
//             return;
//         }
//         let html = `<!DOCTYPE html>
//         <html>
//         <head>
//         <style>
//         table, th, td {
//           border: 1px solid black;
//           border-collapse: collapse;
//           padding:10px;
//         }
//         .picker {
//            margin-top:50px;
//           }
//         td {
//           text-align: center;
//         }
//         </style>
//         </head>
//         <body>
//               <div style="display: flex; flex-direction:column; align-items:center">
//                   <div style="display: flex; justify-content: space-between; width:100%">
//                   <div>    
//                   <h2>${strings.farmer_name}: ${user?.name}</h2>
//                   <p>${user?.phone}</p>
//                   <p>${user?.email}</p>
//                   </div>
//                   <div>
//                   <a href="https://play.google.com/store/apps/details?id=com.profarmer">Pro Farmer</a>
//                       <p>${moment().format('lll')}</p>
//                   </div>
//                   </div>
//                   <h2 style="color:green;">${strings.group_name}: ${name != 'null' ? name : strings.other}</h2>
//               </div>
//              ${data.map(data => {
//             let pickerData = pickerWeight.filter(o => data?.picker === o.picker);
//             let pickerExpenseData = pickerExpense.filter(o => data?.picker === o.picker);
//             let amount =
//                 sumBy(
//                     pickerData,
//                     o =>
//                         parseFloat(o.weight) * (parseFloat(o.rate)),
//                 ) - sumBy(pickerExpenseData, o => parseFloat(o.amount));
//             return (
//                 `<div class="picker">
//               <div>
//               <h2 style="color:red;">${strings.picker_name}: ${data?.picker}</h2>
//               </div>
//               <div style="display: flex; justify-content: space-between;">
//                   <div>
//                       <h3>${strings.total_weight}: ${sumBy(pickerData, o =>
//                     parseFloat(o.weight),
//                 )} Kg</h3>
//             <h3>${strings.given_amount}: ${currencyFormat(
//                     sumBy(pickerExpenseData, o => parseFloat(o.amount)),
//                 )}</h3>
//               </div>
//               <div>
//               <h3>${strings.total_amount} (${strings.weight}*${strings.enter_rate
//                 }):  ${currencyFormat(
//                     sumBy(
//                         pickerData,
//                         o =>
//                             parseFloat(o.weight) * parseFloat(o.rate),
//                     ),
//                 )}</h3>
//                       <h3>${strings.final}: ${currencyFormat(
//                     !isNaN(amount) ? amount : 0,
//                 )}</h3>
//                   </div>
//               </div>
        
        
//               <h2>${strings.pickers_weight}</h2>
//               <table style="width:100%">
//                   <tr>
//                       <th style="width:15%">${strings.date}</th>
//                       <th style="width:10%">${strings.enter_rate}</th>
//                       <th style="width:10%">${strings.weight}</th>
//                       <th style="width:15%">${strings.amount}</th>
//                       <th style="width:30%">${strings.remark}</th>
//                   </tr>
//                  ${pickerData.map(record =>
//                     record?.weight == '0'
//                         ? null
//                         : `<tr>
//                       <td style="width:15%">${dateFormat(record?.date)}</td>
//                       <td style="width:10%">${currencyFormat(
//                             record?.rate,
//                         )}</td>
//                       <td style="width:10%">${record?.weight}Kg</td>
//                       <td style="width:15%">${currencyFormat(
//                             record?.rate * record?.weight,
//                         )}</td>
//                       <td style="width:30%">${record?.detail}</td>
//                   </tr>`,
//                 )}
//               </table>
//               <h2>${strings.pickers_amounts}</h2>
//               <table style="width:100%">
//                   <tr>
//                       <th id="date">${strings.date}</th>
//                       <th>${strings.amount}</th>
//                       <th>${strings.remark}</th>
//                   </tr>
//                   ${pickerExpenseData.map(
//                     amount =>
//                         `<tr>
//                       <td id="date">${dateFormat(amount?.date)}</td>
//                       <td>${currencyFormat(amount?.amount)}</td>
//                       <td>${amount?.detail}</td>
//                   </tr>`,
//                 )}
//               </table>
//         </div>`)
//         })}
//           </body>
//         </html>
//           `;

//         const options = {
//             html: html,
//             base64: true,
//             fileName: name != 'null' ? name : strings.other,
//             directory: 'Documents',
//         };

//         const file = await RNHTMLtoPDF.convert(options);
//         Share.open({
//             url: `data:application/pdf;base64,${file?.base64}`,
//             type: 'application/pdf',
//             title: name != 'null' ? name : strings.other,
//             saveToFiles: true,
//             showAppsToView: true,
//             filename: name != 'null' ? name : strings.other,
//         })
//             .then(res => console.log(res, '---res'))
//             .catch(err => console.log(err, '----err'));
//     };

//     return (
//         <BaseView style={{ padding: 10 }}>
//             <Header
//                 leftComponent={
//                     <Icon name="back" size={28} color={black} onPress={() => goBack()} />
//                 }
//                 centerComponent={<Text h2>{name != 'null' ? name : strings.other}</Text>}
//                 rightComponent={
//                     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                         <Icon
//                             name="pdffile1"
//                             size={25}
//                             color={black}
//                             style={{
//                                 marginRight: 5,
//                             }}
//                             onPress={onShare}
//                         />
//                         <Icon
//                             name="search1"
//                             size={25}
//                             color={black}
//                             onPress={() => setSearchActive(true)}
//                         />
//                     </View>
//                 }
//             />
//             <View style={{ width: '100%' }}>
//                 <Search
//                     isSearchActive={isSearchActive}
//                     setSearchActive={setSearchActive}
//                     data={data}
//                     hidden
//                 />
//             </View>
//             <Loader visible={loading} />
//             <FlatList
//                 style={{ width: '100%', display: isSearchActive ? 'none' : 'flex' }}
//                 contentContainerStyle={{ paddingBottom: 150 }}
//                 data={data}
//                 keyExtractor={item => Math.random().toString()}
//                 extraData={data}
//                 showsVerticalScrollIndicator={false}
//                 renderItem={({ item }) => <RenderItem item={item} />}
//             />
//         </BaseView>
//     );
// }
// const styles = StyleSheet.create({
//     header: {
//         backgroundColor: green,
//         paddingHorizontal: 15,
//         paddingVertical: 15,
//         elevation: 15,
//     },
//     list: {
//         marginVertical: 10,
//         width: '100%',
//         // backgroundColor:"red",
//         borderBottomWidth: StyleSheet.hairlineWidth,
//         width: '100%',
//     },
//     row: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         width: '100%',
//         marginVertical: 5,
//     },
//     icon: {
//         elevation: 1,
//         width: 30,
//         height: 30,
//         textAlign: 'center',
//         textAlignVertical: 'center',
//         borderRadius: 5,
//     },
//     checkBox: {
//         marginRight: 10,
//         width: 25,
//         height: 25,
//         borderRadius: 15,
//         borderWidth: 2,
//         borderColor: gray3,
//         alignSelf: 'center',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     checked: {
//         backgroundColor: green,
//         width: 18,
//         height: 18,
//         borderRadius: 10,
//     },
// });
