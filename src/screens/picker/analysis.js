import React, { useCallback, useEffect, useState } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { useLang } from 'src/context/langContext';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { strings } from 'src/translations/locale';
import { getAllPickerExpense, getPickerData } from '../../network/picker-service';
import Loader from '../../components/loader';
import { gray10, red, white } from '../../utils/color';
import { useCotton } from '../../context/cottonContext';
import {
  createCottonPriceTable,
  createPickerExpenseTable,
  createPickerTable,
  deleteDBConnectionDB,
  savePickerData,
  savePickerExpenseData,
} from '../../sql';
import { PixelRatio, View, ScrollView, } from 'react-native';
import { sumBy, groupBy } from 'lodash';
import moment from 'moment';
import { useRoute } from '@react-navigation/native';


export default function Picker({ navigation }) {
  const { lang } = useLang();
  const { params } = useRoute();
  const data = params?.data ?? {};
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
  let dateWise = groupBy(pickerWeight, v =>
    moment(v?.date).format('DD-MM-YYYY'),
    console.log(pickerWeight,'======++++++====')
  );
  return (
    <BaseView>
      <Loader visible={loading} small 
       />
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
              <ScrollView showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 150,}}>
              {Object.keys(dateWise)
                .reverse()
                .map((o, index) => (
                  <View style={{
                    borderBottomWidth: 0.5,
                    display: sumBy(dateWise[o], o => parseFloat(o.weight)) == 0 ? 'none' : 'flex'
                  }}>
                    <View
                      key={index}
                      style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        // borderBottomWidth: 0.5,
                        marginVertical: 10,
                        backgroundColor: "#4CAF99",
                        // display: sumBy(dateWise[o], o => parseFloat(o.weight)) == 0 ? 'none' : 'flex'
                      }}>
                      <Text style={{ color: white }}>{o}</Text>
                      <Text style={{ color: white }}>
                        {sumBy(dateWise[o], o => parseFloat(o.weight))} Kg
                      </Text>
                    </View>
                    {dateWise[o].map(( picker,key)=>
                    <View 
                    key={key}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 10,
                      width: "100%",
                      // marginTop:30
                    display:(picker?.weight)== 0 ? 'none' : 'flex'
                    }}>
                      <Text>
                        {picker?.picker}
                      </Text>
                      <Text>
                        {picker.weight} Kg
                      </Text>
                    </View>)}
                  </View>
                ))}
                </ScrollView>
            </View>
            </BaseView>
  );
}