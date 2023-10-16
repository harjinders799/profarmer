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
  // const {timelineData: data, getTimeline} = useTimeline();
  const { params } = useRoute();
  const {getTimeline, timelineData = [] } = useTimeline();
  const data = params?.item ?? {};
  const [loading, setLoading] = useState(true);
  const cropName = data?.crop;
  const { amount, crop,title,description } = data;
  const isFocused = useIsFocused();
  // export default function TimeList({data}) {

  useFocusEffect(
    useCallback(() => {
      getTimeline();
      // getData();
    }, [isFocused]),
  );
 
  console.log(data,'----data--')
  
  

  // const renderItem = item => {
  //   //  list file  console.log(item,)
    // return (
    //   <BaseView>
    //   <View style={styles.list}>
    //     <Text h5>{moment(data.date).format('DD-MM-YYYY')}</Text>
    //     <Text numberOfLines={1} h6>
    //       {moment(data.date).format('H:mm')}
    //     </Text>
    //     <Text h4>{currencyFormat(parseFloat(data.amount))}</Text>
    //   </View>
    // </BaseView>
    // );
  
  return (
    <BaseView>
      <Header
        style={styles.header}
        leftComponent={
          <Icon name="back" size={28} color={white} onPress={() => goBack()} />
        }
        centerComponent={
          <Text h2 style={{color: white, fontWeight: 'bold'}}>
            {/* {strings.timeline} */} 
             {data?.crop}
          </Text>
        }
        rightComponent={<Text h2> </Text>}
      />
      <View style={styles.container}>
       <View style={styles.list}>
        <Text h5>{moment(data.date).format('DD-MM-YYYY')}</Text>
        <Text numberOfLines={1} h6>
          {moment(data.date).format('H:mm')}
        </Text>
        <Text h4>{currencyFormat(parseFloat(data.amount))}</Text>
      </View>
        <Timeline
          data={[data]}
          // renderTime={renderItem}
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
    backgroundColor: red,
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
