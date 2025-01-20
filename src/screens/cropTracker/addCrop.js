import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, Pressable } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
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
import Text from '@components/text';

export default function AddCrop() {
  const { params } = useRoute();
  const { colors } = useTheme();
  const { getMyCrops, refreshCrop, myCrops } = useCropTracker();
  const editData = params?.data ?? {};
  const editCrop = params?.crop ?? {};
  const addSowingData = params?.addSowingData ?? false;
  const addStopDate = params?.addStopDate ?? false;
  const [showDate, setShowDate] = useState(addSowingData);
  const [showStopDate, setShowStopDate] = useState(addStopDate);
  const [selectCrop, setSelectCrop] = useState([]);
  console.log(editData);
  const [data, setData] = useState({
    name: editCrop?.name ?? '',
    variety: editCrop?.variety ?? '',
    farm: editData?.name ?? '',
    totalArea: editCrop?.totalArea ?? '',
    areaUnit: editData?.areaUnit ?? 'bigha',
    isPublic: editCrop?.isPublic ?? 'private',
    dateOfSowing: editCrop?.dateOfSowing
      ? new Date(editCrop?.dateOfSowing)
      : addSowingData
        ? new Date()
        : null,
    cropPeriodCompleted: editCrop?.cropPeriodCompleted
      ? new Date(editCrop?.cropPeriodCompleted)
      : addStopDate
        ? new Date()
        : null,
  });
  const [loading, setLoading] = useState(false);
  const {
    name,
    variety,
    totalArea,
    isPublic,
    dateOfSowing,
    cropPeriodCompleted,
  } = data;

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      editData?.id && (selectCrop?.id || editCrop?.id)
        ? await updateCrop({
          id: editCrop?.id || selectCrop?.id,
          lid: editData?.id,
          ...data,
          remainingArea:
            editData?.remainingArea -
            (totalArea - (editCrop?.totalArea || 0)),
          dateOfSowing: dateOfSowing ? currentStamp(dateOfSowing) : null,
          cropPeriodCompleted: cropPeriodCompleted
            ? currentStamp(cropPeriodCompleted)
            : null,
        })
        : await addNewCrop({
          ...data,
          lid: editData?.id,
          remainingArea:
            editData?.remainingArea -
            (totalArea - (editCrop?.totalArea || 0)),
        });
      setLoading(false);
      ToastSuccess(strings.successfully_saved);
      refreshCrop(editCrop);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  }, [data, editData]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header back label={`${strings.add_crop} (${editData?.name})`} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        {Array.isArray(myCrops) &&
          myCrops.length > 0 &&
          (selectCrop?.name || (!data?.name && !data?.variety)) ? (
          <DropdownPicker
            entering={FadeInDown.delay(450)}
            data={myCrops.map(item => ({
              ...item,
              detail: `${item.name} ${item.variety} (${item.farm})`,
            }))}
            label={strings.crop}
            labelField="detail"
            valueField="id"
            placeholder={strings.crop}
            showSelectedOnFocus
            value={data}
            onChange={value => {
              setSelectCrop(value);
              setData(value);
            }}
          />
        ) : null}
        <Text
          center
          bold
          style={{
            marginTop: 25,
            display: data?.name || data?.variety ? 'none' : 'flex',
          }}>
          OR
        </Text>
        {/* {Array.isArray(crops) && crops.length == 0 ? ( */}
        <View style={styles.form}>
          <Input
            entering={FadeInDown.delay(350)}
            label={`${strings.crop} ${strings.name}`}
            placeholder={`${strings.crop} ${strings.name}`}
            autoCapitalize="words"
            value={name}
            autoFocus
            editable={!selectCrop?.id}
            inputStyle={{
              backgroundColor: selectCrop?.id
                ? colors.disable
                : colors.background,
            }}
            setValue={value => onChangeValue({ setData, key: 'name', value })}
          />
          <Input
            entering={FadeInDown.delay(400)}
            label={strings.variety}
            placeholder={'ABC, BWB303...'}
            value={variety}
            editable={!selectCrop?.id}
            inputStyle={{
              backgroundColor: selectCrop?.id
                ? colors.disable
                : colors.background,
            }}
            setValue={value => onChangeValue({ setData, key: 'variety', value })}
          />
          <Input
            entering={FadeInDown.delay(400)}
            label={`${strings.total_area} (${strings[editData?.areaUnit ?? 'bigha']
              })`}
            placeholder={'2, 5, 20...'}
            keyboardType={'numeric'}
            value={totalArea}
            setValue={value =>
              onChangeValue({
                setData,
                key: 'totalArea',
                value,
                isAmount: true,
              })
            }
          />
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
        </View>
        {/* ) : null} */}
        <Button
          entering={FadeInDown.delay(600)}
          label={strings.save}
          onPress={handleSubmit}
        />
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingVertical: 15,
    width: '100%',
  },
});
