import { StyleSheet,TouchableOpacity, View } from 'react-native';
import React, { useState, useCallback } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { useLang } from 'src/context/langContext';
import { strings } from '../../translations/locale';
import Button from '../../components/button';
import { white } from '../../utils/color';
import { navigate } from 'src/navigation/ref';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { currencyFormat } from '../../utils/dateformat';
import { useTimeline } from '../../context/timeContext';
import TimeList from '../../container/timeLine/timeList';
import { getTimelineData } from '../../network/time-service';
import { ToastError } from '../../utils/toast';

export default function Timeline({navigation,data }) {
  const { lang } = useLang();
  const [loading, setLoading] = useState(true);
  // const [data, setData] = useState([]);

 
  useFocusEffect(
    useCallback(() => {
      // getData();
      getTimelineData()
    }, [navigation, lang]),
  );
  // const getData = async () => {
  //   try {
  //     let res = await getTimelineData();
  //     if (Array.isArray(res) && res.length) {
  //      setData(res);
  //     } else setData([]);
  //     setLoading(false);
  //   } catch (error) {
  //     ToastError(error?.message, 'Crop');
  //     setLoading(false);
  //   }
  // };
  // console.log(crop,'----crop')
  console.log(data,'----data')
  return (
    <BaseView>
    <Text h2 style={{ padding: 20, textAlign: 'center' }}>
      {strings.add_event}
    </Text>
    {/* <TouchableOpacity style={styles.list} onPress={() => navigate('TimeDetail',{data:crop})} >
    <Loader visible={loading} />
    
    <View style={styles.row}>
    <Text h4>{data?.crop}</Text>
    <Text numberOfLines={1} h3 style={{ width: '70%' }}>
            {strings.crop}
            </Text>
          <Text h5>{strings.view}</Text>
        </View>
        <View style={styles.row}>
          <Text numberOfLines={1} h4>
            
          </Text>
          <Text
        style={{ width: '37%', textAlign: 'right' }}
        h4>
        {currencyFormat(final_amount)}
      </Text>
    <Text h4>{data?.detail}</Text>
    </View>
  </TouchableOpacity> */}

      <TimeList data={data}/>

      <Button
        iconName="plus"
        iconColor={white}
        label={strings.add_crop}
        btnStyle={{
          width: 'auto',
          paddingHorizontal: 15,
          height: 50,
          position: 'absolute',
          bottom: 20,
          right: 30,
          zIndex: 999,
        }}
        onPress={() => navigate('Crops')}
      />
    </BaseView>
  );
}

const styles = StyleSheet.create({});
