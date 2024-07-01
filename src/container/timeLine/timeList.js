import React, { useEffect, useState } from 'react';
import Text from 'src/components/text';
import Button from 'src/components/button';
import {
  FlatList,
  PixelRatio,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import { white } from 'src/utils/colors';
import { reduce, groupBy, sumBy } from 'lodash';
import { strings } from 'src/translations/locale';
import { navigate } from 'src/navigation/ref';
import { currencyFormat } from 'src/utils/dateformat';
import { ToastError } from '../../utils/toast';
import {
  aqua,
  gray4,
  green,
  greenDark,
  greenLight,
  lightOrange,
  lightRed,
  red,
} from '../../utils/colors';
import Animated from 'react-native-reanimated';
import auth from '@react-native-firebase/auth';
import { getTotalInterst } from '../../utils/helper';
import Timeline from 'react-native-timeline-flatlist';
import { useTimeline } from '../../context/timeContext';
import moment from 'moment';

export default function TimeList({ data }) {
  const renderItem = item => {
    // console.log(item,)
    return (
      <View style={styles.list}>
        <Text h5>{moment(item.date).format('DD-MM-YYYY')}</Text>
        <Text numberOfLines={1} h6>
          {moment(item.date).format('H:mm')}
        </Text>
        <Text h4>{currencyFormat(parseFloat(item.amount))}</Text>
      </View>
    );
  };
  // console.log(data,'----11---222--')
  return (
    <View style={styles.container}>
      <Timeline
        data={data}
        renderTime={renderItem}
      // circleSize={20}
      // circleColor={red}
      // separator={true}
      // lineColor={aqua}
      //   timeContainerStyle={{minWidth: 52, marginTop: -5}}
      // timeStyle={styles.time}
      // descriptionStyle={styles.description}
      // options={{
      //   style: {paddingTop: 5},
      // }}
      // showTime={false}
      // isUsingFlatlist={true}
      />
    </View>
  );
}
const styles = StyleSheet.create({
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
  container: {
    backgroundColor: white,
    flex: 1,
    width: '100%',

    padding: 20,
  },
  time: {
    textAlign: 'center',
    backgroundColor: green,
    color: white,
    padding: 5,
    borderRadius: 13,
    fontSize: 10,
    overflow: 'hidden',
  },
  description: {
    backgroundColor: gray4,
    fontSize: 15,
  },
});
