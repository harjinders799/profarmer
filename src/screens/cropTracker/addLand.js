import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import Loader from '@components/loader';
import BaseView from '@container/base';
import { ToastError, ToastSuccess } from '@utils/toast';
import { strings } from '@translations/locale';
import { goBack } from '@navigation/ref';
import Header from '@components/header';
import { FadeInDown } from 'react-native-reanimated';
import { onChangeValue } from '@utils/helper';
import { addNewCrop, addNewLand, updateCrop } from '@network/crop-service';
import DropdownPicker from '@components/dropdown';
import { common } from '@utils/style';
import { currentStamp, dateFormat } from '@utils/dateformat';
import DateTimePicker from '@components/DateTime';
import { useCropTracker } from '@context/cropTrackerContext';

export default function AddLand() {
  const { params } = useRoute();
  const { getMyLands, getPublicCrops } = useCropTracker();
  const editData = params?.data ?? {};

  const [data, setData] = useState({
    name: editData?.name ?? '',
    // farm: editData?.farm ?? '',
    totalArea: editData?.totalArea ?? '',
    areaUnit: editData?.areaUnit ?? 'bigha',
  });

  const [loading, setLoading] = useState(false);
  const { name, totalArea, areaUnit } = data;

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      editData?.id
        ? await updateCrop({
          id: editData?.id,
          ...data,
        })
        : await addNewLand(data);
      setLoading(false);
      ToastSuccess(strings.successfully_saved);
      getMyLands();
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  }, [data, editData]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header back label={strings.add_land} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Input
            entering={FadeInDown.delay(350)}
            label={`${strings.farm} ${strings.name}`}
            placeholder={'9BGS, 2LNP, Puli Wala...'}
            autoCapitalize="words"
            value={name}
            autoFocus
            setValue={value => onChangeValue({ setData, key: 'name', value })}
          />
          {/* <Input
            entering={FadeInDown.delay(450)}
            label={strings.farm}
            value={farm}
            setValue={value => onChangeValue({ setData, key: 'farm', value })}
          /> */}
          <View style={common.row_btw}>
            <Input
              entering={FadeInDown.delay(400)}
              label={strings.total_area}
              placeholder={'2, 5, 20...'}
              numberType
              value={totalArea}
              setValue={value =>
                onChangeValue({
                  setData,
                  key: 'totalArea',
                  value,
                  isAmount: true,
                })
              }
              style={{ width: '48%' }}
            />
            <DropdownPicker
              entering={FadeInDown.delay(400)}
              data={[
                { label: strings.hectare, value: 'hectare' },
                { label: strings.acre, value: 'acre' },
                { label: strings.bigha, value: 'bigha' },
              ]}
              label={strings.area_unit}
              placeholder={strings.area_unit_placeholder}
              value={areaUnit}
              labelField="label"
              valueField="value"
              onChange={value => {
                onChangeValue({ setData, key: 'areaUnit', value: value?.value });
              }}
              style={{ width: '48%' }}
              dropdownStyle={{ height: 48, minHeight: 48 }}
            />
          </View>
          <Button
            entering={FadeInDown.delay(600)}
            label={strings.save}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingVertical: 25,
    width: '100%',
  },
});
