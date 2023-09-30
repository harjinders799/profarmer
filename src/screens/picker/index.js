import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { useLang } from 'src/context/langContext';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import Button from '../../components/button';
import { navigate } from '../../navigation/ref';
import { getAllPickerExpense, getPickerData } from '../../network/picker-service';
import DateWiseList from '../../container/picker/dateWiseList';
import Loader from '../../components/loader';
import { gray10, green, red, white } from '../../utils/color';
import { useCotton } from '../../context/cottonContext';
import {
  createCottonPriceTable,
  createPickerExpenseTable,
  createPickerTable,
  deleteDBConnectionDB,
  savePickerData,
  savePickerExpenseData,
} from '../../sql';
import { PixelRatio, ScrollView, View } from 'react-native';
import Icon from '../../components/icon';
import Search from '../../components/search';
import SyncLocal from '../../container/picker/syncLocal';
import { sumBy, groupBy, sortBy } from 'lodash';
import moment from 'moment';

export default function Picker({ navigation }) {
  const { lang } = useLang();
  const {
    db,
    getPickerWeight,
    pickerWeight = [],
    getPickerExpense,
  } = useCotton();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const [isSearchActive, setSearchActive] = useState(false);

  const [isTextVisible, setTextVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getData();
      getPickerWeight();
      getPickerExpense();
    }, [lang, isFocused]),
  );
  const getData = async () => {
    try {
      // console.log(pickerWeight.length, '-=-=-=-=-=-=-=-=-=----');
      await createCottonPriceTable(db);
      await createPickerTable(db);
      await createPickerExpenseTable(db);
      // console.log(pickerWeight, '-=-=-=-=-=-=-=-=-=----')
      if (
        pickerWeight == undefined ||
        (Array.isArray(pickerWeight) && pickerWeight.length == 0)
      ) {
        setLoading(true);
      }
      let wt = await getPickerData();
      if (Array.isArray(wt) && wt.length) {
        wt.map((o, i) => ({ ...o, id: i + 1 }));
        await savePickerData(db, wt);
      }
      let ex = await getAllPickerExpense();
      if (Array.isArray(ex) && ex.length) {
        ex.map((o, i) => ({ ...o, id: i + 1 }));
        await savePickerExpenseData(db, ex);
      }
      await getPickerWeight();
      await getPickerExpense();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  let dateWise = groupBy(
    sortBy(pickerWeight, d => d?.date),
    v => moment(v?.date).format('DD-MM-YYYY'),
  );

  return (
    <BaseView>
      <Loader visible={loading} />
      {/* <MandiPrice /> */}
      <SyncLocal />
      <View
        style={{
          width: '100%',
          alignItem: 'center',
        }}>
        <Icon
          name={isTextVisible ? 'eye' : 'eye-off'}
          type="Ionicons"
          size={25}
          color={gray10}
          style={{
            position: 'absolute',
            zIndex: 99,
            display: !isSearchActive ? 'flex' : 'none',
          }}
          onPress={() => setTextVisible(!isTextVisible)}
        />

        <Text
          h3
          style={{ paddingBottom: 10, textAlign: 'center' }}
        // onPress={async () => await deleteDBConnectionDB()}
        >
          {strings.picker_record}
        </Text>
        <Search
          isSearchActive={isSearchActive}
          setSearchActive={setSearchActive}
        />
      </View>

      {!isSearchActive && (
        <>
          {isTextVisible && (
            <View
              style={{
                width: '100%',
              }}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderBottomWidth: 0.5,
                  marginVertical: 10,
                }}>
                <Text h3>{strings.total_weight}</Text>
                <Text h2 style={{ fontWeight: 'bold' }}>
                  {sumBy(pickerWeight, o => parseFloat(o.weight))} Kg
                </Text>
              </View>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 250 }}>

                {Object.keys(dateWise)
                  .reverse()
                  .map((o, index) => (
                    <View key={index}
                      style={{
                        width: '100%',
                        borderBottomWidth: 0.5,
                        marginVertical: 10,
                      }}
                    >
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginVertical: 10,
                          padding: 5,
                          backgroundColor: green
                        }}>
                        <Text style={{ color: white }}>{o}</Text>
                        <Text style={{ color: white }}>
                          {sumBy(dateWise[o], o => parseFloat(o.weight))} Kg
                        </Text>
                      </View>
                      {dateWise[o].map((picker, key) =>
                        <View
                          key={key}
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            // borderBottomWidth: 0.5,
                            marginVertical: 10,
                            display: picker?.weight == "0" ? 'none' : 'flex'
                          }}>
                          <Text h6>{picker?.picker}</Text>
                          <Text h6>
                            {parseFloat(picker?.weight)} Kg
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}
              </ScrollView>
            </View>
          )}

          <DateWiseList />
          <Button
            iconName="plus"
            iconColor={white}
            label={strings.add_picker}
            btnStyle={{
              width: `${40 * PixelRatio.getFontScale()}%`,
              height: 40 * PixelRatio.getFontScale(),
              position: 'absolute',
              bottom: 20,
              right: 20,
              zIndex: 999,
            }}
            onPress={() => navigate('AddPicker')}
          />
        </>
      )}
    </BaseView>
  );
}
