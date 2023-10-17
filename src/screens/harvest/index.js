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
import { useHarvest } from '../../context/harvestContext';
import { ToastError } from '../../utils/toast';
import HarvestList from '../../container/harvest/harvestList';

export default function Harvest({navigation}) {
  const { lang } = useLang();
  const { getHarvest,harvestData } = useHarvest();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

 
  useFocusEffect(
    useCallback(() => {
      getHarvest()
    }, [navigation, lang]),
  );
  
  // console.log(crop,'----crop')
  console.log(data,'----data')
  return (
    <BaseView>
    <Text h2 style={{ padding: 20, textAlign: 'center' }}>
      {strings.harvest_record}
    </Text>
      <HarvestList data={harvestData}/>
      {/* <HarvestList /> */}

      <Button
        iconName="plus"
        iconColor={white}
        label={strings.add_harvest}
        btnStyle={{
          width: 'auto',
          paddingHorizontal: 15,
          height: 50,
          position: 'absolute',
          bottom: 20,
          right: 30,
          zIndex: 999,
        }}
        onPress={() => navigate('AddHarvest')}
      />
    </BaseView>
  );
}

const styles = StyleSheet.create({});
