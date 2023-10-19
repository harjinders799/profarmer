import {StyleSheet, ScrollView, TouchableOpacity, View} from 'react-native';
import React, {useState, useCallback} from 'react';
import Text from 'src/components/text';
import BaseView from 'src/container/base';
import {useLang} from 'src/context/langContext';
import Loader from '../../components/loader';
import {strings} from '../../translations/locale';
import Button from '../../components/button';
import {
  gray4,
  green,
  greenLight,
  lightYellow,
  peach,
  red,
  white,
} from '../../utils/color';
import Header from '../../components/header';
import Icon from '../../components/icon';
import {ToastError} from '../../utils/toast';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {goBack, navigate} from '../../navigation/ref';
import {useRoute} from '@react-navigation/native';
import {groupBy, sortBy, sumBy} from 'lodash';
import moment from 'moment';
import {currencyFormat} from 'src/utils/dateformat';
import {useHarvest} from '../../context/harvestContext';
import HarvestAction from '../../container/harvest/harvestAction';

const transparent = 'rgba(0,0,0,0.5)';

export default function HarvestDetail({navigation}) {
  const {params} = useRoute();
  const {getHarvest, harvestData = []} = useHarvest();
  const data = params?.item ?? {};
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const [rate, setRate] = useState();

  useFocusEffect(
    useCallback(() => {
      getHarvest();
      // getData();
    }, [navigation]),
  );
  const filteredData = harvestData.filter(item => item.name === data.name);
  let amount = parseFloat(data.field) * parseFloat(data.rate);
  console.log(harvestData, '--harvestData--');
  return (
    <BaseView>
      <Header
        style={styles.header}
        leftComponent={
          <Icon name="back" size={28} color={white} onPress={() => goBack()} />
        }
        centerComponent={
          <Text h2 style={{color: white, fontWeight: 'bold'}}>
            {data.name}
          </Text>
        }
        rightComponent={
          <View style={{flexDirection: 'row'}}>
            <Icon
              name="pdffile1"
              size={25}
              color={white}
              style={{
                marginRight: 15,
                // display: giver.length > 1 ? 'flex' : 'none',
              }}
              // onPress={onShare}
            />

            <TouchableOpacity
              onPress={() => {
                // setopenModal(true);
              }}>
              <Icon
                name="delete"
                size={30}
                color={white}
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
            {/* {renderModal()} */}
          </View>
        }
      />
      <View style={[styles.list]}>
        <View style={[styles.card, {borderColor: lightYellow + 80}]}>
          <Text h3>{strings.crop_name}1</Text>
          <Text h3>{data.crop}</Text>
        </View>
        <View style={[styles.card, {borderColor: greenLight}]}>
          <Text h3>{strings.crop_name}2</Text>
          <Text h3>{data.crop}</Text>
        </View>
        <View style={[styles.card, {borderColor: peach}]}>
          <Text h3>{strings.total_amount}</Text>
          {/* <Text h3>{currencyFormat(a))}</Text> */}
        </View>
      </View>

      <View style={styles.wt}>
        <Text
          h3
          style={[
            styles.underline,
            {backgroundColor: greenLight, width: '100%', textAlign: 'center'},
          ]}>
          {strings.harvest_record}
        </Text>

        <View style={styles.row}>
          <Text h4 style={{width: '20%', textAlign: 'left'}}>
            {strings.date}
          </Text>
          <Text h4 style={{width: '12%', textAlign: 'right'}}>
            {strings.field}
          </Text>
          <Text h4 style={{width: '30%', textAlign: 'right'}}>
            {strings.rate}
          </Text>
          <Text h4 style={{width: '35%', textAlign: 'right'}}>
            {strings.amount}
          </Text>
        </View>
        <ScrollView
          style={{width: '100%', height: '40%'}}
          // contentContainerStyle={{paddingBottom: 150}}
          showsVerticalScrollIndicator={false}>
          {Array.isArray(filteredData) && filteredData.length ? (
            sortBy(
              filteredData,
              (a, b) => moment(b?.date) - moment(a?.date),
            ).map((v, i) => <HarvestAction key={i} data={v} />)
          ) : (
            <Text>0</Text>
          )}
        </ScrollView>
        <Button
        iconName="plus"
        iconColor={white}
        label={strings.add_harvest}
        btnStyle={{
          width: 'auto',
          paddingHorizontal: 15,
          height: 50,
          position: 'absolute',
          bottom: 20,
          right: 30,
          zIndex: 999,
        }}
        onPress={() => navigate('AddHarvest',{ data: { name: data?.name } })}
      />
      </View>
    </BaseView>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: green,
    paddingHorizontal: 25,
    paddingVertical: 15,
    width: '120%',
  },
  list: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 5,
    flexWrap: 'wrap',
  },
  wt: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
  },
  underline: {
    paddingVertical: 10,
    marginVertical: 10,
  },
  card: {
    backgroundColor: white,
    width: '100%',
    flexDirection: 'row',
    borderRadius: 10,
    justifyContent: 'space-between',
    padding: 10,
    elevation: 5,
    marginVertical: 5,
    borderWidth: 3,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: transparent,
  },
});