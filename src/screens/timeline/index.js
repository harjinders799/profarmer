import {StyleSheet, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import {useLang} from 'src/context/langContext';
import Loader from '../../components/loader';
import {strings} from '../../translations/locale';
import Button from '../../components/button';
import {aqua, black, blue, brown, cyan, gray11, gray4, green, lightGreen, lightOrange, lightYellow, orange, parrot, peach, red, white, yellowLight} from '../../utils/color';

import {navigate} from 'src/navigation/ref';
import LoanList from '../../container/loan/loanList';
import {useFocusEffect} from '@react-navigation/native';
import TimeList from '../../container/timeLine/timeList';
import {useTimeline} from '../../context/timeContext';

export default function Timeline({navigation}) {
  const crops = [
    {
      label: strings.cotton,
      crop:'cotton',
      backgroundColor: gray11,
    },
    {
      label: strings.rice,
      crop:'rice',
      backgroundColor: gray11,
    },
    {
      label: strings.wheat,
      crop:'wheat',
      backgroundColor: brown,
    },
    {
      label: strings.barley,
      crop:'barley',
      backgroundColor: orange,
    },
    {
      label: strings.mustard,
      crop:'mustard',
      backgroundColor: '#5d421f',
    },
    {
      label: strings.millet,
      crop:'millet',
      backgroundColor: gray4,
    },
    {
      label: strings.maize,
      crop:'maize',
      backgroundColor: lightYellow,
    },

    {
      label: strings.orange,
      crop:'orange',
      backgroundColor: lightOrange,
    },

    {
      label: strings.guar,
      crop:'guar',
      backgroundColor: lightGreen,
    },

    {
      label: strings.vegetable,
      crop:'vegetable',
      backgroundColor: parrot,
    },  
      {
      label: strings.fruit,
      crop:'fruit',
      backgroundColor: peach,
    },  
      {
      label: strings.other,
      crop:'other',
      backgroundColor: cyan,
    },
  ];
  // useFocusEffect(
  //   useCallback(() => {
  //     getTimeline();
  //   }, [navigation, lang]),
  // );
  return (
    <BaseView>
      <View style={styles.button}>
        {crops.map(crop=>(

        <Button
        key={crop.label}
          iconName="plus"
          iconColor={white}
          label={crop.label}
          btnStyle={{
            width: '47%',
            height: 50,
            elevation:3,
            backgroundColor:crop.backgroundColor,
            color:black,
          }}
          onPress={() => navigate('TimeDetail',{data:crop})}
        />
        ))}
       
      </View>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap:'wrap',
    width: '100%',
  },
});
