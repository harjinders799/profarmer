import React, {useEffect, useState} from 'react';
import Text from 'src/components/text';
import Button from 'src/components/button';
import {
  FlatList,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {white} from 'src/utils/color';
import {reduce, groupBy, sumBy} from 'lodash';
import {strings} from 'src/translations/locale';
import {navigate} from 'src/navigation/ref';
import {currencyFormat} from 'src/utils/dateformat';
import {ToastError} from '../../utils/toast';
import Loader from 'src/components/loader';
import {
  aqua,
  cyan,
  gray10,
  green,
  greenDark,
  greenLight,
  lightBlue,
  lightGreen,
  lightOrange,
  navy,
  red,
  skyBlue,
} from '../../utils/color';
import Animated from 'react-native-reanimated';
import {useLoan} from '../../context/loanContext';
import auth from '@react-native-firebase/auth';

export default function LoanList() {
  const {loanData = []} = useLoan();
  const [loading, setLoading] = useState(true);
  let data = [];

  const groupedData = groupBy(loanData, d =>
    d?.giver == auth().currentUser.uid ? d?.receiver.trim() : d?.giver.trim(),
  );
  
  Object.keys(groupedData).map(o => {
    data.push({
      name: o,
      interest_rate:groupedData[o][0]?.interest_rate
      
    });
  });
  
  const renderItem = item => {
    const totalAmount = sumBy(groupedData[item?.name], (entry) => parseInt(entry?.amount));
  
    return (
      <View style={styles.list}>
        <TouchableOpacity
          // disabled={loading}
          onPress={() => navigate('LoanDetail', {item,totalAmount })}>
          <View style={styles.row}>
            <Text numberOfLines={1} h3 style={{width: '60%'}}>
              {item?.name}
            </Text>
              <Text
                numberOfLines={1} h3> { currencyFormat( totalAmount )}
              </Text>
          </View>
          <Animated.View
            style={styles.row}
            // entering={FadeIn}
            // layout={Layout.}
          >
            <View style={{flexDirection: 'row'}}>
              <Button
                hitSlop={10}
                label={strings.credit}
                btnStyle={{
                  backgroundColor: lightOrange,
                  marginRight: 10,
                  width: 'auto',
                  paddingHorizontal: 8,
                  height: 25 * PixelRatio.getFontScale(),
                  borderRadius: 5,
                  marginVertical: 0,
                }}
                onPress={() =>
                  navigate('AddCredit', {
                    data: {
                      receiver: auth().currentUser.uid,
                      giver: item?.name,
                      type: 'credit',
                      interest_rate:item?.interest_rate
                    },
                  })
                }
              />
              <Button
                hitSlop={10}
                label={strings.debt}
                btnStyle={{
                  backgroundColor: aqua,
                  marginRight: 10,
                  width: 'auto',
                  paddingHorizontal: 8,
                  height: 25 * PixelRatio.getFontScale(),
                  borderRadius: 5,
                  marginVertical: 0,
                }}
                onPress={() =>
                  navigate('AddCredit', {
                    data: {
                      giver: auth().currentUser.uid,
                      receiver: item?.name,
                      type: 'debt',
                      interest_rate:item?.interest_rate
                    },
                  })
                }
              />
            </View>
            <Text
              numberOfLines={1}
              h3
              style={{
                color: loading
                  ? greenLight
                  : (!isNaN(item?.amount) ? item?.amount : 0) >= 0
                  ? greenLight
                  : red,
              }}>
              {!loading
                ? (!isNaN(item?.amount) ? item?.amount : 0) >= 0
                  ? strings.give
                  : strings.receive
                : '__'}{' '}
            </Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      style={{width: '100%'}}
      contentContainerStyle={{paddingBottom: 150}}
      data={data}
      keyExtractor={item => Math.random().toString()}
      ListEmptyComponent={() => (
        <Text style={{textAlign: 'center', paddingTop: 30}}>
          {strings.no_data}
        </Text>
      )}
      showsVerticalScrollIndicator={false}
      renderItem={({item}) => renderItem(item)}
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
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
