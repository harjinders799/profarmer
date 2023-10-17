import {StyleSheet, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import {useLang} from 'src/context/langContext';
import Loader from '../../components/loader';
import {strings} from '../../translations/locale';
import Button from '../../components/button';
import {gray4, green, red, white} from '../../utils/color';
import Header from '../../components/header';
import Icon from '../../components/icon';
import {ToastError} from '../../utils/toast';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import TimeList from '../../container/timeLine/timeList';
import {goBack, navigate} from '../../navigation/ref';
import {useRoute} from '@react-navigation/native';
import {groupBy, sumBy} from 'lodash';
import moment from 'moment';
import {currencyFormat} from 'src/utils/dateformat';
import Timeline from 'react-native-timeline-flatlist';
import { useHarvest } from '../../context/harvestContext';

export default function HarvestDetail({navigation}) {
  const { params } = useRoute();
  const {getHarvest, harvestData = [] } = useHarvest();
  const data = params?.items ?? {};
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [rate, setRate] = useState();

  useFocusEffect(
    useCallback(() => {
      getHarvest();
      // getData();
    }, [isFocused]),
  );
 
  let amount =
    sumBy(
      harvestData,
      o =>
        parseFloat(o.amount) * (parseFloat(rate) ));


  return (
    <BaseView>
      <Header
        style={styles.header}
        leftComponent={
          <Icon name="back" size={28} color={white} onPress={() => goBack()} />
        }
        centerComponent={
          <Text h2 style={{color: white, fontWeight: 'bold'}}>
             {data[0]?.name}
          </Text>
        }
        rightComponent={<Text h2>
          
          {/* {currencyFormat(sumBy(data, o => parseInt(o.amount)))} */}
            </Text>}
      />
      <View style={[styles.card, { backgroundColor: red }]}>
        <View style={styles.row}>
          <View style={{ alignItems: 'flex-start', padding: 10 }}>
            <Text h3 style={{ color: white, fontWeight: 'bold' }}>
              {currencyFormat(amount)}
            </Text>
            <Text h4 style={{ color: white }}>
              Given
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <View style={styles.innerCard}>
              <Text h3 style={{ color: white, fontWeight: 'bold' }}>
                {currencyFormat(amount)}
              </Text>
              <Text h5 style={{ color: white }}>
                {strings.taken_amount}
              </Text>
            </View>
            <View
              style={[
                styles.innerCard,
                {
                  marginTop: 5,
                },
              ]}>
              <Text h3 style={{ color: white, fontWeight: 'bold' }}>
                {/* {currencyFormat(givenInterest)} */}
          
          {currencyFormat(sumBy(data, o => parseInt(o.amount)))}
              </Text>
              <Text h5 style={{ color: white }}>
                {strings.interest}
              </Text>
            </View>
          </View>
        </View>
      </View>
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
  list: {
    borderRadius: 10,
    // elevation: 3,
    paddingVertical: 10,
    width: 50,
    height: 100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
  },
  card: {
    elevation: 5,
    backgroundColor: white,
    width: '100%',
    marginVertical: 5,
    borderRadius: 10,
    alignItems: 'center',
  },

});
