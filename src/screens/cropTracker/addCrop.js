import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import { addNewCrop } from '@network/crop-service';

export default function AddCrop() {
  const { params } = useRoute();
  const editData = params?.item ?? {};

  const [data, setData] = useState({
    name: editData?.name ?? '',
    variety: editData?.variety ?? '',
    farm: editData?.farm ?? '',
  });
  const [loading, setLoading] = useState(false);
  const { name, variety, farm } = data;

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      await addNewCrop(data);
      setLoading(false);
      ToastSuccess(strings.successfully_saved,);
      goBack();
    } catch (error) {
      setLoading(false);
      ToastError(error?.message);
    }
  }, [data]);

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
            value={name}
            autoFocus
            setValue={value =>
              onChangeValue({ setData, key: 'name', value, isName: true })
            }
          />
          <Input
            entering={FadeInDown.delay(400)}
            label={strings.variety}
            placeholder={'ABC, BWB303...'}
            value={variety}
            setValue={value =>
              onChangeValue({ setData, key: 'variety', value, isName: true })
            }
          />
          <Input
            entering={FadeInDown.delay(450)}
            label={strings.farm}
            placeholder={'9BGS, 2LNP...'}
            value={farm}
            setValue={value =>
              onChangeValue({ setData, key: 'farm', value, isName: true })
            }
          />
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
