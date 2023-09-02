// import {View, StyleSheet, Alert} from 'react-native';
// import React from 'react';
// import Icon from './icon';
// import Text from './text';
// import {orange, red} from 'src/utils/color';
// import {navigate, replace} from 'src/navigation/ref';
// import {strings} from 'src/translations/locale';
// import {deleteCottonWt} from 'src/network/cotton-service';
// import {ToastError, ToastSuccess} from 'src/utils/toast';
// import Loader from './loader';
// import {dateFormat} from 'src/utils/dateformat';

// export default function PickerDetailAction({data, picker}) {
//   const [loading, setLoading] = React.useState(false);

//   const delteData = async () => {
//     Alert.alert(
//       strings.weight,
//       `${strings.delete_wt} ${data?.weight}Kg`,
//       [
//         {
//           text: 'Yes',
//           onPress: async () => {
//             setLoading(true);
//             await deleteCottonWt(data?.id);
//             setLoading(false);
//             ToastSuccess(strings.weight_delete, 'Weight');
//             navigate('Tabs');
//           },
//         },
//         {
//           text: 'No',
//         },
//       ],
//       {cancelable: true},
//     );
//   };
//   return (
//     <View style={styles.list}>
//       <Loader visible={loading} />
//       <View style={styles.row}>
//         <Text h3 numberOfLines={1} style={styles.picker}>
//           {picker ? dateFormat(data?.date) : data?.picker}
//         </Text>
//         <Text h3 numberOfLines={1} style={styles.wt}>
//           {data?.weight}kg
//         </Text>
//       </View>
//       <View style={styles.icons}>
//         <Icon
//           name="edit"
//           size={20}
//           color={orange}
//           onPress={() => replace('CottonWeightAdd', {data})}
//         />
//         <Icon name="delete" size={20} color={red} onPress={delteData} />
//       </View>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   list: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '98%',
//   },
//   row: {
//     width: '70%',
//     marginRight: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginVertical: 5,
//   },
//   icons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     width: '20%',
//     justifyContent: 'space-between',
//   },
//   picker: {
//     width: '55%',
//   },
//   farm: {
//     textAlign: 'left',
//   },
//   wt: {
//     width: '35%',
//     textAlign: 'right',
//   },
// });
