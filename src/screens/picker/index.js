import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { useLang } from 'src/context/langContext';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import Button from '../../components/button';
import { navigate } from '../../navigation/ref';
import {
  getAllPickerExpense,
  getPickerData,
  getPickerGroup,
} from '../../network/picker-service';
import DateWiseList from '../../container/picker/dateWiseList';
import Loader from '../../components/loader';
import { gray10, green, yellow, white, black, gray3 } from '../../utils/color';
import { useCotton } from '../../context/cottonContext';
import {
  createCottonPriceTable,
  createPickerExpenseTable,
  createPickerTable,
  deleteDBConnectionDB,
  getAllItems,
  savePickerData,
  savePickerExpenseData,
  updatePickerGid,
} from '../../sql';
import { PixelRatio, ScrollView, TouchableOpacity, View } from 'react-native';
import Icon from '../../components/icon';
import Search from '../../components/search';
import SyncLocal from '../../container/picker/syncLocal';
import { sumBy, groupBy, sortBy, some, every } from 'lodash';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';
import GroupList from '../../container/picker/groupList';
import Header from '../../components/header';
import { PCIKER_TABLE, PICKER_EXPENSE_TABLE } from '../../sql/tabels';

export default function Picker() {
  const { lang } = useLang();
  const {
    db,
    getPickerWeight,
    pickerWeight = [],
    pickerExpense = [],
    getPickerExpense,
  } = useCotton();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const [filterBy, setFilterBy] = useState('grp');
  const [isSearchActive, setSearchActive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getPickerWeight();
      getPickerExpense();
    }, [lang, isFocused]),
  );

  useEffect(() => {
      getData();
  }, []);

  const getData = async () => {
    try {
      await createCottonPriceTable(db);
      await createPickerTable(db);
      await createPickerExpenseTable(db);
      let pdata = await getAllItems(db, PCIKER_TABLE)
      if (
        pdata == undefined ||
        (Array.isArray(pdata) && pdata.length == 0)
      ) {
      console.log( '-=-=-=-=-=-=-=-=-=----',  pdata == undefined,
      (Array.isArray(pdata) && pdata.length == 0),pdata.length,pickerExpense.length)
        setLoading(true);
        let wt = await getPickerData();
        if (Array.isArray(wt) && wt.length) {
          wt.map((o, i) => ({ ...o, id: i + 1 }));
          await savePickerData(db, wt);
          let grp = await getPickerGroup();
          let promise = grp.map(o =>
            o?.pickers.map(
              async picker =>
                await updatePickerGid(db, {
                  uid: o?.uid,
                  gid: o?.id,
                  gname: o?.name,
                  picker: picker,
                }),
            ),
          );
          await Promise.all(promise);
          await getPickerWeight();
        }
        setLoading(false);
      }
      let pedata = await getAllItems(db, PICKER_EXPENSE_TABLE)
      if (
        pedata == undefined ||
        (Array.isArray(pedata) && pedata.length == 0)
      ) {
        setLoading(true);
        let ex = await getAllPickerExpense();
        if (Array.isArray(ex) && ex.length) {
          ex.map((o, i) => ({ ...o, id: i + 1 }));
          await savePickerExpenseData(db, ex);
          await getPickerExpense();
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  
  return (
    <BaseView>
      <SyncLocal />
      <View
        style={{
          width: '100%',
          alignItem: 'center',
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            zIndex: 99,
            display: !isSearchActive ? 'flex' : 'none',
          }}
          hitSlop={20}
          onPress={() => {
            navigate('Analysis');
          }}>
          <Icon
            name={'barschart'}
            size={25}
            color={gray10}
            onPress={() => {
              navigate('Analysis');
            }}
          />
        </TouchableOpacity>

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
      <Loader visible={loading} small />

      {!isSearchActive && (
        <>
          {Array.isArray(pickerWeight) &&
            pickerWeight.length == 0 ||
            every(pickerWeight, o => !o?.gname) ? null : (
            <Header
              leftComponent={
                <Button
                  label={strings.group}
                  btnStyle={{
                    width: '50%',
                    borderRadius: 5,
                    height: 35 * PixelRatio.getFontScale(),
                    backgroundColor: filterBy == 'grp' ? green : gray3,
                  }}
                  onPress={() => setFilterBy('grp')}
                />
              }
              rightComponent={
                <Button
                  label={strings.pickers_list}
                  btnStyle={{
                    width: '50%',
                    height: 35 * PixelRatio.getFontScale(),
                    borderRadius: 5,
                    backgroundColor: filterBy == 'picker' ? green : gray3,
                  }}
                  onPress={() => setFilterBy('picker')}
                />
              }
            />
          )}
          {(Array.isArray(pickerWeight) && pickerWeight.length == 0) || every(pickerWeight, o => !o?.gname) ||
            filterBy == 'picker' ? (
            <DateWiseList
              pickerWeight={pickerWeight}
              pickerExpense={pickerExpense}
            />
          ) : (
            <GroupList
              pickerWeight={pickerWeight}
              pickerExpense={pickerExpense}
            />
          )}
          <Button
            label={strings.create_group}
            // hitSlop={10}
            btnStyle={{
              width: `${40 * PixelRatio.getFontScale()}%`,
              height: 40 * PixelRatio.getFontScale(),
              height: 40 * PixelRatio.getFontScale(),
              position: 'absolute',
              bottom: 20,
              left: 20,
              zIndex: 999,
              display:
                Array.isArray(pickerWeight) && pickerWeight.length > 0
                  ? 'flex'
                  : 'none',
              backgroundColor: yellow,
            }}
            txtStyle={{ color: black }}
            onPress={() => navigate('Group')}
          />
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
