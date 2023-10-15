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
import {useFocusEffect} from '@react-navigation/native';
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
  const {lang} = useLang();
  const { params } = useRoute();
  const crop = params?.crop ?? {};
  const [loading, setLoading] = useState(true);
  // export default function TimeList({data}) {

  useFocusEffect(
    useCallback(() => {
      // getTimeline();
      getData();
    }, [navigation, lang]),
  );
  // const getData = async () => {
  //   try {
  //     setFullData(await getTimelineData(crop.crop));
  //     setLoading(false);
  //   } catch (error) {
  //     ToastError(error?.message, 'Crop');
  //     setLoading(false);
  //   }
  // };
  console.log(crop,'----name--')
   const getData = async () => {
    try {
      let res = await getTimelineData(crop.crop);
      if (Array.isArray(res) && res.length) {
       setData(res);
      } else setData([]);
      setLoading(false);
    } catch (error) {
      ToastError(error?.message, 'Crop');
      setLoading(false);
    }
  };
  // console.log(data, '----data--');
    
  //   return (
  //     <BaseView>
  //     <Header
  //     style={{ marginTop: 10 }}
  //     leftComponent={
  //       <Icon name="back" size={28} color={green} onPress={() => goBack()} />
  //     }
  //     centerComponent={<Text h2 style={{ color: green, fontWeight: "bold",}}>
  //         {crop?.crop}</Text>}
  //     rightComponent={<Text h2> </Text>}
  // />
  //       {/* <TimeList data={data}/> */}
  //       {/* <Button
  //         iconName="plus"
  //         iconColor={white}
  //         label={strings.add_event}
  //         btnStyle={{
  //           width: 'auto',
  //           height: 50,
  //           position: 'absolute',
  //           bottom: 20,
  //           right: 30,
  //           zIndex: 999,
  //         }}
  //         onPress={() => navigate('AddEvent',{crop})}
  //       /> */}
  //     </BaseView>
  //   );

  const renderItem = item => {
    //  list file  console.log(item,)
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
  return (
    <BaseView>
      <Header
        style={styles.header}
        leftComponent={
          <Icon name="back" size={28} color={white} onPress={() => goBack()} />
        }
        centerComponent={
          <Text h2 style={{color: white, fontWeight: 'bold'}}>
            {strings.timeline}
          </Text>
        }
        rightComponent={<Text h2> </Text>}
      />
      <View style={styles.container}>
        <Timeline
          data={crop?.crop}
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
