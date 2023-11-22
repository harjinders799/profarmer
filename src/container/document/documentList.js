import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import Button from 'src/components/button';
import {
  FlatList,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { white } from 'src/utils/color';
import { reduce, groupBy, sumBy } from 'lodash';
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import { currencyFormat } from 'src/utils/dateformat';
import { ToastError } from '../../utils/toast';
import { aqua, blue, greenDark, greenLight, lightOrange, orange, red } from '../../utils/color';
import Animated, { clockRunning } from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import { getTotalInterst } from '../../utils/helper';
import { useDocument } from '../../context/docContext';
import { useFocusEffect } from '@react-navigation/native';
import { dateFormat } from '../../utils/dateformat';
import moment from 'moment';

export default function DocumentList() {
  const { documentData = [], getDocument } = useDocument();
  const [loading, setLoading] = useState(true);


  useFocusEffect(
    useCallback(() => {
      getDocument();
    }, []),
  );
  console.log(documentData)
  const renderItem = item => {
    let start_date = moment(moment(item.expiry_date).format('YYYY-MM-DD'));
    let today = moment();
    let days = start_date.diff(today, 'days');
    return (
      <View style={styles.list}>
        <TouchableOpacity
          onPress={() => navigate('Uploade', { item })}>
          <View style={styles.row}>
            <Text numberOfLines={1} h3 style={{ width: '60%' }}>
              {item?.name}
            </Text>
            <View styles={{ flexDirection: "row", width: "100%" }}>
              <Text
                numberOfLines={1}
                h3
                style={{
                  // color: taken - expiry_date >= 0 ? red : greenDark,
                }}>
                {dateFormat(item?.expiry_date)}
              </Text>
            </View>

          </View>
          <View style={[styles.row, { borderBottomWidth: 1,borderStyle:"dashed" }]}>
            <Text h3>{strings.remaining_day}</Text>
            <Text h3>{days}</Text>
            
          </View>
          {/* <View style={styles.row}>
            <Button
              hitSlop={10}
              label={strings.renew}
              btnStyle={{
                backgroundColor: blue,
                width: 'auto',
                paddingHorizontal: 8,
                height: 25 * PixelRatio.getFontScale(),
                borderRadius: 5,
                marginVertical: 5,
              }}

              onPress={() => navigate('DocumentUpdate')}

            />
          </View> */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      style={{ width: '100%' }}
      contentContainerStyle={{ paddingBottom: 150 }}
      data={documentData}
      keyExtractor={item => Math.random().toString()}
      ListEmptyComponent={() => (
        <Text style={{ textAlign: 'center', paddingTop: 30 }}>
          {strings.no_data}
        </Text>
      )}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => renderItem(item)}
    />
  );
}
const styles = StyleSheet.create({
  list: {
    borderRadius: 10,
    // elevation: 3,
    paddingVertical: 10,
    width: '100%',
    alignSelf: 'center',
    // backgroundColor:red
    // flexDirection:"row"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
    marginTop: 10,

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
    width: '100%',
  },
});
