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
import { addNewCrop, updateCrop } from '@network/crop-service';
import DropdownPicker from '@components/dropdown';
import { common } from '@utils/style';
import { currentStamp, dateFormat } from '@utils/dateformat';
import DateTimePicker from '@components/DateTime';
import { useCropTracker } from '@context/cropTrackerContext';

export default function AddCrop() {
  const { params } = useRoute();
  const { getMyCrops, getPublicCrops } = useCropTracker();
  const editData = params?.data ?? {};
  const addSowingData = params?.addSowingData ?? false;
  const addStopDate = params?.addStopDate ?? false;
  const [showDate, setShowDate] = useState(addSowingData);
  const [showStopDate, setShowStopDate] = useState(addStopDate);

  const [data, setData] = useState({
    name: editData?.name ?? '',
    variety: editData?.variety ?? '',
    farm: editData?.farm ?? '',
    totalArea: editData?.totalArea ?? '',
    areaUnit: editData?.areaUnit ?? 'bigha',
    isPublic: editData?.isPublic ?? 'private',
    dateOfSowing: editData?.dateOfSowing
      ? new Date(editData?.dateOfSowing)
      : addSowingData
        ? new Date()
        : null,
    cropPeriodCompleted: editData?.cropPeriodCompleted
      ? new Date(editData?.cropPeriodCompleted)
      : addStopDate
        ? new Date()
        : null,
  });
  const [loading, setLoading] = useState(false);
  const { name, variety, farm, totalArea, areaUnit, isPublic, dateOfSowing, cropPeriodCompleted } =
    data;

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      editData?.id
        ? await updateCrop({
          id: editData?.id,
          ...data,
          dateOfSowing: currentStamp(dateOfSowing),
          cropPeriodCompleted: currentStamp(cropPeriodCompleted),
        })
        : await addNewCrop(data);
      setLoading(false);
      ToastSuccess(strings.successfully_saved);
      isPublic == 'public' ? getPublicCrops() : getMyCrops();
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  }, [data, editData]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header back label={strings.add_crop} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Input
            entering={FadeInDown.delay(350)}
            label={strings.name}
            placeholder={strings.name}
            autoCapitalize="words"
            value={name}
            autoFocus
            setValue={value => onChangeValue({ setData, key: 'name', value })}
          />
          <View style={common.row_btw}>
            <Input
              entering={FadeInDown.delay(400)}
              label={strings.variety}
              placeholder={'ABC, BWB303...'}
              value={variety}
              setValue={value =>
                onChangeValue({ setData, key: 'variety', value })
              }
              style={{ width: '48%' }}
            />
            <Input
              entering={FadeInDown.delay(450)}
              label={strings.farm}
              placeholder={'9BGS, 2LNP...'}
              value={farm}
              setValue={value => onChangeValue({ setData, key: 'farm', value })}
              style={{ width: '48%' }}
            />
          </View>
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
          <DropdownPicker
            entering={FadeInDown.delay(450)}
            data={[
              { label: strings.public, value: 'public' },
              { label: strings.private, value: 'private' },
            ]}
            label={strings.public_access_placeholder}
            labelField="label"
            valueField="value"
            placeholder={strings.public_access_placeholder}
            value={isPublic}
            onChange={value => {
              onChangeValue({ setData, key: 'isPublic', value: value?.value });
            }}
          />
          {addSowingData || editData?.dateOfSowing ? (
            <>
              <Pressable
                onPress={() => {
                  setShowDate(true);
                  Keyboard.dismiss();
                }}>
                <Input
                  entering={FadeInDown.delay(450)}
                  label={strings.date_of_sowing}
                  editable={false}
                  placeholder={strings.date}
                  value={dateFormat(dateOfSowing)}
                  onPress={() => {
                    setShowDate(true);
                    Keyboard.dismiss();
                  }}
                />
              </Pressable>
              <DateTimePicker
                show={showDate}
                setShow={setShowDate}
                date={dateOfSowing}
                setDate={value =>
                  onChangeValue({ setData, key: 'dateOfSowing', value })
                }
              />
            </>
          ) : null}
          {addStopDate || editData?.cropPeriodCompleted ? (
            <>
              <Pressable
                onPress={() => {
                  setShowDate(true);
                  Keyboard.dismiss();
                }}>
                <Input
                  entering={FadeInDown.delay(450)}
                  label={strings.crop_period_completed}
                  editable={false}
                  placeholder={strings.date}
                  value={dateFormat(cropPeriodCompleted)}
                  onPress={() => {
                    setShowDate(true);
                    Keyboard.dismiss();
                  }}
                />
              </Pressable>
              <DateTimePicker
                show={showStopDate}
                setShow={setShowStopDate}
                date={cropPeriodCompleted}
                setDate={value =>
                  onChangeValue({ setData, key: 'cropPeriodCompleted', value })
                }
              />
            </>
          ) : null}
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
