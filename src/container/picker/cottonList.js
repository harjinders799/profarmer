// import {View, StyleSheet, TouchableOpacity} from 'react-native';
// import React, {useState} from 'react';
// import Text from 'src/components/text';
// import {dateFormat} from 'src/utils/dateformat';
// import {white} from 'src/utils/color';
// import {navigate} from 'src/navigation/ref';

// export default function CottonList({data}) {
//   return (
//     <View style={styles.list}>
//       <TouchableOpacity
//         style={styles.row}
//         onPress={() => navigate('CottonDateFilter', {data})}>
//         <Text numberOfLines={1} h3>
//           {dateFormat(data?.date)}
//         </Text>
//         <Text numberOfLines={1} h3>
//           {data?.total} Kg
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   list: {
//     borderRadius: 10,
//     elevation: 3,
//     backgroundColor: white,
//     padding: 10,
//     marginVertical: 10,
//     width: '98%',
//     alignSelf: 'center',
//   },
//   sublist: {
//     width: '100%',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginVertical: 5,
//   },
//   picker: {
//     width: '35%',
//   },
//   farm: {
//     textAlign: 'left',
//   },
//   wt: {
//     textAlign: 'right',
//   },
// });
