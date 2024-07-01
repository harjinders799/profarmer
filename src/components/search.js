// import React, { useEffect, useState } from 'react';
// import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
// import Text from 'src/components/text';
// import Icon from 'src/components/icon';
// import Input from 'src/components/input';
// import Button from 'src/components/button';
// import { HEIGHT } from 'src/utils/constants';
// import { strings } from 'src/translations/locale';
// import { gray1, gray10, navy } from '../utils/color';
// import { useCotton } from '../context/cottonContext';
// import { goBack, navigate } from '../navigation/ref';
// import _, { groupBy, some, sumBy } from 'lodash';

// export default function Search({
//   isSearchActive,
//   setSearchActive,
//   style,
//   data = null,
//   hidden = false
// }) {
//   const { pickerWeight = [] } = useCotton();
//   let grpPicker = groupBy(data ? data : pickerWeight, v => v.picker);

//   const [searchKey, setSearchKey] = React.useState();
//   const [filteredData, setFilteredData] = React.useState([]);

//   useEffect(() => {
//     setFilteredData(Object.keys(grpPicker));
//   }, [isSearchActive]);
//   const onFilter = v => {
//     setFilteredData(
//       Object.keys(grpPicker).filter(item =>
//         item.toLowerCase().includes(v.toLowerCase()),
//       ),
//     );
//   };

//   const goBack = () => {
//     setSearchActive(false);
//     setFilteredData([]);
//   };

//   return (
//     <>
//       <Icon
//         name="search1"
//         size={25}
//         color={gray10}
//         style={[
//           {
//             position: 'absolute',
//             right: 0,
//             top: 0,
//             display: hidden ? 'none' : pickerWeight.length ? 'flex' : 'none',
//           },
//           style,
//         ]}
//         onPress={() => setSearchActive(true)}
//       />

//       {isSearchActive ? (
//         <>
//           <Input
//             autoFocus
//             placeholder={strings.search}
//             autoCapitalize="words"
//             onBlur={() => {
//               setSearchActive(false);
//             }}
//             value={searchKey}
//             setValue={v => {
//               setSearchKey(v);
//               onFilter(v);
//             }}
//             style={{ width: '70%', height: 40 }}
//             // inputStyle={{ height: 40, paddingBottom: 5 }}
//             // style={{ width: '50%', height: 40, marginTop: 10 }}
//             inputStyle={{ padding: 5 }}
//             rightComponent={
//               <Button
//                 label={strings.cancel}
//                 btnStyle={{
//                   width: '40%',
//                   marginVertical: 0,
//                   marginLeft: 10,
//                 }}
//                 onPress={goBack}
//               />
//             }
//           />
//           <FlatList
//             data={filteredData}
//             keyboardShouldPersistTaps="always"
//             keyExtractor={item => Math.random().toString(6).substr(2)}
//             automaticallyAdjustKeyboardInsets
//             contentContainerStyle={{ paddingBottom: 10 }}
//             showsVerticalScrollIndicator={false}
//             ListEmptyComponent={
//               <Text style={{ marginTop: 20, textAlign: 'center' }}>
//                 {strings.no_record_found}
//               </Text>
//             }
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.list}
//                 onPress={() =>
//                   navigate('PickerDetail', { item: { picker: item } })
//                 }>
//                 <Text h3> {item} </Text>

//                 <View style={{ flexDirection: 'row' }}>
//                   <Button
//                     hitSlop={10}
//                     label={strings.add_weight}
//                     btnStyle={{
//                       marginRight: 10,
//                       width: 'auto',
//                       paddingHorizontal: 8,
//                       height: 25,
//                       borderRadius: 5,
//                       marginVertical: 0,
//                     }}
//                     onPress={() =>
//                       navigate('AddPickerWeight', {
//                         data: {
//                           picker: item,
//                           rate: grpPicker[item][grpPicker[item].length - 1]
//                             ?.rate,
//                         },
//                       })
//                     }
//                   />
//                   <Button
//                     hitSlop={10}
//                     label={strings.add_expense}
//                     btnStyle={{
//                       backgroundColor: navy,
//                       marginRight: 10,
//                       width: 'auto',
//                       paddingHorizontal: 8,
//                       height: 25,
//                       borderRadius: 5,
//                       marginVertical: 0,
//                     }}
//                     onPress={() =>
//                       navigate('AddPickerExpense', {
//                         data: { picker: item },
//                       })
//                     }
//                   />
//                 </View>
//               </TouchableOpacity>
//             )}
//             ItemSeparatorComponent={() => (
//               <View style={{ borderBottomWidth: StyleSheet.hairlineWidth }} />
//             )}
//           />
//         </>
//       ) : null}
//     </>
//   );
// }
// const styles = StyleSheet.create({
//   screen: {
//     height: 50,
//     marginBottom: 10,
//     flex: 1,
//   },
//   item: {
//     borderWidth: 1,
//     height: 50,
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     flexDirection: 'row',
//     paddingRight: 13,
//     width: '100%',
//   },
//   modal: {
//     paddingHorizontal: 20,
//     height: HEIGHT / 2,
//     zIndex: 900009,
//     elevation: 5,
//     borderRadius: 10,
//     borderWidth: 1,
//   },
//   btn: {
//     width: '30%',
//     height: 30,
//     alignSelf: 'center',
//   },
//   list: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginVertical: 20,
//   },
// });
