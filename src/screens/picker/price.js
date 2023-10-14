import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { load } from 'react-native-cheerio';
import Text from '../../components/text';
import { strings } from 'src/translations/locale';
import { green, red, white } from '../../utils/color';
import { useCotton } from '../../context/cottonContext';
import Header from '../../components/header';
import Icon from '../../components/icon';
import { goBack } from '../../navigation/ref';
import BaseView from '../../container/base';

const Price = () => {
  const { cottonPrice, db, getCottonPrice } = useCotton();

  // useEffect(() => {
  //     getCottonPrice();
  //     (async () => {
  //         let res = await getPrice();
  //         if (Array.isArray(res)) {
  //             getCottonPrice();
  //         }
  //     })();
  // }, []);
  return Array.isArray(cottonPrice) && cottonPrice.length ? (
    <BaseView>
      <Header
        style={styles.head}
        leftComponent={
          <Icon
            name="back"
            size={28}
            color={white}
            style={{ marginRight: 5 }}
            onPress={() => goBack()}
          />
        }
        centerComponent={<Text style={styles.header}> {strings.price} </Text>}
      // rightComponent={
      //   <Icon
      //     name="back"
      //     size={28}
      //     color={'#227371'}
      //     style={{marginRight: 5}}
      //     onPress={() => goBack()}
      //   />
      // }
      />
      <ScrollView style={[styles.list]}>
        {cottonPrice.map((item, index) => (
          <View key={index} style={styles.card}>
            <TouchableOpacity>
              <Icon
                name="edit"
                size={20}
                color={'#7a3767'}
                style={{ paddingStart: '90%' }}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingBottom: 5,
              }}>
              <Text h3 style={{ width: '60%' }}>
                {item?.market}
              </Text>
              <Text h4>{item?.arrivalDate}</Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text h4 style={{ color: green }}>
                {item?.maxPrice.replace('/ Quintal', 'max')}
              </Text>
              <Text h4 style={{ color: red }}>
                {item?.minPrice.replace('/ Quintal', 'min')}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </BaseView>
  ) : null;
};

export default Price;

const styles = StyleSheet.create({
  head: {
    paddingHorizontal: 20,
    backgroundColor: green,
    width: '115%',
    height: 50,
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontStyle: 'italic',
    alignItems: 'center',
    fontSize: 20,
    color: white,
  },
  list: {
    marginVertical: 20,
    width: '100%',
  },
  card: {
    // height: 100,
    marginVertical: 5,
    elevation: 5,
    backgroundColor: '#e6dac3',
    padding: 10,
    borderRadius: 10,
  },
});
// backgroundColor:'#f7cddb', cardlist={{backgroundColor:'#e6dac3'}}
// scroll={{backgroundColor:"#a4f5ef",}}
