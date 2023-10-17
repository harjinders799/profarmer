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
import {getTimelineData} from '../../network/time-service';
import {useTimeline} from '../../context/timeContext';

export default function TimeDetail({navigation}) {
  const { params } = useRoute();
  const {getTimeline, timelineData = [] } = useTimeline();
  const data = params?.items ?? {};
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      getTimeline();
      // getData();
    }, [isFocused]),
  );
 

  const renderItem = item => {
    return (
      // <BaseView>
      <View style={styles.list}>
        <Text h5>{moment(item.date).format('DD-MM-YYYY')}</Text>
        <Text numberOfLines={1} h6>
          {moment(item.date).format('H:mm')}
        </Text>
        <Text h4>{currencyFormat(parseFloat(item?.amount))}</Text>
     
      </View>
    // </BaseView>
    );
  }

  console.log(data?.crop,'---crop--')
  return (
    <BaseView>
      <Header
        style={styles.header}
        leftComponent={
          <Icon name="back" size={28} color={white} onPress={() => goBack()} />
        }
        centerComponent={
          <Text h2 style={{color: white, fontWeight: 'bold'}}>
             {data[0]?.crop}
          </Text>
        }
        rightComponent={<Text h2>
          
          {currencyFormat(sumBy(data, o => parseInt(o.amount)))}
            </Text>}
      />
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
  container: {
    backgroundColor: white,
    flex: 1,
    width: '100%',
    padding: 20,
  },
  list: {
    borderRadius: 10,
    // elevation: 3,
    paddingVertical: 10,
    width: 50,
    height: 100,
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
