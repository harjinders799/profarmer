import React, { useState } from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import { strings } from 'src/translations/locale';
import { black, gray3, green, white } from '../../utils/color';
import { useCotton } from '../../context/cottonContext';
import { View, ScrollView, PixelRatio } from 'react-native';
import { sumBy, groupBy } from 'lodash';
import moment from 'moment';
import Header from '../../components/header';
import Button from '../../components/button';
import { currencyFormat } from '../../utils/dateformat';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';

export default function Analysis({ navigation }) {
  const [filterBy, setFilterBy] = useState('wt');
  const {
    pickerWeight = [],
    pickerExpense = [],
  } = useCotton();


  let dateWise = groupBy(pickerWeight, v =>
    moment(v?.date).format('DD-MM-YYYY'),
  );
  let dateWiseCost = groupBy(pickerExpense, v =>
    moment(v?.date).format('DD-MM-YYYY'),
  );

  return (
    <BaseView>
      <Header
        style={{ marginTop: 10 }}
        leftComponent={
          <Icon
            name="back"
            size={28}
            color={black}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text h2>{strings.pickers}</Text>}
        rightComponent={<Text h2> </Text>}
      />
      <Header
        leftComponent={
          <Button
            label={'By Weight'}
            btnStyle={{
              width: '50%',
              height: 35 * PixelRatio.getFontScale(),
              borderRadius: 5,
              backgroundColor: filterBy == 'wt' ? green : gray3,
            }}
            onPress={() => setFilterBy('wt')}
          />
        }
        rightComponent={
          <Button
            label={'By Cost'}
            btnStyle={{
              width: '50%',
              height: 35 * PixelRatio.getFontScale(),
              borderRadius: 5,
              backgroundColor: filterBy == 'cost' ? green : gray3,
            }}
            onPress={() => setFilterBy('cost')}
          />
        }
      />
      {filterBy == 'wt' ? (
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: '80%' }}>
            {Object.keys(dateWise)
              .reverse()
              .map((o, index) => (
                <View
                  key={index}
                  style={{
                    borderBottomWidth: 0.5,
                    display:
                      sumBy(dateWise[o], o => parseFloat(o.weight)) == 0
                        ? 'none'
                        : 'flex',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // borderBottomWidth: 0.5,
                      marginTop: 20,
                      padding: 5,
                      backgroundColor: '#4CAF99',
                      // display: sumBy(dateWiseCost[o], o => parseFloat(o.weight)) == 0 ? 'none' : 'flex'
                    }}>
                    <Text h4 style={{ color: white, fontWeight: '800' }}>{o}</Text>
                    <Text h4 style={{ color: white, fontWeight: '800' }}>
                      {sumBy(dateWise[o], o => parseFloat(o.weight))} Kg
                    </Text>
                  </View>
                  {dateWise[o].map((picker, key) => (
                    <View
                      key={key}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        marginBottom: 5,
                        width: '100%',
                        // marginTop:30
                        display: picker?.weight == 0 ? 'none' : 'flex',
                      }}>
                      <Text>{picker?.picker}</Text>
                      <Text>{picker.weight} Kg</Text>
                    </View>
                  ))}
                </View>
              ))}
          </ScrollView>
        </View>
      ) : (
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
            <Text h3>{strings.total_amount}</Text>
            <Text h2 style={{ fontWeight: 'bold' }}>
              {currencyFormat(sumBy(pickerExpense, o => parseFloat(o.amount)))}
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: '80%' }}>
            {Object.keys(dateWiseCost)
              .reverse()
              .map((o, index) => (
                <View
                  key={index}
                  style={{
                    borderBottomWidth: 0.5,
                    display:
                      sumBy(dateWiseCost[o], o => parseFloat(o.amount)) == 0
                        ? 'none'
                        : 'flex',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // borderBottomWidth: 0.5,
                      marginTop: 20,
                      padding: 5,
                      backgroundColor: '#4CAF99',
                      // display: sumBy(dateWiseCost[o], o => parseFloat(o.weight)) == 0 ? 'none' : 'flex'
                    }}>
                    <Text h4 style={{ color: white, fontWeight: '800' }}>{o}</Text>
                    <Text h4 style={{ color: white, fontWeight: '800' }}>
                      {currencyFormat(sumBy(dateWiseCost[o], o => parseFloat(o.amount)))}
                    </Text>
                  </View>
                  {dateWiseCost[o].map((picker, key) => (
                    <View
                      key={key}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        marginBottom: 5,
                        width: '100%',
                        // marginTop:30
                        display: picker?.amount == 0 ? 'none' : 'flex',
                      }}>
                      <Text>{picker?.picker}</Text>
                      <Text>{currencyFormat(parseFloat(picker.amount))}</Text>
                    </View>
                  ))}
                </View>
              ))}
          </ScrollView>
        </View>
      )}
    </BaseView>
  );
}
