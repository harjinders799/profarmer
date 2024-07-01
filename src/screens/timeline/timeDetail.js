import { StyleSheet, View } from 'react-native';
import React, { useState, useCallback } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { useLang } from 'src/context/langContext';
import Loader from '../../components/loader';
import { strings } from '../../translations/locale';
import Button from '../../components/button';
import { green, white } from '../../utils/colors';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { ToastError } from '../../utils/toast';
import { useFocusEffect } from '@react-navigation/native';
import TimeList from '../../container/timeLine/timeList';
import { goBack, navigate } from '../../navigation/ref';
import { useRoute } from '@react-navigation/native';
import { groupBy, sumBy } from 'lodash';
import moment from 'moment';
import { getTimelineData } from '../../network/time-service';

export default function TimeDetail({ navigation }) {
  // const {getTimeline, timelineData = [] } = useTimeline();
  const { lang } = useLang();
  const { params } = useRoute();
  const crop = params?.data ?? {};
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  useFocusEffect(
    useCallback(() => {
      getData();
    }, [navigation, lang]),
  );
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
  console.log(crop, '----name--')
  console.log(data, '----data--')

  return (
    <BaseView>
      <Header
        style={{ marginTop: 10 }}
        leftComponent={
          <Icon name="back" size={28} color={green} onPress={() => goBack()} />
        }
        centerComponent={<Text h2 style={{ color: green, fontWeight: "bold", }}>
          {crop?.crop}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <TimeList data={data} />
      <Button
        iconName="plus"
        iconColor={white}
        label={strings.add_event}
        btnStyle={{
          width: 'auto',
          height: 50,
          position: 'absolute',
          bottom: 20,
          right: 30,
          zIndex: 999,
        }}
        onPress={() => navigate('AddEvent', { crop })}
      />
    </BaseView>
  );
}

const styles = StyleSheet.create({});
